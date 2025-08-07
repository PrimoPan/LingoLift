const express = require("express");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const router = express.Router();
const SECRET_KEY = "LingoLiftSecretKey";  // JWT 密钥

// **创建新的学习历史记录**
router.post("/CreateLearning", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "未授权" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    const { Goals, childName } = req.body;
    if (!Goals || !childName) return res.status(400).json({ success: false, message: "缺少必要参数" });

    // **找到教师**
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) return res.status(404).json({ success: false, message: "教师账号不存在" });

    // **找到儿童**
    const childIndex = teacher.children.findIndex(child => child.name === childName);
    if (childIndex === -1) return res.status(404).json({ success: false, message: "儿童未找到" });

    // **获取当前儿童**
    const child = teacher.children[childIndex];

    // **创建新的学习历史记录**
    const newLearningRecord = {
      ...Goals,
      createdAt: new Date() // ✅ **自动生成创建时间**
    };

    // ✅ **确保 `LearningHistory` 数组不被覆盖**
    child.LearningHistory = Array.isArray(child.LearningHistory) ? [...child.LearningHistory, newLearningRecord] : [newLearningRecord];

    console.log("📌 添加新学习记录: ", newLearningRecord);
    console.log("📌 儿童姓名: ", childName);

    // **保存到数据库**
    await teacher.save();

    res.json({
      success: true,
      message: "学习记录添加成功",
      data: child.LearningHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // ✅ 按时间排序返回
    });
  } catch (error) {
    console.error("❌ CreateLearning 错误:", error);
    res.status(500).json({ success: false, message: "添加学习记录失败" });
  }
});

module.exports = router;
