import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as HocuspocusServer } from '@hocuspocus/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import authRouter from './routes/auth.route.js';
import roomRouter from './routes/room.route.js';
import connectDB from './lib/db.js';
import membershipCollection from './models/membership.collection.js';
import roomCollection from './models/room.collections.js';
import * as Y from 'yjs';
import { runTest } from './lib/test.js';

const PORT = process.env.PORT;

// ---- Express app (REST API) ----
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/room", roomRouter);

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
  connectDB();
});

// ---- Hocuspocus server (real-time sync) ----
const hocuspocusServer = new HocuspocusServer({
  port: 5175,

  async onAuthenticate({ requestHeaders, documentName }) {
    const cookies = cookie.parseCookie(requestHeaders.get('cookie') || '');
    const decoded = jwt.verify(cookies.jwt, process.env.JWTSECRET);

    const membership = await membershipCollection.findOne({
      userId: decoded.userId,
      roomId: documentName,
    });
    if (!membership) throw new Error('Not a member of this room');

    return { userId: decoded.userId, role: membership.role };
  },

  async onLoadDocument({ documentName }) {
    const room = await roomCollection.findById(documentName);
    return room?.ydocState || null;
  },

  async onStoreDocument({ documentName, document }) {
    const state = Y.encodeStateAsUpdate(document);
    await roomCollection.findByIdAndUpdate(documentName, {
        ydocState: Buffer.from(state),
    });
    console.log(`[persistence] Saved room ${documentName}`);
    },
});

hocuspocusServer.listen();
console.log('Hocuspocus server listening on port: 5175');
