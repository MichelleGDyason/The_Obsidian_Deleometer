# Predefined Analyses

This directory contains predefined analyses for various theoretical frameworks. These analyses are used as fallbacks when a specialized framework analyzer is not available or fails.

## Structure

Each framework has its own file with predefined analyses for different media types:

- `deleuzian.ts` - Predefined analyses for Deleuzian framework
- `irigarayian.ts` - Predefined analyses for Irigarayian framework
- `freudian.ts` - Predefined analyses for Freudian framework
- `lacanian.ts` - Predefined analyses for Lacanian framework
- `epicurean.ts` - Predefined analyses for Epicurean framework
- etc.

The `index.ts` file exports all predefined analyses and provides utility functions for accessing them.

## Adding a New Framework

To add predefined analyses for a new framework:

1. Create a new file named after the framework (e.g., `jungian.ts`)
2. Define and export a `PredefinedAnalyses` object with analyses for each media type
3. Import and add the analyses to the `predefinedAnalyses` object in `index.ts`

### Example

```typescript
// jungian.ts
import { MEDIA_TYPES } from '../constants';
import { PredefinedAnalyses } from './index';

export const jungianAnalyses: PredefinedAnalyses = {
    [MEDIA_TYPES.TEXT]: "From a Jungian perspective, this text...",
    [MEDIA_TYPES.IMAGE]: "This image can be analyzed through a Jungian lens...",
    [MEDIA_TYPES.AUDIO]: "From a Jungian perspective, this audio piece...",
    [MEDIA_TYPES.FILM]: "This film can be analyzed through a Jungian framework..."
};
```

Then update `index.ts`:

```typescript
// index.ts
import { jungianAnalyses } from './jungian';

export const predefinedAnalyses: Record<string, PredefinedAnalyses> = {
    // Existing frameworks...
    'jungian': jungianAnalyses,
};
```

## Guidelines for Writing Analyses

When writing predefined analyses, consider the following:

1. **Framework-Specific Concepts**: Include key concepts and terminology from the framework
2. **Media-Specific Language**: Tailor the analysis to the specific media type
3. **Depth and Detail**: Provide enough detail for a meaningful analysis (5-7 sentences)
4. **Accessibility**: Balance technical terminology with clear explanations
5. **Consistency**: Maintain a consistent style and depth across frameworks

## Implemented Frameworks

- Deleuzian (deleuzian.ts)
- Irigarayian (irigarayian.ts)
- Freudian (freudian.ts)
- Lacanian (lacanian.ts)
- Epicurean (epicurean.ts)
- Jungian (jungian.ts)
- Attachment (attachment.ts)
- Positive (positive.ts)
- Narrative (narrative.ts)
- Phenomenology (phenomenology.ts)
- Existential (existential.ts)
- Feminist (feminist.ts)
- Critical (critical.ts)
- Posthumanism (posthumanism.ts)
- Buddhist (buddhist.ts)
- Nietzschean (nietzschean.ts)
- Gestalt (gestalt.ts)
- Transpersonal (transpersonal.ts)
- CBT (cbt.ts)
- Hermeneutics (hermeneutics.ts)
- Stoicism (stoicism.ts)
- Psychiatry (psychiatry.ts)
- Tacktical (tacktical.ts)
