import express from 'express';
import { getUser, updateAssistant, askToAssistant} from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// Get current logged in user
userRouter.get("/current", isAuth, getUser);

// Update assistant name/image
userRouter.post(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  updateAssistant
);

userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;
