
import express from "express";
import { createComment, getAllComments, deleteComment } from "../controllers/commentController.js";
import { authenticateToken } from "../middlewear/auth.js"; 

const commentRouter = express.Router();

commentRouter.post("/", authenticateToken, createComment);
commentRouter.get("/", getAllComments);
commentRouter.delete("/:id", authenticateToken, deleteComment);

export default commentRouter;
