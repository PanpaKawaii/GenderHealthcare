const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
      voteUp: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    voteDown: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
      isEdited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
