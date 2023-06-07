const express = require("express");
const cookieParser = require("cookie-parser");
const messageModel = require("../Models/message");
const userModel = require('../Models/User');
const postModel = require('../Models/User');
const jwt = require("jsonwebtoken");

const addMessage = async (req, res, next) => {
  const token = req.cookies.token;
  let decoded = jwt.verify(token, "Ammar221");
  req.userId = decoded.userId;
  console.log(req.body);
  try {
    
    const data = await messageModel.create({
      message: req.body.message,
      senderId: req.userId,
      receiverId: req.body.receiverId,
      postId: req.body.postId,
    });

    if (data)
      return res.json({
        msg: "Message added successfully!",
      });
    return res.json({
      msg: "Failed to add message to DB",
    });
  } catch (err) {
    next(err);
  }
};

const getAllMessage = async (req, res) => {
  const token = req.cookies.token;
  let decoded = jwt.verify(token, "Ammar221");
  req.userId = decoded.userId;

  const messages = await messageModel
    .find({ receiverId: req.userId })
    .catch((err) => res.status(500).send("Server Error"));
  res.status(200).json(messages);
};

const getPostMessages = async (req, res) => {
    try {
      const token = req.cookies.token;
      let decoded = jwt.verify(token, "Ammar221");
      req.userId = decoded.userId;
  
      if (req.params.postId) {
        const messages = await messageModel
          .find({
            postId: req.params.postId,
            $or: [{ receiverId: req.userId }, { senderId: req.userId }],
          })
          .catch((err) => {
            throw err; // Rethrow the error to be caught by the error handler
          });
  
        res.status(200).json(messages);
      } else {
        res.status(404).json('Not found');
      }
    } catch (err) {
      res.status(500).send('Server Error');
    }
  };



module.exports = {
  getAllMessage,
  addMessage,
  getPostMessages,
};
