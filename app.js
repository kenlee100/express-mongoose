const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const app = express();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  console.error('Uncaught Exception');
  console.error(err);
  process.exit(1)
})

const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("資料庫連接成功"))
  .catch((error) => {
    console.log("error", error);
  });

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);


// 404 錯誤
app.use(function(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: "無此路由資訊",
  });
});


// express 錯誤處理
// production 環境錯誤處理
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message
    });
  } else {
    // log 紀錄
    console.error('出現重大錯誤', err);
    // 送出預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請聯絡系統管理員'
    });
  }
};

// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
};

app.use(function(err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  } 
  // production
  if (err.name === 'ValidationError'){
    err.message = "資料欄位未填寫正確，請重新輸入！"
    err.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
