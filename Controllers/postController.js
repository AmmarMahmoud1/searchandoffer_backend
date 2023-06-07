const Post = require("../Models/post");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

const getAll = async (req, res) => {
  const posts = await Post.find({})
    .limit(10)
    .sort("+createdOn")
    .catch((err) => res.status(500).send("Server Error"));
  res.status(200).json(posts);
};

const getOffers = async (req, res) => {
  const posts = await Post.find({ postType: "Offer" }).catch((err) =>
    console.log(err)
  );
  res.status(200).json(posts);
};

const getSearch = async (req, res) => {
  const posts = await Post.find({ postType: "Search" }).catch((err) =>
    console.log(err)
  );
  res.status(200).json(posts);
};

const getServices = async (req, res) => {
  await Post.find({ category: "Services", postType: "Offer" }).catch((err) =>
    res
      .status(404)
      .json({
        success: false,
        error: "Internal error during fetching services!",
      })
  );
};

const getJobs = async (req, res) => {
  await Post.find({ category: "Jobs", postType: "Offer" }).catch((err) =>
    res
      .status(404)
      .json({
        success: false,
        error: "Internal error during fetching services!",
      })
  );
};



const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const token = req.cookies.token;
  let decoded = jwt.verify(token, "Ammar221");
  req.userId = decoded.userId;
  if (!post) {
    res.status(400);
    throw new Error("Post not found!..");
  }
  if (!req.userId) {
    res.status(401);
    throw new Error("User not found!...");
  }

  if (post.userId.toString() !== req.userId) {
    res.status(401);
    throw new Error("User not authorized!...");
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedPost);
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const token = req.cookies.token;
  let decoded = jwt.verify(token, "Ammar221");
  req.userId = decoded.userId;

  if (!post) {
    res.status(400);
    throw new Error("Post not found!.. ");
  }
  if (!req.userId) {
    res.status(401);
    throw new Error("User not found");
  }
  if (post.userId.toString() !== req.userId) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await post.deleteOne();

  res.status(200).json({ id: req.params.id });
};



const getOnePost = async (req, res) => {
  try {
    if (req.params.id) {
      const id = req.params.id;
      const postObj = await Post.findById(id).catch((err) => {
        throw err; // Rethrow the error to be caught by the error handler
      });
      res.status(200).json(postObj);
    } else {
      res.status(404).json('Not found');
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getJobs,
  getOffers,
  getSearch,
  getServices,
  updatePost,
  deletePost,
  getAll,
  getOnePost,
};
