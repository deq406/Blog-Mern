import CommentModel from "../models/Comment.js";

export const create = async (req, res) => {
  const postId = req.params.postId;
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: postId,
    });
    const comment = await doc.save();
    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};

export const getComment = async (req, res) => {
  try {
    const comments = await CommentModel.find().limit(3).populate("user").exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить комментарии",
      error: err,
    });
  }
};
export const getPostComments = async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await CommentModel.find({ post: postId }).populate("user");

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить комментарии",
      error: err,
    });
  }
};
