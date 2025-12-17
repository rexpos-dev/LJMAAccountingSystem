import { genkit } from 'genkit';
// Note: If you want to use Anthropic (Claude) with genkit you may need
// to install the appropriate plugin (example: @genkit-ai/anthropic-genai) and
// configure credentials in env. For now we set the model to Claude Haiku 4.5
// so all clients use it. Ensure your runtime has the correct plugin/credentials.

export const ai = genkit({
  // No provider-specific plugin configured here; genkit will use the
  // configured runtime/provider. Set model to Claude Haiku 4.5 for all clients.
  model: 'anthropic/claude-haiku-4.5',
});
