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
- **Vitest:** runs the unit tests in a simulated browser environment (jsdom), with the Supabase client mocked so no network or project setup is needed.

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
├── public/                       # Static images used by the site (hero, about, favicon)
├── src/
│   ├── components/
│   │   ├── dashboard/            # Staff-only dashboard UI
│   │   │   ├── DashboardShell.tsx    # Header, dashboard nav, signed-in email, sign out
│   │   │   ├── MenuManager.tsx       # Add, edit, hide and delete menu items
│   │   │   ├── ContactsManager.tsx   # Filter messages, change status, delete messages
│   │   │   └── DashboardError.tsx    # Error fallback for dashboard routes
│   │   ├── ui/                   # shadcn/ui primitives (button, input, label, textarea, sonner)
│   │   ├── ContactForm.tsx       # Validated contact form that saves to Supabase
│   │   ├── ContactPage.tsx       # Contact details, opening hours and contact form layout
│   │   ├── CustomOrders.tsx      # Custom-order callout (not currently mounted)
│   │   ├── PageHeader.tsx        # Shared heading for public pages
│   │   ├── Navbar.tsx            # Public navigation, mobile menu and login/dashboard button
│   │   ├── Footer.tsx            # Public footer
│   │   ├── Hero.tsx              # Home page hero
│   │   ├── Favorites.tsx         # Home page favorite bakes
│   │   ├── Story.tsx             # Home page bakery story
│   │   └── Hours.tsx             # Home page opening hours
│   ├── hooks/
│   │   └── useDocumentTitle.ts   # Keeps document.title in sync with the current page
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Lazily creates the browser Supabase client
│   │   │   ├── auth.ts           # Sign in, read the current user, sign out
│   │   │   ├── menu.ts           # Public menu query plus menu item create/update/delete
│   │   │   ├── contacts.ts       # Submit messages, list/update/delete them, dashboard counts
│   │   │   └── types.ts          # Shared app types
│   │   ├── validation.ts         # Zod schemas for login, contact and menu forms
│   │   └── utils.ts              # cn() class-name helper
│   ├── routes/                   # File-based routes (TanStack Router)
│   │   ├── __root.tsx            # Root layout: skip link, navbar, footer, toaster, 404 page
│   │   ├── index.tsx             # / — home page
│   │   ├── about.tsx             # /about
│   │   ├── menu.tsx              # /menu — public menu loaded from Supabase
│   │   ├── contact.tsx           # /contact
│   │   ├── login.tsx             # /login — staff sign in (signed-in staff go to the dashboard)
│   │   ├── dashboard.tsx         # /dashboard — auth guard and dashboard layout
│   │   └── dashboard/            # /dashboard overview, menu and contacts pages
│   ├── tests/                    # Vitest unit tests (see Testing below)
│   │   ├── auth.test.ts          # Login and session tests
│   │   ├── contacts.test.ts      # Contact submission and message update/delete tests
│   │   ├── menu.test.ts          # Menu create/update tests
│   │   ├── helpers/supabase.ts   # Chainable Supabase mock shared by the tests
│   │   └── setup.ts              # jsdom, jest-dom matchers and cleanup
│   ├── index.css                 # Tailwind import and shadcn theme tokens
│   ├── main.tsx                  # React entry point and router setup
│   ├── routeTree.gen.ts          # Generated route tree (do not edit)
│   └── vite-env.d.ts
├── supabase/
│   └── schema.sql                # Tables, RLS policies and starter menu data
├── components.json               # shadcn/ui configuration
├── index.html                    # Vite HTML entry
├── netlify.toml                  # Netlify build settings
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── vite.config.ts                # Vite, Tailwind, TanStack Router and Vitest config
```

In short, the public pages render from local components and, on `/menu`, from Supabase rows. The contact form validates input with Zod and inserts a row into `contact_messages`. The protected `/dashboard` routes call `getCurrentUser()` in `beforeLoad` and redirect to `/login` when there is no session; the dashboard managers then create, update and delete menu items and messages, calling `router.invalidate()` after every mutation so the route loaders re-fetch fresh data.

Add a page by creating a `.tsx` file under `src/routes`, e.g. `src/routes/about.tsx` becomes `/about`. The route tree is regenerated automatically while the dev server is running.

Add a shadcn/ui component with the CLI, for example:

```bash
pnpm dlx shadcn@latest add card
```

> Use one package manager per project. npm creates `package-lock.json` and pnpm creates `pnpm-lock.yaml`, so mixing them can cause version mismatches.

## Testing

The suite uses Vitest in a jsdom environment. The Supabase client is mocked in every test, so the tests run without a Supabase project, environment variables or network access. Each test checks both the query sent to Supabase and the value returned or error thrown.

Run the suite once:

```bash
pnpm test
```

Or keep it running while you work:

```bash
pnpm test:watch
```

Tests live in `src/tests`:

| File | What it tests |
| --- | --- |
| `auth.test.ts` | **Login:** sends the email and password to `signInWithPassword`, maps the returned user, surfaces Supabase and fallback error messages, and reads the current session (returning `null` when Supabase is not configured or the session cannot be read). |
| `contacts.test.ts` | **Form submission:** inserts the contact-form name, email and message into `contact_messages` and reports insert errors. **Message updates and deletes:** saves a new status plus `updated_at` for the given message id, deletes a message by id, and reports database errors. |
| `menu.test.ts` | **Menu create:** inserts the item using snake_case columns, converts an empty description to `null`, maps the stored price back to a number, and turns a duplicate key error into a friendly message. **Menu update:** updates all fields plus `updated_at` for the given item id, returns the mapped row, and reports database errors. |
| `helpers/supabase.ts` | Not a test itself. Provides `createSupabaseMock`, a chainable fake of Supabase's query builder so tests can `await` calls like `.insert(...).select().single()` and control the `{ data, error }` result. |
| `setup.ts` | Not a test itself. Loads jest-dom matchers, unmounts React trees after each test, and adds jsdom shims for `matchMedia`, `ResizeObserver` and `scrollTo`. |

To test a new Supabase helper, mock `@/lib/supabase/client` with `vi.mock`, return `createSupabaseMock({ data, error }).supabase` from `getSupabaseClient`, then assert on the returned `builder` spies (`insert`, `update`, `delete`, `eq`, `single`, etc.).

## Troubleshooting

- **`npm: command not found`:** install Node.js from nodejs.org.
- **`pnpm: command not found`:** run `npm install -g pnpm`.
- **Port already in use:** Vite will pick the next free port, or set one yourself:
  - npm: `npm run dev -- --port 3000`
  - pnpm: `pnpm dev --port 3000`
- **Blank page or missing module errors:** delete `node_modules` and reinstall with `npm install` or `pnpm install`.
