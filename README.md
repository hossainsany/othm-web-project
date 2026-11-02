# Local Bakery Website - OTHM Web and Mobile Applications Project

A multi-page website for a fictional local bakery, built with React and Vite. The menu is stored in a local JS file, and the contact form validates input with TanStack Form before showing a demo success toast (no data is sent).

## Pages

- **Home:** intro and opening hours
- **Menu:** bread, pastries, and cakes
- **About:** the bakery's story
- **Contact:** address, map, and a validated contact form

## Tech stack

- **React:** a JavaScript library for building user interfaces from reusable components (e.g. `Navbar`, `MenuItem`, `ContactForm`). It updates only the parts of the page that change.
- **Tailwind CSS:** a utility-first CSS framework that lets developers build modern websites directly in your HTML markup using small, single-purpose classes like `flex`, `pt-4`, and `text-center`.
- **shadcn/ui:** copy-in React components built on Base UI and Tailwind CSS. Components are installed with the shadcn CLI and live in `src/components/ui`.
- **Vite:** a build tool and dev server. It runs the project locally with instant reload (`npm run dev`) and bundles it into optimized files for production (`npm run build`).
- **TanStack Router:** provides type-safe, file-based routing. Routes live in `src/routes`, and the route tree is generated automatically. It handles navigation between pages without reloading the browser.
- **TanStack Form:** manages the contact form's values and validation.
- **Sonner:** shows toast notifications, including the contact form's demo success message.
- **Vitest and Testing Library:** run unit and interaction tests in a simulated browser environment.

## Requirements

- [Node.js](https://nodejs.org/) v18 or later
- A package manager: **npm** (comes with Node) or **pnpm**

Check your versions:

```bash
node -v
npm -v
pnpm -v   # only if you use pnpm
```

To install pnpm (optional):

```bash
npm install -g pnpm
```

## Getting started

1. Clone or download the project, then open a terminal in the project folder.

2. Install dependencies:

   ```bash
   # npm
   npm install

   # pnpm
   pnpm install
   ```

3. Start the development server:

   ```bash
   # npm
   npm run dev

   # pnpm
   pnpm dev
   ```

4. Open the local URL shown in the terminal (usually http://localhost:5173).

The page reloads automatically when you save changes.

## Other commands

| Action                               | npm               | pnpm           |
| ------------------------------------ | ----------------- | -------------- |
| Start dev server with hot reload     | `npm run dev`     | `pnpm dev`     |
| Create a production build in `dist`  | `npm run build`   | `pnpm build`   |
| Run unit tests                       | `npm test`        | `pnpm test`    |
| Preview the production build locally | `npm run preview` | `pnpm preview` |

## Project structure

```
website/
├── public/              # Static files (favicon, images)
├── src/
│   ├── assets/          # Images and other imported assets
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── lib/             # Shared utilities (cn)
│   ├── routes/          # File-based routes
│   │   ├── __root.tsx   # Root layout, devtools, and 404 page
│   │   └── index.tsx    # Home
│   ├── tests/           # Unit and interaction tests
│   ├── index.css        # Tailwind and shadcn theme tokens
│   ├── main.tsx         # Router setup and app entry point
│   └── routeTree.gen.ts # Generated route tree (do not edit)
├── components.json      # shadcn configuration
├── index.html
├── package.json
└── vite.config.ts
```

Add a page by creating a `.tsx` file under `src/routes`, e.g. `src/routes/about.tsx` becomes `/about`. The route tree is regenerated automatically while the dev server is running.

Add a shadcn/ui component with the CLI, for example:

```bash
pnpm dlx shadcn@latest add card
```

> Use one package manager per project. npm creates `package-lock.json` and pnpm creates `pnpm-lock.yaml`, so mixing them can cause version mismatches.

## Testing

Run the test suite once:

```bash
pnpm test
```

Or keep it running while you work:

```bash
pnpm test:watch
```

Tests live in `src/tests` and cover page headings, the footer, the mobile navigation and the contact form.

## Troubleshooting

- **`npm: command not found`:** install Node.js from nodejs.org.
- **`pnpm: command not found`:** run `npm install -g pnpm`.
- **Port already in use:** Vite will pick the next free port, or set one yourself:
  - npm: `npm run dev -- --port 3000`
  - pnpm: `pnpm dev --port 3000`
- **Blank page or missing module errors:** delete `node_modules` and reinstall with `npm install` or `pnpm install`.
