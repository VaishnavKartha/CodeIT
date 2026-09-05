import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createRoom, editPermission, editUserRole, getRoomById, getRoomMembers, getRooms, joinRoom, updateLanguage } from '../controllers/room.controller.js';
import { validateMembership } from '../middlewares/validateMembership.js';

const Router = express.Router();

Router.post("/new",protectRoute,createRoom);
Router.post("/join/:roomid",protectRoute,joinRoom);
Router.get("/",protectRoute,getRooms);
Router.get("/:roomid",protectRoute,getRoomById);
Router.get("/mem/:roomid",protectRoute,getRoomMembers);
Router.patch("/edit/:roomid",protectRoute,editPermission);
Router.patch("/edit/role/:roomid",protectRoute,editUserRole);
Router.put("/edit/language/:roomid",protectRoute,validateMembership,updateLanguage);
export default Router;