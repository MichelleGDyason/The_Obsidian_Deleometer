# Analysis Scope

The Analysis Scope feature allows you to analyze content beyond daily notes, including individual notes, files, folders, and even your entire vault.

## Overview

Analysis Scope extends the Deleometer's analytical capabilities to any content in your Obsidian vault. This feature is particularly useful for:

- Analyzing specific notes or documents
- Analyzing collections of related notes in a folder
- Analyzing your entire vault to identify patterns and themes
- Comparing analyses across different content sets

## How to Use

### Enabling Analysis Scope

1. Open Deleometer settings
2. Navigate to the "Features" section
3. Toggle on "Enable Analysis Scope"

### Analyzing Content

1. Use the command palette (Ctrl/Cmd+P) and search for "Deleometer: Analyze Content"
2. Select the type of content you want to analyze:
   - Current Note: Analyzes the currently active note
   - File: Allows you to select a specific file to analyze
   - Folder: Analyzes all markdown files in a selected folder
   - Multiple Files: Allows you to select multiple files to analyze together
   - Multiple Folders: Allows you to select multiple folders to analyze together
   - Vault: Analyzes your entire vault (note: this may take some time for large vaults)

3. Configure analysis options:
   - Select which frameworks to use (Freudian, Lacanian, Deleuzian, Irigarayian)
   - Choose the detail level (Basic, Detailed, Comprehensive)
   - Set a maximum number of entries to analyze (for folders and vault)

4. Click "Analyze" to start the analysis

### Analysis Results

The analysis results will be displayed in a modal window with tabs for each selected framework. Results include:

- Overall themes and patterns
- Key insights from each framework
- Visualizations of emotional patterns (when applicable)
- Recommendations based on the analysis

You can export the results to a markdown file for future reference.

## Tips for Effective Use

- **Start Small**: Begin by analyzing individual notes or small folders before attempting to analyze your entire vault
- **Compare Analyses**: Analyze the same content with different frameworks to gain multiple perspectives
- **Use with Tags**: Analyze folders containing notes with specific tags to focus on particular themes
- **Regular Analysis**: Periodically analyze key folders to track how themes and patterns evolve over time

## Technical Details

The Analysis Scope feature uses the same analytical frameworks as the daily note analysis but extends them to handle multiple files and larger content sets. The feature includes:

- Efficient content loading and processing
- Intelligent sampling for large content sets
- Aggregation of results across multiple files
- Comparative analysis between different content sets

## Troubleshooting

- **Analysis is slow**: For large folders or vaults, try reducing the maximum number of entries
- **Out of memory errors**: If you encounter memory issues, try analyzing smaller content sets
- **API errors**: Ensure your OpenAI API key is valid and has sufficient credits
