//MongoDB Express Reactjs Nodejs
import express from "express";

import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import {
  PostController,
  UserController,
  CommentController,
} from "./controllers/index.js";

mongoose
  .connect(
    "mongodb+srv://Deepsel:dadking12@cluster0.1pe0l.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("db ok"))
  .catch((err) => console.log("db error", err));
const app = express();
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.get("/", (request, response) => {
  response.send("helldsadao world");
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/tags", PostController.getLastTags);
app.get("/tags/:tagName", PostController.getPostsWithSameTag);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne); // динамический параметр(получить можной через request.params.id - слово после params зависит от того что указано в http - запросе т.е /posts/:test = request.params.test)
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.get("/sort/:orderBy", PostController.sort);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
); // checkAuth middleware-функция(функция-посредник параметр next())
//middliware библеотеки multer

app.post("/comment/:postId", checkAuth, CommentController.create);
app.get("/comment", CommentController.getComment);
app.get("/comment/:postId", CommentController.getPostComments);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok");
});
