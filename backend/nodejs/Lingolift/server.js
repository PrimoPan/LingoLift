require("reflect-metadata");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const { NestFactory } = require("@nestjs/core");
const { ExpressAdapter } = require("@nestjs/platform-express");
const { AppModule } = require("./nest-render/dist/app.module");

const authRoutes = require("./routes/auth");
const childrenRoutes = require("./routes/children");
const learningRoutes = require("./routes/learning");

const app = express();
const PORT = 2124;

// ✅ 连接 MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/lingolift")
  .then(() => console.log("✅ MongoDB 连接成功"))
  .catch(err => console.error("❌ MongoDB 连接失败:", err));

// ✅ Express 中间件
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'LingoLiftSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ✅ Express API 路由（仅处理 /api/* 请求）
app.use("/api", authRoutes);
app.use("/api", childrenRoutes);
app.use("/api", learningRoutes);

// 确保你已经引入 express，例如：const express = require('express');

//导入ar
app.use('/ar', express.static(path.join(__dirname, 'public/ar')));

// ✅ 嵌入 Nest.js 应用，处理 `/teacher/*` 请求
async function bootstrapNest() {
  const nestApp = await NestFactory.create(AppModule);

  // ✅ 确保 Nest.js 使用 EJS 视图
  nestApp.setBaseViewsDir(path.join(__dirname, "nest-render/views"));
  nestApp.setViewEngine("ejs");

  await nestApp.init();

  // ✅ 让 Express 处理 `/teacher/` 请求，并转发给 Nest.js
  app.use("/teacher", (req, res, next) => {
    console.log("请求到达 /teacher/: ", req.path);
    next();
  });
  app.use("/teacher", nestApp.getHttpAdapter().getInstance());
  
}

// 启动 Nest.js
bootstrapNest()
  .then(() => {
    // ✅ 最终启动 Express 服务器
    app.listen(PORT, () => {
      console.log(`✅ LingoLift 服务运行在 http://10.30.9.1:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Nest.js 启动失败:", err);
  });
