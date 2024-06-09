const express = require("express");
const router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const Post = require("../models/posts");
const User = require("../models/users");

const handleError = require("../handleError");
const handleSuccess = require("../handleSuccess");

// 取得所有貼文
router.get("/", async (req, res, next) => {
  // asc 遞增(由小到大，由舊到新) createdAt ;
  // desc 遞減(由大到小、由新到舊) "-createdAt"
  const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
  const q =
    req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
  const posts = await Post.find(q)
    .populate({
      path: "user",
      select: "name photo ",
    })
    .sort(timeSort);
  handleSuccess(res, posts, "資料取得成功");
});

// 新增一筆貼文
router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const { user, content, image, likes, tags } = req.body;
    if (!content) {
      return next(appError(400, "你沒有填寫 content 資料", next));
    }
    const newPost = await Post.create({
      user: typeof user === "string" ? user.trim() : "",
      content: typeof content === "string" ? content.trim() : "",
      image: typeof image === "string" ? image.trim() : "",
      likes,
      tags,
    });
    handleSuccess(res, newPost);
  })
);

// 刪除所有貼文
router.delete("/", async (req, res, next) => {
  if (req.originalUrl === "/posts") {
    const data = await Post.deleteMany({});
    handleSuccess(res, data, "修改成功");
  } else {
    handleError(res);
  }
});

// 刪除一筆貼文
router.delete(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const findId = await Post.findById(id);
    if (!findId) {
      return next(appError(400, "找不到此 id", next));
    }
    const deletePost = await Post.findByIdAndDelete(
      id,
      {},
      {
        new: true,
      }
    );
    handleSuccess(res, deletePost, "刪除成功");
  })
);

// 更新一筆貼文
router.patch(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    const findId = await Post.findById(id);
    if (!findId) {
      return next(appError(400, "找不到此 id", next));
    }
    const { content, tags, likes, image } = req.body;
    const updatePost = await Post.findByIdAndUpdate(
      id,
      {
        content: typeof content === "string" ? content.trim() : "",
        image: typeof image === "string" ? image.trim() : "",
        likes,
        tags,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    handleSuccess(res, updatePost, "更新成功");
  })
);

module.exports = router;
