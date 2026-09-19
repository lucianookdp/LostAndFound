# Lost & Found - Campo Real

Capstone project (TCC) for a Software Engineering degree at Centro Universitário Campo Real.

Built by [@lucianookdp](https://github.com/lucianookdp) — advisor: Prof. Enrique Augusto Da Roza ([@earoza](https://github.com/earoza)).

A web system for managing lost-and-found items on campus. Front-desk staff log found items, students look up and claim their belongings, and every withdrawal is recorded with full details. Admins manage locations, staff accounts, and export reports.

Pairs with the [lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend) API.

## Live demo

**https://lucianookdp.github.io/LostAndFound/** — login `admin` / `admin`.

The demo runs the real front-end with no back-end at all. `src/demo/backend.js`
intercepts `fetch()` and answers the same routes the API used to answer, reading
and writing in-memory arrays seeded from `src/demo/seed.js`. Everything stays in
the browser, all records are fictional, and reloading the page resets the data.

The pages, components and services are untouched: they still call `/api/items`,
`/api/withdrawals` and so on exactly as they did against the real API.

## Features

- Item intake and lookup, with filters
- Withdrawal flow with full record-keeping
- Role-based access (admin / front-desk staff)
- Location and reception point management
- Report generation and export

## Stack

React (Vite), Tailwind CSS, React Router, Recharts, Framer Motion.

## Running locally

```bash
npm install
npm run dev
```

This runs the demo described above — no back-end needed. To point it at the real
[lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend) instead, drop the
`import './demo/backend'` line from `src/main.jsx` and set the base URL in `src/services/`.

## License

MIT — see [LICENSE](./LICENSE).
