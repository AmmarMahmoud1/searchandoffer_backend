const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postType: {
      type: String,
    },
    title: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: String,
    },
    content: {
      type: String,
    },
    userId: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
    },
    Address: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    city: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
