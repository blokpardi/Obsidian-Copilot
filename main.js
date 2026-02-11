const { Plugin, TFolder, Notice } = require('obsidian');
const { exec } = require('child_process');
const path = require('path');

module.exports = class OpenClaudeCodePlugin extends Plugin {
	async onload() {
		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setTitle('Open Claude Code')
							.setIcon('terminal')
							.onClick(() => {
								this.openClaudeCode(file.path);
							});
					});
				}
			})
		);
	}

	openClaudeCode(folderPath) {
		const vaultPath = this.app.vault.adapter.basePath;
		const fullPath = folderPath === '/'
			? vaultPath
			: path.join(vaultPath, folderPath);

		const wtCommand = `wt.exe -w new -d "${fullPath}" powershell -NoExit -Command "claude . --dangerously-skip-permissions"`;

		exec(wtCommand, (error) => {
			if (error) {
				const fallbackCommand = `cmd.exe /c start "" powershell -NoExit -Command "cd '${fullPath}'; claude . --dangerously-skip-permissions"`;
				exec(fallbackCommand, (fallbackError) => {
					if (fallbackError) {
						new Notice(`Failed to open Claude Code: ${fallbackError.message}`);
					}
				});
			}
		});
	}
};
