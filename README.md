# Anchor Lock Home Watch

Marketing site and client portal for **Anchor Lock Home Watch**, a professional home watch service in Cape Coral & Fort Myers, FL owned by Rob & Sherrie Senitza.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | SvelteKit 2, Svelte 5 (runes), TypeScript |
| Styling | Scoped CSS with CSS custom properties (no framework) |
| Backend | Firebase — Auth, Firestore, Cloud Functions v2 |
| Hosting | Vercel (frontend) |
| Analytics | Vercel Analytics |
| Fonts | Google Fonts — Inter (body), Playfair Display (headings) |

---

## Project Structure

```
anchor-lock-home-watch/
├── src/
│   ├── lib/
│   │   └── firebase.ts          # Firebase app, auth, db exports
│   └── routes/
│       ├── +layout.svelte       # Root layout — global CSS vars, Vercel Analytics
│       ├── +page.svelte         # Marketing homepage (single-page)
│       ├── login/
│       │   └── +page.svelte     # Passwordless magic link login
│       ├── reports/
│       │   └── +page.svelte     # Customer inspection reports (auth-protected)
│       └── admin/
│           ├── +layout.svelte   # Admin shell — sidebar, auth + admin guard
│           ├── +page.svelte     # Admin dashboard
│           └── customers/
│               └── +page.svelte # Customer list + create customer form
├── functions/
│   └── src/
│       └── index.ts             # Firebase Cloud Functions
├── static/
│   └── images/                  # Photo assets (owners, properties)
├── firebase.json
└── .env                         # Firebase config (gitignored)
```

---

## Pages

### `/` — Marketing Homepage
Single-page site with sections: navigation, hero, services (expandable), photo strip, about the owners, contact form, and footer. The nav shows a **My Account** button when a session is detected, or **Login** when not. A **Sign Out** link also appears when logged in.

### `/login` — Passwordless Login
Uses Firebase's email link (magic link) sign-in. No passwords — the user enters their email, receives a link, clicks it, and is signed in. Auth state is persisted by Firebase automatically so users stay logged in across navigations.

Steps:
1. User enters email → `sendSignInLinkToEmail` is called → email stored in `localStorage`
2. User clicks link in email → lands back on `/login` with the link in the URL
3. App detects `isSignInWithEmailLink` → calls `signInWithEmailLink` → redirects to `/reports`

If the link is opened on a different device, the user is prompted to re-enter their email.

### `/reports` — Customer Reports (auth-protected)
Displays a customer's inspection reports. Requires authentication — unauthenticated users are redirected to `/login`. Admins see an **Admin** button in the nav. Reports list is a placeholder pending inspection data.

### `/admin` — Admin Dashboard
Protected by the admin layout guard. Only accessible to users with a document in the `admins` Firestore collection. Contains a sidebar with nav links and sign out. Dashboard shows a card linking to Customers.

### `/admin/customers` — Customer Management
- Lists all customers sorted by most recently added
- **+ Add Customer** opens an inline form (name, email, phone)
- On submit: calls the `createCustomer` Cloud Function, then calls `sendSignInLinkToEmail` to send the customer a welcome email with a magic link
- Customer names link to `/admin/customers/[id]` (detail page — in progress)

---

## Authentication

Firebase Auth with **passwordless email link** sign-in (no passwords anywhere in the system).

- Customers log in via `/login` on their own
- Admins also log in via `/login` — admin status is determined by Firestore, not a separate auth method
- Sessions persist automatically via Firebase's IndexedDB-backed persistence

**Admin designation:** A user is an admin if a document exists at `admins/{email}` in Firestore. The document can be empty — its existence is the check. Add or remove admin emails directly in the Firebase Console.

---

## Firestore Schema

```
admins/
  {email}                  # Empty doc. Existence = admin access.

users/
  {uid}/                   # Firebase Auth UID as document ID
    name: string
    email: string
    phone: string | null
    createdAt: timestamp
    createdBy: string       # Admin email who created the record
```

**Planned (not yet built):**
```
users/{uid}/
  properties/
    {propertyId}/
      address: string
      nickname: string | null
      notes: string | null
      checklistOverrides: map   # Property-level overrides of master checklist

  properties/{propertyId}/
    inspections/
      {inspectionId}/
        createdAt: timestamp
        completedAt: timestamp | null
        status: 'draft' | 'complete'
        items: array            # Frozen snapshot of checklist items + results
```

Inspection reports are stored as **frozen snapshots** — the checklist at the time of the inspection is embedded directly in the document, not referenced from a template. This ensures old reports are never affected by future checklist changes.

---

## Cloud Functions

Located in `functions/src/index.ts`. Deployed to `us-central1` on Firebase (Node 24, 2nd gen).

### `createCustomer`

**Trigger:** `onCall` (authenticated callable — CORS handled automatically)

**Authorization:** Caller must be authenticated and have a document in `admins/{email}`

**Input:**
```ts
{ name: string; email: string; phone?: string }
```

**What it does:**
1. Verifies the caller is authenticated and an admin
2. Validates required fields
3. Creates a Firebase Auth account via Admin SDK (`admin.auth().createUser`)
4. Creates a `users/{uid}` Firestore document
5. If the Firestore write fails, deletes the orphaned Auth account before throwing
6. Returns `{ success: true, uid }`

After the function returns, the admin portal calls `sendSignInLinkToEmail` (client SDK) to send the customer a welcome email with a magic link — this uses Firebase's built-in email delivery, no third-party service required.

**Error codes:**
| Code | Meaning |
|---|---|
| `unauthenticated` | Caller not logged in |
| `permission-denied` | Caller is not an admin |
| `invalid-argument` | Missing name or email |
| `already-exists` | Email already registered |
| `internal` | Auth or Firestore failure |

### Deploying Functions

```bash
firebase deploy --only functions
```

The predeploy hooks (`npm run lint` + `npm run build`) run automatically before upload.

---

## Environment Variables

Create a `.env` file in the project root (gitignored). All Firebase config values must use the `PUBLIC_` prefix so SvelteKit exposes them to the browser:

```env
PUBLIC_FIREBASE_API_KEY=
PUBLIC_FIREBASE_AUTH_DOMAIN=
PUBLIC_FIREBASE_PROJECT_ID=
PUBLIC_FIREBASE_STORAGE_BUCKET=
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
PUBLIC_FIREBASE_APP_ID=
PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Find these values in the Firebase Console under **Project Settings → Your apps**.

On Vercel, add these same variables under **Project Settings → Environment Variables**.

---

## Local Development

```bash
npm install
npm run dev        # Start dev server at localhost:5173
npm run check      # TypeScript + svelte-check type checking
npm run build      # Production build
npm run preview    # Preview production build locally
```

Functions are not emulated locally — they run against the live Firebase project during development.

---

## Deployment

The frontend deploys automatically to **Vercel** on push to `main`. No manual deploy step needed for the frontend.

After adding or changing Cloud Functions:
```bash
firebase deploy --only functions
```

After changing Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

---

## Firebase Console Quick Reference

| Thing | Where |
|---|---|
| Add/remove admins | Firestore → `admins` collection |
| View customers | Firestore → `users` collection |
| Auth accounts | Authentication → Users |
| Magic link email template | Authentication → Templates |
| Authorized domains (for magic links) | Authentication → Settings → Authorized domains |
| Function logs | Functions → Logs (or Cloud Logging) |
| Firestore security rules | Firestore → Rules |
