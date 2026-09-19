# Lost & Found

A web system for managing lost and found items in a school, university or any
institution that receives objects left behind by the people who pass through it.
Front-desk staff log found items, people look them up, and every claim is
recorded with the details of who took what. Admins manage locations, reception
points, staff accounts and reports.

Nothing in the system is tied to a specific institution: locations, reception
points and staff are registered by the admin, so the same install serves a
single campus or a network of buildings.

## About the project

Capstone project (TCC) for a Software Engineering degree at Centro Universitário
Campo Real.

Built by [@lucianookdp](https://github.com/lucianookdp). Advisor: Prof. Enrique
Augusto Da Roza ([@earoza](https://github.com/earoza)).

The problem it was written for: the lost and found was kept in a spreadsheet,
with no reliable record of who had claimed each item. The system replaces that
with a registry where every claim is logged against the item, the person and the
staff member who handed it over.

This repository is the front-end. It was built against the
[lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend) API
(Node.js + MySQL), which is no longer hosted.

## Live demo

**https://lucianookdp.github.io/LostAndFound/**, login `admin` / `admin`.

The demo is illustrative. The screens, the layout and the flows are the ones
delivered for the TCC, and two things are not from the original:

- **There is no back-end.** `src/demo/backend.js` intercepts `fetch()` and
  answers the same routes the API answered, over in-memory arrays seeded from
  `src/demo/seed.js`. Everything stays in the browser, every record is
  fictional, and reloading the page resets the data. No real person's data is
  in it.
- **There is a guide.** `src/demo/tour.js` walks a visitor through the eleven
  screens, in Portuguese or English. It never blocks the page and can be closed
  at any point. It lives outside the application, imports nothing from it, and
  no screen had markup added for it.

The pages, components and services are otherwise untouched: they still call
`/api/items`, `/api/withdrawals` and so on exactly as they did against the real
API.

## Features

- Item intake and lookup, with filters by category, type, location and reception
- Items split into priority (high value or personal documents) and common
- Withdrawal flow with a per-item security question and full record-keeping
- Role-based access (admin / front-desk staff)
- Location and reception point management
- Dashboard with return rate, categories, areas and returns per month
- Report generation and PDF export

## Stack

React (Vite), Tailwind CSS, React Router, Recharts, Framer Motion.

## Running locally

```bash
npm install
npm run dev
```

This runs the demo described above, with no back-end needed. To point it at the real
[lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend)
instead, drop the `import './demo/backend'` line from `src/main.jsx` and set the
base URL in `src/services/`.

## License

All rights reserved. Public for viewing and reference only. See [LICENCE](./LICENCE).
