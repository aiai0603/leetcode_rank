let { pool } = require("../db/db.js");
module.exports = {
  add: function (user, callback) {
    // users表中增加user操作
    let sqlparam = [
      user.leet_id ? user.leet_id : "",
      user.name ? user.name : "",
    ];
    pool.query(
      "INSERT INTO user(leet_id,name) VALUES (?,?);",
      sqlparam,
      function (error, result) {
        if (error) throw error;
        callback(result);
      }
    );
  },

  findByName: function (params, callback) {
    // users表中查询指定user操作
    let { leet_id } = params;
    let sqlparam = [leet_id];
    pool.query(
      "SELECT * FROM user WHERE leet_id = ?;",
      sqlparam,
      function (error, result) {
        if (error) throw error;
        callback(result[0]);
      }
    );
  },

  queryAll: function (params, callback) {
    // user表中查询全部user操作
    pool.query("SELECT * FROM user", params, function (error, result) {
      if (error) throw error;
      callback(result);
    });
  },
};
