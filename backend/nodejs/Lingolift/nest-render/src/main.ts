import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 设置视图引擎
  app.useStaticAssets(join(__dirname, '..', 'public')); // 存放静态资源（如 CSS）
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // 视图文件
  app.setViewEngine('ejs'); // 使用 EJS 渲染

  // 配置 Session
  app.use(session({
    secret: 'LingoLiftSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  await app.listen(2124); // 在 2124 端口运行
}
bootstrap();
