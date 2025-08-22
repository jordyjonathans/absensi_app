import { Router } from "express";
import { singIn } from "src/controllers/authController";

const authRouter = Router();

authRouter.post("/signin", singIn);

export default authRouter;
