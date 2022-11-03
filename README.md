# 简单LEETCODE排行榜

## 基本介绍

前端页面：VUE 3.x+element-plus

后端：node-express

数据获取：基于leetcode官方接口（proxy解决跨域）

预览地址： http://47.97.158.11:8692/leetocde 

界面说明：![image-20221103130754683](/img/image-20221103130754683.png)

### 本地项目搭建

#### 后端连接数据库

1. 进入nodejs文件夹

2. npm 安装 express和mysql依赖

3. 进入db/db.js，修改host(数据库地址)端口、用户名、密码和数据库名字

   ```js
   var pool = mysql.createConnection({      //创建mysql实例
       host:'*******',
       port:'3306',
       user:'root',
       password:'*****',
       database:'leetocde'
   });
   
   ```

4. 创建数据库（本人数据库名字leetcode），因为全部基于api获取数据所以只需要存一个leetcode

   | id(自增) | leet_id（leet_code的id） | name(群友名字等) |
   | -------- | ------------------------ | ---------------- |

5. 启动node服务

   ```js
   node express_test.js
   ```

#### 前端页面

1. 进入vue文件夹

2. 安装依赖

   ```js
   npm install
   ```

3. 修改vue.config.js的文件，proxy变成你的后台地址

   ```js、
   const { defineConfig } = require("@vue/cli-service");
   module.exports = defineConfig({
     publicPath: './',
     devServer: {
       proxy: {
         '/user': {
           target: "http://**************", // 修改你的后台地址+端口，就是刚刚启动的node服务地址
           changeOrigin: true,  		  // 是否跨域
         },
         '/graphql': {
           target: "https://leetcode.cn", // leetcode的地址，别改
           changeOrigin: true,  		  // 是否跨域
         }
       }
     }
   
   });
   ```

4. 启动项目

   ```js
   npm run serve
   ```

5. 前端基本介绍

   - public

     存放公共文件，比如我存在了K和U的图片用于展示

   - src/api

     调用axios调接口的逻辑配置

   - src/router

     vue路由配置

   - src/components

     addUser：常规的表单调接口提交，优化todo(后端已经做了leetcodeid重复校验了)

     rankList：主要的排行榜逻辑页面

   - leetcode官方api调用说明

     主要的你打开leetcode的主页，可以看到调用了很多的api内容，你可以F12然后再网络模块找它调用的接口，然后调用它就能获得数据，但是leetcode官方显然设置了跨域，所以我们使用vue的proxy代理来调用接口解决问题。

     主要的api在get_steak（打卡），get_language（解题语言）、get_ques（接替数量）、get_content（竞赛）中，需要其他数据可以直接去扒下来，调用方法是POST，调用接口主要是/graphql/noj-go/和/graphql这两个，参数是json格式，构造如下：

     ```js
     {
         query:
               "\n    query userContestRankingInfo($userSlug: String!) {\n  userContestRanking(userSlug: $userSlug) {\n  rating\n   localRanking\n  globalRanking\n  topPercentage\n  }\n     " +
               " userProfileUserLevelMedal(userSlug: $userSlug) {\n    current {\n      name\n       }\n   }\n     }\n",   //传入要查询内容，需要的更多内容请自己去扒下来
     	variables: { userSlug: id }//传入需要查询的人的id
     }
     ```
     



### 线上项目搭建

#### 后端连接数据库

线上环境的话这里用的是阿里云的centos7

数据库的自己搜索阿里云mysql安装即可，记得开防火墙，不赘述了，网上资料很多

node的启动用的是forever这个库，具体操作是

1. 在服务器上安装node（网上教程一堆，不多赘述了）

2. 全局安装forever

   ```js
   npm install forever -g
   ```

3. 把nodejs文件夹移入服务器中任意位置，进入nodejs文件夹

4. forever启动express项目

   ```js
   forever start app.js 
   ```

   **注意：**这个项目的默认启动端口是3333，修改在nodejs文件夹的index.js文件的最后一行，自行修改即可，记得要打开这个端口，不让外面访问不到

5. 可以用postman等工具测试一下接口能不能访问

#### 前端页面

因为涉及到端口转发，所以我们用nginx来启动vue项目

1. 首先在服务器上安装nginx（网上教程一堆，不多赘述了）

2. 打开nginx的配置文件 nginx.conf，从server开始修改，说明如下：

   ```conf
    server {
           listen       8692;               #你网页要运行的端口
           listen       [::]:8692;			 #你网页要运行的端口
           server_name  localhost;
           # Load configuration files for the default server block.
           include /etc/nginx/default.d/*.conf;
   
   	    location ^~/user/ {              #本地node服务接口的跨域
    		add_header Access-Control-Allow-Origin *;
                   add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
   		add_header Access-Control-Allow-Credentials true;
   		proxy_set_header X-NginX-Proxy true;		
   		rewrite    ^(.*)request(.*)$   $1/$2; break;
    		#root html/dist;
   		proxy_pass http://localhost:3333;        #改一下这个就行，把端口改成你自己的后台端口
   		index  index.html index.htm;
   
   	   }
   
   	   location ^~/graphql {             #leetocde服务接口的跨域
    		add_header Access-Control-Allow-Origin *;
                   add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
   		add_header Access-Control-Allow-Credentials true;
   		proxy_set_header X-NginX-Proxy true;		
   		rewrite    ^(.*)request(.*)$   $1/$2; break;
    		#root html/dist;
   		proxy_pass https://leetcode.cn;        #改一下这个！
   		index  index.html index.htm;
   
   	   }
   
   
           location = /leetcode {                                       #/leetcode是最后的访问路径，你可以自定义
           		root         /usr/share/nginx/html/leetcode;         #我们的nginx网页放的位置，
           		index        /index.html;                            #网页名称（这两个我们后面再说）
           }
   
   }	
   ```

3. build我们的vue项目，运行

   ```js
   npm run build
   ```

   注意这个时候我们的项目会生成一个dist文件夹，可以打开文件夹里的index.html看一下能不能正常现实

4. 把整个dist文件夹复制到nginx的html文件夹下面，我这里是在/usr/share/nginx/html这个位置

5. 之后把文件夹改名leetcode（你也可以自己改喜欢的名字，但是要记得把上文提到的     root         /usr/share/nginx/html/leetcode;  改成自己的路径名称

6. 启动nginx（根据自己的版本找教程）



### 查看效果

如果你正常按照我说的操作的话，可以在

http:自己的服务器地址:nginx的端口/leetcode访问到你的网页

比如作者的项目地址：

[排行榜]: http://47.97.158.11:8692/leetocde

## 优化TODO

1. 人多的时候一个一个加载很慢，考虑做一个缓存和定时刷新的任务来获取数据，但是这样可能就不实时更新了，作者在考虑采用实时刷新+缓存的方法来运行，而且滚榜的方式很像acm作者很喜欢（才不是懒得优化）
2. 运行时的校验和容错还没做好，比如说可能输入一个错误的id也能登记进去
3. 一个管理员界面（作者懒得写，大家加油）
4. 更精美的界面和数据展示方式（css懒癌晚期）
5. 数据统计（可能和管理员界面一起更新）



## 写在最后

失业前端一枚，长期更新一些前端的项目，如vue，react，小程序，electron，web3d等

对项目有疑问的同好可以加QQ 1016868503
