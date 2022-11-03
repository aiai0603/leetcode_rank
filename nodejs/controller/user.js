var express = require("express");
var router = express.Router();
let { add, findByName, queryAll } = require("../dao/user.js"); // 数据库操作

router.get("/all", function (req, res, next) {

  queryAll(null, function (success) {
    if (success == null) {
      res.json({
        status: "400",
        data: "查询失败",
      });
    } else {
      res.json({
        status: "200",
        data: success,
      });
    }
  });
});

router.post("/sign/new", function (req, res, next) {
  let urlParam = req.body;


  findByName(urlParam, function (success) {
    if (success != null) {
      res.json({
        status: "400",
        data: "账号已经被用过了哦",
      });
    } else {
      add(urlParam, function (success) {
        if (success == null) {
          res.json({
            status: "400",
            data: "操作失败",
          });
        } else {
          res.json({
            status: "200",
            data: success,
          });
        }
      });
    }
  });
});

module.exports = router;
