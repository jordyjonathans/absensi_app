import { Router } from "express";
import {
  getRoles,
  getUser,
  getUsers,
  registerUser,
  updateUser,
  uploadProfile,
} from "src/controllers/userController";
import { upload } from "src/lib/multer/upload";
import { isAuth } from "src/middleware/auth";

const userRouter = Router();

userRouter.post("/", isAuth, upload.single("profile_image"), registerUser);
userRouter.put(
  "/:external_id",
  isAuth,
  upload.single("profile_image"),
  updateUser
);
userRouter.get("/", isAuth, getUsers);
userRouter.get("/roles", isAuth, getRoles);
userRouter.get("/:external_id", isAuth, getUser);

export default userRouter;
