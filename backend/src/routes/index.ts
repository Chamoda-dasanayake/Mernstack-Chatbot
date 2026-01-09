import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";

const appRouter = Router();

// Connects to /api/v1/user
appRouter.use("/user", userRoutes);

// Connects to /api/v1/chats
appRouter.use("/chats", chatRoutes);

export default appRouter;