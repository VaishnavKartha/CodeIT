# CodeIT

A real-time collaborative code editor — think a lightweight, single-file Replit/CodeSandbox — where multiple users can edit the same file simultaneously with live cursors, see who's currently online, and run code in a sandboxed Docker container.

## Features

- **Real-time collaborative editing** powered by CRDTs (Yjs), so concurrent edits from multiple users always merge cleanly with no conflicts, even after offline edits reconnect.
- **Live cursors & presence** — see collaborators' cursor positions and who's currently online in the room, in real time.
- **Google OAuth + email/password authentication**, with secure JWT session cookies.
- **Shareable room links** — invite collaborators with a link; room owners can toggle link-sharing on/off and set the default role (editor/viewer) granted to new joiners.
- **Role-based permissions** — owner, editor, and viewer roles per room, enforced on both REST endpoints and the real-time sync connection.
- **Sandboxed code execution** — run code inside ephemeral, resource-limited, network-isolated Docker containers.
- **Persistent documents** — room content is saved to MongoDB and automatically restored the next time anyone opens the room, even after a server restart.

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Monaco Editor (`@monaco-editor/react`)
- Yjs + `y-monaco` (CRDT ↔ editor binding)
- `@hocuspocus/provider` (real-time sync client)
- React Router, Axios, React Hot Toast

**Backend**
- Node.js + Express (REST API)
- `@hocuspocus/server` (real-time CRDT sync server, built on Yjs)
- MongoDB + Mongoose (persistence)
- Redis (execution queueing)
- Dockerode (sandboxed code execution)
- JWT + bcrypt (auth), Google OAuth (`googleapis`)

## Architecture

The app runs two independent servers sharing one MongoDB database:

1. **Express REST API** — handles authentication, room/membership CRUD, and permission checks.
2. **Hocuspocus server** — handles real-time document sync, live cursors, and presence over WebSocket. Authenticates each connection against the same JWT cookie used by the REST API, and checks room membership before allowing a connection.

Document content lives as a Yjs CRDT (`Y.Doc`), synced live between clients and persisted to MongoDB as an encoded binary snapshot. A separate execution service spins up short-lived, hardened Docker containers (no network access, memory/CPU limits, non-root user) to run submitted code and return the output.

## Getting Started

### Prerequisites
- Node.js (v22+)
- MongoDB (local or Atlas)
- Docker Desktop (for code execution)
- Redis

### Environment Variables

Create a `.env` file in the `server` directory:

```
PORT=5174
MONGOURI=mongodb://localhost:27017
JWTSECRET=your_jwt_secret
GOOGLE_CLIENTID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5174/api/auth/google/callback
```

### Installation

**Server**
```bash
cd server
npm install
npm run start
```
This starts both the Express API (port 5174) and the Hocuspocus sync server (port 5175).

**Client**
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.


## License

This project is for educational/portfolio purposes.