# Deleometer Installation Guide

This guide provides detailed instructions for installing and testing the Deleometer plugin on different platforms.

## Table of Contents
1. [Desktop Installation](#desktop-installation)
2. [Web Interface Installation](#web-interface-installation)
3. [Mobile Installation](#mobile-installation)
4. [Testing the Plugin](#testing-the-plugin)
5. [Troubleshooting](#troubleshooting)

## Desktop Installation

### Method 1: Install from Obsidian Community Plugins

1. Open Obsidian on your desktop
2. Click on Settings (gear icon in the left sidebar)
3. Go to "Community plugins"
4. Turn off "Safe mode" if it's enabled
5. Click "Browse" to open the community plugins browser
6. Search for "Deleometer"
7. Click "Install"
8. After installation, enable the plugin by toggling the switch

### Method 2: Manual Installation (for testing)

1. Download the latest release from the [GitHub repository](https://github.com/MichelleGDyason/The_Obsidian_Deleometer/releases)
2. Extract the downloaded ZIP file
3. Move the extracted folder to your Obsidian plugins folder:
   - Windows: `%APPDATA%\\Obsidian\\plugins\\`
   - macOS: `~/Library/Application Support/obsidian/plugins/`
   - Linux: `~/.obsidian/plugins/`
4. Restart Obsidian
5. Go to Settings > Community plugins
6. Enable the Deleometer plugin

## Web Interface Installation

Obsidian Sync is required to use plugins on the web version of Obsidian.

1. First, install the plugin on your desktop Obsidian (see above)
2. Make sure you have an active Obsidian Sync subscription
3. Enable the plugin in your desktop vault
4. In Settings > Sync, ensure "Sync plugins" and "Sync plugin settings" are enabled
5. Wait for sync to complete
6. Open [Obsidian Web](https://obsidian.md/web)
7. Access your synced vault
8. The Deleometer plugin should be available and enabled

## Mobile Installation

### Android

1. Install the Obsidian app from the Google Play Store
2. Open Obsidian and create or open a vault
3. Tap the settings icon (gear) in the bottom right
4. Go to "Community plugins"
5. Turn off "Safe mode" if it's enabled
6. Tap "Browse" to open the community plugins browser
7. Search for "Deleometer"
8. Tap "Install"
9. After installation, enable the plugin by toggling the switch

### iOS

1. Install the Obsidian app from the App Store
2. Open Obsidian and create or open a vault
3. Tap the settings icon (gear) in the bottom right
4. Go to "Community plugins"
5. Turn off "Safe mode" if it's enabled
6. Tap "Browse" to open the community plugins browser
7. Search for "Deleometer"
8. Tap "Install"
9. After installation, enable the plugin by toggling the switch

## Testing the Plugin

After installation, you can test the Deleometer plugin with these steps:

### Basic Functionality Test

1. Create a new note in your vault
2. Write a journal entry (at least a few paragraphs)
3. Open the Command Palette (Ctrl/Cmd+P)
4. Search for "Deleometer: Analyze Journal Entry"
5. Run the command
6. The analysis results should appear in a modal

### Media Analysis Test

1. Add an image, audio, or film file to your vault
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Artistic Content"
4. Select the file you added
5. Choose which theoretical frameworks to apply
6. Click "Analyze"
7. Review the analysis results

### Framework Selection Test

1. Open the Command Palette (Ctrl/Cmd+P)
2. Search for "Deleometer: Analyze with Multiple Frameworks"
3. Select a file to analyze
4. In the framework selection interface, try:
   - Selecting individual frameworks
   - Using the "Select All" option
   - Using the "Select None" option
   - Selecting frameworks by category
5. Run the analysis and review the results

## Troubleshooting

### Plugin Not Appearing

- Make sure you've disabled Safe Mode in Settings > Community plugins
- Check if the plugin folder exists in your Obsidian plugins directory
- Try restarting Obsidian

### Analysis Not Working

- Verify you've entered a valid OpenAI API key in the plugin settings
- Check your internet connection
- Ensure the content you're trying to analyze is accessible

### Mobile Issues

- Make sure you have the latest version of the Obsidian mobile app
- Some features may work differently on mobile due to platform limitations
- Try restarting the app if features aren't working as expected

### Web Interface Issues

- Confirm you have an active Obsidian Sync subscription
- Verify that plugin syncing is enabled in your sync settings
- Some features may have limited functionality in the web interface

If you encounter persistent issues, please report them on the [GitHub repository](https://github.com/MichelleGDyason/The_Obsidian_Deleometer/issues) with detailed information about your setup and the steps to reproduce the problem.
