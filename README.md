# Local Bakery Website - OTHM Web and Mobile Applications Project

A multi-page website for a fictional local bakery, built with React and Vite. The public menu, contact messages, and staff dashboard all use Supabase, and the contact form validates input with TanStack Form before saving the message.

## Pages

- **Home:** hero, favorite bakes, the bakery story, and opening hours
- **Menu:** bread, pastries, and cakes loaded from Supabase
- **About:** the bakery's story
- **Contact:** address, map, and a validated contact form that saves messages to Supabase
- **Staff sign in / Dashboard:** Supabase-powered menu and contact-message management

## Tech stack

- **React:** a JavaScript library for building user interfaces from reusable components (e.g. `Navbar`, `MenuItem`, `ContactForm`). It updates only the parts of the page that change.
- **Tailwind CSS:** a utility-first CSS framework that lets developers build modern websites directly in your HTML markup using small, single-purpose classes like `flex`, `pt-4`, and `text-center`.
- **shadcn/ui:** copy-in React components built on Base UI and Tailwind CSS. Components are installed with the shadcn CLI and live in `src/components/ui`.
- **Vite:** a build tool and dev server. It runs the project locally with instant reload (`npm run dev`) and bundles it into optimized files for production (`npm run build`).
- **TanStack Router:** provides type-safe, file-based routing. Routes live in `src/routes`, and the route tree is generated automatically. It handles navigation between pages without reloading the browser.
- **TanStack Form:** manages the contact form's values and validation.
- **Supabase:** provides the public menu data, contact-message storage, and staff authentication. The browser client is used directly; Row Level Security keeps staff-only data protected while allowing anyone to send a contact message.
- **Sonner:** shows toast notifications, including contact-form success and error messages.
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

## Staff dashboard setup (Supabase)

The staff dashboard is available at `/login`. It needs a Supabase project:

1. Create a project at [supabase.com](https://supabase.com/).
2. Open the SQL Editor, paste `supabase/schema.sql`, and run it. This creates the tables, Row Level Security policies, and starter menu items.
3. Create a staff user under **Authentication → Users**.
4. Add the project URL and anon/publishable key to your environment file:

   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   The older `SUPABASE_URL` and `SUPABASE_ANON_KEY` names are also supported.

Restart the dev server after changing environment variables, then sign in at `/login`. The anon key is safe to use in the browser; Row Level Security restricts staff operations to authenticated users.

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
│   │   ├── dashboard/   # Staff dashboard UI
│   │   └── ui/          # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/    # Browser Supabase client, auth, and CRUD helpers
│   │   └── validation.ts
│   ├── routes/          # File-based routes
│   │   ├── __root.tsx   # Root layout, devtools, and 404 page
│   │   ├── dashboard/   # Protected staff routes
│   │   └── index.tsx    # Home
│   ├── tests/           # Unit and interaction tests
│   ├── index.css        # Tailwind and shadcn theme tokens
│   ├── main.tsx         # Router setup and app entry point
│   └── routeTree.gen.ts # Generated route tree (do not edit)
├── supabase/
│   └── schema.sql       # Tables, RLS policies, and seed data
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
