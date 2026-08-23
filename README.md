# Lost & Found - Campo Real

Capstone project (TCC) for a Software Engineering degree at Centro Universitário Campo Real.

Built by [@lucianookdp](https://github.com/lucianookdp) — advisor: Prof. Enrique Augusto Da Roza ([@earoza](https://github.com/earoza)).

A web system for managing lost-and-found items on campus. Front-desk staff log found items, students look up and claim their belongings, and every withdrawal is recorded with full details. Admins manage locations, staff accounts, and export reports.

Pairs with the [lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend) API.

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

The app expects the [lostandfound-backend](https://github.com/lucianookdp/lostandfound-backend) API to be running; update the base URL in `src/services/authApi.js` if it's not on the default host.

## License

MIT — see [LICENSE](./LICENSE).
