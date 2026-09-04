import express from 'express'
import { deleteAccount, getMe, googleAuth, isPasswordLogin, login, logout, redirect, signup, updatePassword, updateProfile } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const Router = express.Router();
Router.post("/signup",signup);
Router.post("/login",login);
Router.get("/google",googleAuth);
Router.get("/google/callback",redirect);
Router.get("/me",protectRoute,getMe)
Router.get("/logout",protectRoute,logout);
Router.get("/password",protectRoute,isPasswordLogin);
Router.patch("/profile",protectRoute,updateProfile);
Router.patch("/password",protectRoute,updatePassword);
Router.delete("/",protectRoute,deleteAccount);

export default Router