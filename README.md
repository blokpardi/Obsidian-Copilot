# Obsidian Copilot

An Obsidian plugin that adds a right-click context menu option to open Copilot in a terminal at any folder location.

## Installation

### Via BRAT (recommended)

1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin from Obsidian's community plugins
2. Open BRAT settings → **Add Beta plugin**
3. Enter your repository: `YOUR_USERNAME/Obsidian-Copilot`
4. Enable **Obsidian Copilot** in Settings → Community plugins

### Manual

1. Download `main.js` and `manifest.json` from your latest release
2. Create a folder called `obsidian-copilot` in your vault's `.obsidian/plugins/` directory
3. Copy both files into that folder
4. Enable **Obsidian Copilot** in Settings → Community plugins

## Usage

Right-click any folder in the file explorer → **Open Copilot**

This opens a new terminal window at that folder's location and runs:

`agency copilot`

## Settings

Go to Settings → **Obsidian Copilot** to configure:

- **Shell**: Choose between PowerShell (default) or Command Prompt (cmd)

## Requirements

- Windows (desktop only)
- `agency` CLI available on your PATH
- [Windows Terminal](https://aka.ms/terminal) (recommended) — falls back to direct shell launch if not available
