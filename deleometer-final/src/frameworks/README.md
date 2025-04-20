# Deleometer Theoretical Frameworks

This directory contains the implementation of various theoretical frameworks used by the Deleometer plugin for analyzing content.

## Framework Structure

Each framework follows a similar structure:

1. An interface defining the analysis result structure
2. A class implementing the analysis logic
3. Export of both the interface and class

## Adding a New Framework

To add a new theoretical framework:

1. Create a new file named after your framework (e.g., `existential.ts`)
2. Implement the framework class and interface following the template pattern
3. Update `index.ts` to:
   - Import your new framework
   - Export your new framework
   - Add a case in the `getFrameworkAnalysis` function

## Framework Template

You can use `framework-template.ts` as a starting point for creating new frameworks.

## Currently Implemented Frameworks

- Deleuzian (deleuzian.ts)
- Irigarayian (irigarayian.ts)
- Tacktical (tacktical.ts)
- Freudian (freudian.ts)
- Lacanian (lacanian.ts)
- Jungian (jungian.ts)
- Attachment (attachment.ts)
- Positive (positive.ts)
- Narrative (narrative.ts)
- Phenomenology (phenomenology.ts)

## Framework Concepts

Each framework should include:

1. Key concepts from the theoretical approach
2. Analysis logic that applies these concepts
3. Media-specific summaries (text, image, audio, film)
4. Structured analysis results

## Using Frameworks

Frameworks can be accessed through the `getFrameworkAnalysis` function in `index.ts`:

```typescript
import { getFrameworkAnalysis } from './frameworks';

const deleuzianAnalysis = getFrameworkAnalysis('deleuzian');
const result = deleuzianAnalysis.analyzeContent(content, mediaType);
```
