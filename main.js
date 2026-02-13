const { Plugin, TFolder, Notice, PluginSettingTab, Setting } = require('obsidian');
const { exec } = require('child_process');
const path = require('path');

const DEFAULT_SETTINGS = {
	shell: 'powershell'
};

class OpenCopilotSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Shell')
			.setDesc('Which shell to use when opening Copilot.')
			.addDropdown(dropdown => dropdown
				.addOption('powershell', 'PowerShell')
				.addOption('cmd', 'Command Prompt (cmd)')
				.setValue(this.plugin.settings.shell)
				.onChange(async (value) => {
					this.plugin.settings.shell = value;
					await this.plugin.saveSettings();
				}));
	}
}

module.exports = class OpenCopilotPlugin extends Plugin {
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new OpenCopilotSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setTitle('Open Copilot')
							.setIcon('terminal')
							.onClick(() => {
								this.openCopilot(file.path);
							});
					});
				}
			})
		);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	openCopilot(folderPath) {
		const vaultPath = this.app.vault.adapter.basePath;
		const fullPath = folderPath === '/'
			? vaultPath
			: path.join(vaultPath, folderPath);

		const copilotCmd = 'agency copilot';

		let wtCommand;
		let fallbackCommand;

		if (this.settings.shell === 'cmd') {
			wtCommand = `wt.exe -w new -d "${fullPath}" cmd /k ${copilotCmd}`;
			fallbackCommand = `cmd.exe /c start "" cmd /k "cd /d "${fullPath}" && ${copilotCmd}"`;
		} else {
			wtCommand = `wt.exe -w new -d "${fullPath}" powershell -NoExit -Command "${copilotCmd}"`;
			fallbackCommand = `cmd.exe /c start "" powershell -NoExit -Command "cd '${fullPath}'; ${copilotCmd}"`;
		}

		exec(wtCommand, (error) => {
			if (error) {
				exec(fallbackCommand, (fallbackError) => {
					if (fallbackError) {
						new Notice(`Failed to open Copilot: ${fallbackError.message}`);
					}
				});
			}
		});
	}
};
