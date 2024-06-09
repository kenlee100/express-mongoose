const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content 未填寫"],
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "貼文姓名未填寫"],
    },
    likes: {
      type: Number,
      default: 0,
    },

    tags: {
      type: Array,
      required: [true, "貼文標籤 tags 未填寫"],
      validate: [
        {
          validator: function (v) {
            return v && v.length > 0;
          },
          message: "貼文標籤 tags 未填寫",
        },
        {
          validator: function (v) {
            return v.every(function (tag) {
              return typeof tag === "string";
            });
          },
          message: "tags 裡面的資料必須為字串格式",
        },
      ],
    },
  },
  {
    versionKey: false,
  }
);
const Post = mongoose.model("post", postSchema);

module.exports = Post;
