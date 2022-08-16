const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const json = express.json({ type: "*/json" });
const fs = require("fs"); //引入fs模块

// 跨域设置
app.all("*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.setHeader("Content-Type", "application/json");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
});

app.get("/list", function (req, res) {
  //读取json文件中的内容
  let str = fs.readFileSync(__dirname + "/data.json", "utf-8");
  //把数据转换成数组
  let arr = (str && JSON.parse(str)) || [];
  res.send(arr);
});

app.use(json);
app.use(bodyParser.urlencoded({ extended: false }));
app.post("/add", function (req, res) {
  //读取json文件中的内容
  let str = fs.readFileSync(__dirname + "/data.json", "utf-8");
  //把数据转换成数组
  let arr = (str && JSON.parse(str)) || [];
  arr.push(...req.body);
  // arr =filterJson(arr,'type')
  //把最新的数据写入json文件中
  fs.writeFileSync(__dirname + "/data.json", JSON.stringify(arr));
  res.send(arr);
});

app.listen("8888", () => {
  console.log("服务器启动成功");
});

function filterJson(data, Name) {   //data是json对象，Name是根据什么字段去重
  var map = {},
    dest = [];
  for (var i = 0; i < data.length; i++) {
      var ai = data[i];
      if (i == 0) {
          dest.push(ai);
      } else {
          var filterData = dest.filter(function (e) {
              return e[Name] == ai[Name];
          })
          if (filterData.length == 0) {
              dest.push(ai);
          }
      }
  }
  return dest;
}

