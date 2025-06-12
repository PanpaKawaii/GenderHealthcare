const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    voteUp: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    voteDown: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    viewCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },

    //bài post cần có admin duyệt
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", questionSchema);
