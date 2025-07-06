const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    voteUp: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    voteDown: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    viewCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 },
    editedAt: { type: Date },

    isAnonymous: {
    type: Boolean,
    default: false
  },

    //bài post cần có admin duyệt
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", questionSchema);
