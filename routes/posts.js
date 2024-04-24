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
        const { name, content, image, likes, tags } = req.body;
        if (content && name && tags.length) {
            const newPost = await Post.create(
                { 
                    name: typeof name === 'string' ? name.trim() : "",  
                    content: typeof content === 'string' ? content.trim() : "", 
                    image: typeof image === 'string' ? image.trim() : "",
                    likes,
                    tags
                }
            )
            handleSuccess(res, newPost)
        } else {
            handleError(res);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// 刪除所有貼文
router.delete('/', async(req, res, next) =>{
    if(req.originalUrl === '/posts') {
        const data = await Post.deleteMany({});
        handleSuccess(res, data, '修改成功')
    } else {
        handleError(res);
    }
});

// 刪除一筆貼文
router.delete('/:id', async(req, res, next) =>{
    try {
        const id = req.params.id
        const findId = await Post.findById(id)
        if(findId.id) {
            const deletePost = await Post.findByIdAndDelete(id, {},{
                new: true,
            })
            handleSuccess(res, deletePost, '刪除成功');
        } else {
            handleError(res);
        }
    } catch (error) {
        handleError(res, error);
    }
});

// 更新一筆貼文
router.patch('/:id', async(req, res, next) =>{
    try {
        const id = req.params.id
        const findId = await Post.findById(id)
        const { name, content, tags, likes, image } = req.body
        if (findId.id && name && content && tags.length) {
            const updatePost = await Post.findByIdAndUpdate(id, {
                name: typeof name === 'string' ? name.trim() : "",  
                content: typeof content === 'string' ? content.trim() : "", 
                image: typeof image === 'string' ? image.trim() : "",
                likes, 
                tags
              },
              {
                new: true,
                runValidators: true
              });
            handleSuccess(res, updatePost, '更新成功')
        } else {
            handleError(res);
        }
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;