import formatFn from 'date-fns/format/index.js';

// Handle CommonJS/ESM interop issues with date-fns v2 in Next.js App Router
// Next.js prerendering might treat the CJS module as an object with a default property
// or as the function itself depending on the environment context.
const format = (formatFn as any)?.default || formatFn;

export default format;
