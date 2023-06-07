const express = require("express");
const cookieParser = require("cookie-parser");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
  getJobs,
  getOffers,
  getServices,
  getSearch,
  updatePost,
  deletePost,
  getAll,
  uploadImage,
  getOnePost,
} = require("../Controllers/postController");

const Post = require("../Models/post");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

postRouter.use(cookieParser());

postRouter.route("/").get(getAll);
postRouter.route("/offers").get(getOffers);
postRouter.route("/search").get(getSearch);
postRouter.route("/services").get(getServices);
postRouter.route("/jobs").get(getJobs);


postRouter.post("/add", upload.single("image"), async (req, res) => {
  const token = req.cookies.token;

  let decoded = jwt.verify(token, "Ammar221");
  req.userId = decoded.userId;
  console.log(req.body);

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req?.file?.path);
      const newPost = await Post.create({
        postType: req.body.postType,
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        Address: req.body.Address,
        zipCode: req.body.zipCode,
        userId: req.userId,
        image: result?.secure_url,
        cloudinary_id: result?.public_id,
      });
      return res.status(201).json(newPost);
    } else if (!req.file) {
      const newPost = await Post.create({
        postType: req.body.postType,
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        Address: req.body.Address,
        zipCode: req.body.zipCode,
        userId: req.userId,
      });
      return res.status(201).json(newPost);
    }
  } catch (error) {
    console.log("Error: Cannot create a new instance");
  }
});

postRouter.route("/:id").put(updatePost);
postRouter.route("/:id").delete(deletePost);
postRouter.route("/:id").get(getOnePost);

module.exports = postRouter;
