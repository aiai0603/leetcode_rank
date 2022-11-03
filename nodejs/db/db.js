
var mysql               = require('mysql');


var pool = mysql.createConnection({      //创建mysql实例
    host:'***********',
    port:'3306',
    user:'root',
    password:'*************',
    database:'leetocde'
});




module.exports ={
    pool
}