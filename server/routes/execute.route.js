import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { validateMembership } from '../middlewares/validateMembership.js';
import { runCode } from '../controllers/execute.controllers.js';

const Router = express.Router();

Router.post("/:roomid",protectRoute,validateMembership,runCode);

export default Router;