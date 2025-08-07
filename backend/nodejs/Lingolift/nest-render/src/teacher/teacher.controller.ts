import { Controller, Get, Render, Post, Body, Res, Session, Param, Query } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';


@Controller()
export class TeacherController {
  
  // 显示登录页面
  @Get('login')
  @Render('login')
  loginPage() {
    console.log('TeacherController: loginPage() 方法被调用');
    return { message: null };
  }

  // 处理登录请求
  @Post('login')
  async login(@Body() body, @Session() session, @Res() res) {
    const { username, password } = body;
    try {
      const apiResponse = await axios.post('http://localhost:2124/api/login', { username, password });
      const { success, token } = apiResponse.data;
      if (!success) {
        return res.render('login', { message: '账号或密码错误' });
      }
      session.token = token;
      session.username = username;
      return res.redirect('/teacher/dashboard');
    } catch (error) {
      return res.render('login', { message: '登录失败或服务器错误' });
    }
  }

  // 进入菜单页面（需要鉴权）
  @Get('dashboard')
  @Render('dashboard')
  dashboard(@Session() session, @Res() res) {
    if (!session.token) {
      return res.redirect('/teacher/login');
    }
    return { username: session.username };
  }

  // 退出登录
  @Get('logout')
  logout(@Session() session, @Res() res) {
    session.destroy(() => {
      res.redirect('/teacher/login');
    });
  }

  // 显示儿童列表页面
  @Get('childrenlist')
  @Render('childrenlist')
  async childrenList(@Session() session, @Res() res) {
    if (!session.token) {
      return res.redirect('/teacher/login');
    }
    try {
      const response = await axios.get('http://localhost:2124/api/GetChildrenList', {
        headers: { 'Authorization': `Bearer ${session.token}` }
      });
      const { success, data, message } = response.data;
      if (!success) {
        return { children: [], error: message || '查询失败' };
      }
      console.log("✅ 获取儿童列表成功:", data);
      return { children: data, error: null };
    } catch (error) {
      console.error("获取儿童列表出错:", error);
      return { children: [], error: '查询儿童信息失败' };
    }
  }

  // 新增: 查询儿童详情，支持通过 URL 查询参数传递 name（或id）
  @Get('child/:id')
  @Render('child')
  async getChildDetails(
    @Param('id') id: string,
    @Query('name') childName: string,  // 允许通过查询字符串传递儿童名称
    @Session() session,
    @Res() res
  ) {
    if (!session.token) {
      return res.redirect('/teacher/login');
    }

    try {
      console.log(`✅ 查询儿童详情: id=${id}, name=${childName}`);
      // 传递参数：如果 childName 存在，则优先使用，否则使用 id 查询
      const response = await axios.get('http://localhost:2124/api/GetChildDetails', {
        headers: { 'Authorization': `Bearer ${session.token}` },
        params: { name: childName || id }
      });

      const { success, data, message } = response.data;
      if (!success) {
        console.error("❌ 获取儿童详情失败:", message);
        return { child: null, error: message || '查询失败' };
      }
      console.log("✅ 获取儿童详情成功:", data);

      // 按时间倒序排列学习历史（兼容 createdAt 为 { $date } 或 Date 字符串）
      data.LearningHistory = data.LearningHistory?.sort((a, b) => 
        new Date(b.createdAt.$date || b.createdAt).getTime() - 
        new Date(a.createdAt.$date || a.createdAt).getTime()
      ) || [];

      return { child: data, error: null };
    } catch (error) {
      console.error("❌ 获取儿童详情出错:", error);
      return { child: null, error: '查询儿童信息失败' };
    }
  }

  // 新增: 显示单条教学记录详情页面
  @Get('record/:index')
@Render('record')
async getRecordDetails(
  @Param('index') index: string,
  @Query('childId') childId: string, // 从查询参数中传入儿童ID
  @Session() session,
  @Res() res
) {
  if (!session.token) {
    return res.redirect('/teacher/login');
  }

  try {
    console.log(`✅ 查询教学记录详情: childId=${childId}, index=${index}`);

    // 获取儿童详情（通过 id 查询）
    const childResponse = await axios.get('http://localhost:2124/api/GetChildDetails', {
      headers: { 'Authorization': `Bearer ${session.token}` },
      params: { id: childId }
    });
    const { success, data, message } = childResponse.data;
    if (!success) {
      console.error("❌ 获取儿童详情失败:", message);
      return { record: null, error: message || '查询失败' };
    }

    // 按时间倒序排列学习历史
    data.LearningHistory = data.LearningHistory?.sort((a, b) =>
      new Date(b.createdAt.$date || b.createdAt).getTime() - 
      new Date(a.createdAt.$date || a.createdAt).getTime()
    ) || [];

    const recordIndex = parseInt(index);
    if (isNaN(recordIndex) || recordIndex < 0 || recordIndex >= data.LearningHistory.length) {
      return { record: null, error: '无效的记录索引' };
    }

    const record = data.LearningHistory[recordIndex];
    // 将 recordIndex 一并返回给模板
    return { record, child: data, recordIndex, error: null };
  } catch (error) {
    console.error("❌ 获取教学记录详情出错:", error);
    return { record: null, error: '查询记录失败' };
  }
}


  // AR部分
  @Get('ar')
  async arTeaching(
    @Query('childId') childId: string,
    @Query('recordIndex') recordIndexStr: string,
    @Session() session,
    @Res() res
  ) {
    if (!session.token || !childId || !recordIndexStr) {
      return res.redirect('/teacher/login');
    }
    try {
      console.log(`✅ AR教学: childId=${childId}, recordIndex=${recordIndexStr}`);
  
      const recordIndex = parseInt(recordIndexStr);
      if (isNaN(recordIndex)) {
        return res.send("无效的记录索引");
      }
  
      // 获取儿童详情（通过 id 查询）
      const childResponse = await axios.get('http://localhost:2124/api/GetChildDetails', {
        headers: { 'Authorization': `Bearer ${session.token}` },
        params: { id: childId }
      });
      const { success, data, message } = childResponse.data;
      if (!success) {
        console.error("❌ 获取儿童详情失败:", message);
        return res.send("获取儿童详情失败: " + message);
      }
  
      // 按时间倒序排列学习历史（兼容 createdAt 为 { $date } 或 Date 字符串）
      data.LearningHistory = data.LearningHistory?.sort((a, b) =>
        new Date(b.createdAt.$date || b.createdAt).getTime() - 
        new Date(a.createdAt.$date || a.createdAt).getTime()
      ) || [];
      if (recordIndex < 0 || recordIndex >= data.LearningHistory.length) {
        return res.send("记录索引超出范围");
      }
  
      // 选择被选中的教学记录
      const record = data.LearningHistory[recordIndex];
  
      // 从选中的记录中获取背景图和素材图
      const bgUrl = record['主题场景']?.background;
      const cards = record.构音?.cards || [];
  
      console.log("背景图 URL:", bgUrl);
  
      // 定义保存路径，使用 process.cwd() 获取项目根目录
      const arDir = path.join(process.cwd(), 'public/ar');
      if (!fs.existsSync(arDir)) {
        fs.mkdirSync(arDir, { recursive: true });
        console.log("✅ 创建静态资源目录:", arDir);
      }
      const bgPath = path.join(arDir, 'bg.png');
      if (bgUrl) {
        const bgResponse = await axios.get(bgUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(bgPath, bgResponse.data);
        console.log("✅ 背景图片下载成功");
      } else {
        console.warn("背景图 URL 为空");
      }
  
      // 下载素材图（最多下载4张）
      for (let i = 0; i < Math.min(cards.length, 4); i++) {
        const cardUrl = cards[i].image;
        if (cardUrl) {
          const cardResponse = await axios.get(cardUrl, { responseType: 'arraybuffer' });
          const cardPath = path.join(arDir, `show${i + 1}.png`);
          fs.writeFileSync(cardPath, cardResponse.data);
          console.log(`✅ 素材图 ${i + 1} 下载成功`);
        }
      }
  
      // 下载完成后重定向到 AR 页面（假设 AR 页面为 /ar/index.html，通过 Express 静态资源提供）
      return res.redirect('/ar');
    } catch (error) {
      console.error("❌ AR教学处理出错:", error);
      return res.send("AR教学处理出错");
    }
  }
  
  


}
