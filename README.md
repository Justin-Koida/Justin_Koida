# Justin Koida — Personal Portfolio

React, TypeScript, Vite, and Tailwind CSS. The scrolling portfolio has an interactive career voyage, About Me, and Projects sections. Select an island for full-screen experience details; Escape or Back returns to the map. Personal content is in `src/content/site.ts` and includes résumé-based internship, research, and project details.

## Local development

Install Node.js LTS and npm, then run:

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Keep the terminal running; press Ctrl+C to stop. Editing source files updates the preview.

## Checks and production preview

```sh
npm run typecheck
npm run build
npm run preview
```

The production output is `dist/`. Hosting is not configured yet.
