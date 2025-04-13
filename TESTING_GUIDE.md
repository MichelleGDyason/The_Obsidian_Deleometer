# Deleometer Testing Guide

This guide provides step-by-step instructions for testing the Deleometer plugin on different platforms.

## Prerequisites

- Obsidian installed on your desktop
- Obsidian mobile app installed (for mobile testing)
- Obsidian Sync subscription (for web testing)
- Test files:
  - A journal entry (text file)
  - An image file (JPG, PNG)
  - An audio file (MP3, WAV)
  - A video file (MP4, MOV)

## Desktop Testing

### Installation

1. Download the plugin package from `dist/deleometer-plugin.zip`
2. Extract the ZIP file
3. Copy the extracted folder to your Obsidian plugins folder:
   - Windows: `%APPDATA%\\Obsidian\\plugins\\`
   - macOS: `~/Library/Application Support/obsidian/plugins/`
   - Linux: `~/.obsidian/plugins/`
4. Restart Obsidian
5. Go to Settings > Community plugins
6. Enable the Deleometer plugin

### Testing Journal Analysis

1. Create a new note with some journal content (at least a few paragraphs)
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Journal Entry"
4. Run the command
5. Verify that the analysis results appear in a modal
6. Check that the analysis includes emotional insights and recommendations

### Testing Artistic Analysis

#### Image Analysis
1. Add an image file to your vault
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Artistic Content"
4. Select the image file
5. In the framework selection interface, select multiple frameworks
6. Click "Analyze"
7. Verify that the analysis results appear and include insights from all selected frameworks

#### Audio Analysis
1. Add an audio file to your vault
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Artistic Content"
4. Select the audio file
5. In the framework selection interface, select multiple frameworks
6. Click "Analyze"
7. Verify that the analysis results appear and include insights from all selected frameworks

#### Film Analysis
1. Add a video file to your vault
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Artistic Content"
4. Select the video file
5. In the framework selection interface, select multiple frameworks
6. Click "Analyze"
7. Verify that the analysis results appear and include insights from all selected frameworks

#### Text Analysis
1. Create a text file with some content (different from your journal entry)
2. Open the Command Palette (Ctrl/Cmd+P)
3. Search for "Deleometer: Analyze Artistic Content"
4. Select the text file
5. In the framework selection interface, select multiple frameworks
6. Click "Analyze"
7. Verify that the analysis results appear and include insights from all selected frameworks

### Testing Comparative Analysis

1. Open the Command Palette (Ctrl/Cmd+P)
2. Search for "Deleometer: Comparative Analysis"
3. Select at least two files of different types (e.g., an image and a text file)
4. In the framework selection interface, select multiple frameworks
5. Click "Analyze"
6. Verify that the comparative analysis view opens
7. Check that you can switch between different tabs (Overview, Side by Side, Common Themes, Frameworks)
8. Verify that the analysis includes comparisons between the different files

## Web Interface Testing

### Setup

1. First, install and test the plugin on your desktop (see above)
2. Make sure you have an active Obsidian Sync subscription
3. In Settings > Sync, ensure "Sync plugins" and "Sync plugin settings" are enabled
4. Wait for sync to complete
5. Open [Obsidian Web](https://obsidian.md/web)
6. Access your synced vault

### Testing

1. Verify that the Deleometer plugin is available and enabled
2. Test the same features as on desktop:
   - Journal analysis
   - Artistic analysis (images, audio, film, text)
   - Comparative analysis
3. Note any differences in behavior or performance

## Mobile Testing

### Installation

#### Android
1. Install the Obsidian app from the Google Play Store
2. Open Obsidian and create or open a vault
3. If you're using Obsidian Sync, make sure the plugin is synced
4. Otherwise, manually install the plugin by copying the files to the plugins folder

#### iOS
1. Install the Obsidian app from the App Store
2. Open Obsidian and create or open a vault
3. If you're using Obsidian Sync, make sure the plugin is synced
4. Otherwise, manually install the plugin using a file manager app

### Testing

1. Test the same features as on desktop:
   - Journal analysis
   - Artistic analysis (images, audio, film, text)
   - Comparative analysis
2. Pay special attention to:
   - UI responsiveness on smaller screens
   - Touch interactions
   - Performance with larger files

## Reporting Issues

If you encounter any issues during testing, please document:

1. Platform (Desktop/Web/Mobile)
2. Operating System and version
3. Obsidian version
4. Steps to reproduce the issue
5. Expected behavior
6. Actual behavior
7. Screenshots (if applicable)

## Testing Checklist

### Desktop
- [ ] Installation successful
- [ ] Journal analysis works
- [ ] Image analysis works
- [ ] Audio analysis works
- [ ] Film analysis works
- [ ] Text analysis works
- [ ] Comparative analysis works
- [ ] All theoretical frameworks can be applied to any media type
- [ ] Security features work (encryption, local processing)

### Web
- [ ] Plugin syncs correctly
- [ ] Journal analysis works
- [ ] Artistic analysis works
- [ ] Comparative analysis works

### Mobile
- [ ] Plugin works on mobile
- [ ] UI is responsive
- [ ] All features are accessible
- [ ] Performance is acceptable
