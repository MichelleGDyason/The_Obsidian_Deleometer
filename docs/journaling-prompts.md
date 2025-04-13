# Journaling Prompts

The Journaling Prompts feature provides personalized writing prompts to inspire your journaling practice and deepen your self-reflection.

## Overview

Journaling Prompts offers thoughtfully crafted questions and prompts designed to:

- Stimulate deeper self-reflection
- Explore different aspects of your psyche
- Overcome writer's block
- Guide your journaling practice
- Provide structure for therapeutic writing

The prompts are organized into categories and can be personalized based on your user profile and previous journal entries.

## How to Use

### Enabling Journaling Prompts

1. Open Deleometer settings
2. Navigate to the "Features" section
3. Toggle on "Enable Journaling Prompts"

### Accessing Prompts

1. Use the command palette (Ctrl/Cmd+P) and search for "Deleometer: Open Journaling Prompts"
2. A modal will appear with a selection of prompts

### Using Prompts

1. Browse through the available prompts
2. Filter prompts by category using the dropdown menu
3. Click on a prompt to copy it to your clipboard
4. Paste the prompt into your journal entry and start writing
5. Use the "Get New Prompts" button to refresh the list with new suggestions

### Personalized Prompts

If you have User Profiling enabled, you'll see a "Recommended for You" section with prompts tailored to your writing patterns, emotional states, and psychological profile.

## Prompt Categories

Journaling prompts are organized into the following categories:

- **Self-Reflection**: Prompts that encourage introspection and self-awareness
- **Emotional Processing**: Prompts focused on exploring and processing emotions
- **Relationships**: Prompts about interpersonal connections and dynamics
- **Growth & Goals**: Prompts related to personal development and aspirations
- **Creativity**: Prompts that stimulate creative thinking and expression
- **Shadow Work**: Prompts that explore unconscious aspects of the psyche
- **Philosophical**: Prompts that engage with deeper questions about existence
- **Therapeutic**: Prompts designed for emotional healing and processing
- **Daily Reflection**: Prompts for regular check-ins and daily journaling

## Tips for Effective Use

- **Mix Categories**: Try prompts from different categories to explore various aspects of your experience
- **Follow Intuition**: Choose prompts that resonate with you in the moment
- **Set a Timer**: Consider setting a timer (5-15 minutes) to write continuously on a prompt
- **Revisit Prompts**: Return to the same prompt at different times to see how your responses evolve
- **Combine Prompts**: Use multiple prompts together to create a more comprehensive journaling session

## Creating Custom Prompts

While the Deleometer provides a rich library of prompts, you can also create your own custom prompts:

1. Create a file named `custom_prompts.json` in your Deleometer plugin folder
2. Use the following format:
```json
{
  "prompts": [
    {
      "text": "Your prompt text here",
      "category": "self-reflection",
      "tags": ["introspection", "awareness"]
    }
  ]
}
```
3. Restart Obsidian for the custom prompts to take effect

## Troubleshooting

- **Prompts not appearing**: Ensure the feature is enabled in settings
- **Personalized prompts not showing**: Make sure User Profiling is enabled and you have sufficient journal entries for analysis
- **Custom prompts not loading**: Check the format of your custom_prompts.json file
