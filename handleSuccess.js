const handleSuccess = (res, data, message = "成功") => {
  if (data === null) {
    res.status(200).json({
      status: "success",
      message: message,
    });
  } else {
    res.status(200).json({
      status: "success",
      message: message,
      data: data,
    });
  }
};
module.exports = handleSuccess;
