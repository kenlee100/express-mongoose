const express = require('express');
const router = express.Router();
const Post = require("../models/post");

const handleError = require("../handleError");
const handleSuccess = require("../handleSuccess");

// 取得所有貼文
router.get('/', async (req, res, next) =>{
    const posts = await Post.find()
    handleSuccess(res, posts, '資料取得成功')
});

// 新增一筆貼文
router.post('/', async(req, res, next) =>{
    try {
        const { name, content, image, like, tags } = req.body;
        if (content && name && tags.length) {
            const newPost = await Post.create(req.body)
            handleSuccess(res, newPost, '新增成功')
        } else {
            handleError(res);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// 刪除所有貼文
router.delete('/', async(req, res, next) =>{
    const data = await Post.deleteMany({});
    handleSuccess(res, data, '修改成功')
});

// 刪除一筆貼文
router.delete('/:id', async(req, res, next) =>{
    const id = req.params.id
    await Post.findByIdAndDelete(id);
    handleSuccess(res, null, '刪除成功')
});

// 更新一筆貼文
router.patch('/:id', async(req, res, next) =>{
    const id = req.params.id
    const { name, content, tags, likes, image } = req.body
    if (id && (name || content || tags.length)) {
        await Post.findByIdAndUpdate(id, { name, content, tags, likes, image  });
        handleSuccess(res, null, '更新成功')
    } else {
        handleError(res);
    }
});

module.exports = router;