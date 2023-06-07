const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
       type: String,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        
      },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
     
    },
    postId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageSchema);