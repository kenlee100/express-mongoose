const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");

const handleError = require("../handleError");
const handleSuccess = require("../handleSuccess");

// 取得所有貼文
router.get("/", async (req, res, next) => {
  // asc 遞增(由小到大，由舊到新) createdAt ;
  // desc 遞減(由大到小、由新到舊) "-createdAt"
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const posts = await Post.find(q).populate({
    path: 'user',
    select: 'name photo '
  }).sort(timeSort);
  handleSuccess(res, posts, "資料取得成功");
});

// 新增一筆貼文
router.post("/", async (req, res, next) => {
  try {
    const { user, content, image, likes, tags } = req.body;
    if (content && user && tags.length) {
      const newPost = await Post.create({
        user: typeof user === "string" ? user.trim() : "",
        content: typeof content === "string" ? content.trim() : "",
        image: typeof image === "string" ? image.trim() : "",
        likes,
        tags,
      });
      handleSuccess(res, newPost);
    } else {
      handleError(res);
    }
  } catch (error) {
    handleError(res, error);
  }
});

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
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const findId = await Post.findById(id);
    if (findId.id) {
      const deletePost = await Post.findByIdAndDelete(
        id,
        {},
        {
          new: true,
        }
      );
      handleSuccess(res, deletePost, "刪除成功");
    } else {
      handleError(res);
    }
  } catch (error) {
    handleError(res, error);
  }
});

// 更新一筆貼文
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const findId = await Post.findById(id);
    const { user, content, tags, likes, image } = req.body;
    if (findId.id && user && content && tags.length) {
      const updatePost = await Post.findByIdAndUpdate(
        id,
        {
          user: typeof user === "string" ? user.trim() : "",
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
    } else {
      handleError(res);
    }
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
