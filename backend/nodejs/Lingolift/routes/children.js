const express = require("express");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const router = express.Router();
const SECRET_KEY = "LingoLiftSecretKey";  // JWT 密钥

// **创建或更新儿童信息**
router.post("/ChangeChildrenInfo", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "未授权" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    // **找到教师**
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) return res.status(404).json({ success: false, message: "教师账号不存在" });

    const childData = req.body;

    // **检查儿童是否已存在**
    const existingChildIndex = teacher.children.findIndex(child => child.name === childData.name);

    if (existingChildIndex !== -1) {
      // **获取当前儿童对象**
      const existingChild = teacher.children[existingChildIndex];

      // ✅ **更新儿童信息，但保留 `LearningHistory`**
      teacher.children[existingChildIndex] = {
        ...existingChild,  // ✅ **保留原数据**
        ...childData,      // ✅ **更新最新数据**
        createdAt: existingChild.createdAt || new Date(), // ✅ **确保 `createdAt` 保持不变**
        changedAt: new Date(), // ✅ **只更新 `changedAt`**
        LearningHistory: existingChild.LearningHistory || []  // ✅ **确保 `LearningHistory` 被保留**
      };
    } else {
      // **创建新儿童**
      const newChild = {
        ...childData,
        createdAt: new Date(), // ✅ **创建时自动添加 `createdAt`**
        changedAt: new Date(), // ✅ **新建时 `changedAt` 也初始化**
        LearningHistory: []  // ✅ **新儿童默认 `LearningHistory` 为空**
      };
      teacher.children.push(newChild);
    }

    await teacher.save();
    res.json({ success: true, message: "儿童信息已更新", data: teacher.children });
  } catch (error) {
    console.error("❌ ChangeChildrenInfo 错误:", error);
    res.status(500).json({ success: false, message: "创建或更新儿童信息失败" });
  }
});


router.get("/GetChildrenList", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "未授权" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    // **找到教师**
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "教师账号不存在" });
    }

    // **返回教师的儿童信息**
    res.json({
      success: true,
      message: "查询成功",
      data: teacher.children || []  // 确保返回数组
    });
  } catch (error) {
    console.error("❌ GetChildrenList 错误:", error);
    res.status(500).json({ success: false, message: "查询儿童信息失败" });
  }
});



router.get("/GetChildDetails", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "未授权" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    const { id, name } = req.query; // ✅ 允许查询 `id` 或 `name`
    if (!id && !name) {
      return res.status(400).json({ success: false, message: "缺少儿童 ID 或 名称参数" });
    }

    // ✅ 找到当前登录教师
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "教师账号不存在" });
    }

    let child;

    // ✅ 允许通过 `id` 或 `name` 进行查找
    if (id) {
      child = teacher.children.find(child => child._id.toString() === id);
    } else if (name) {
      child = teacher.children.find(child => child.name === name);
    }

    if (!child) {
      return res.status(404).json({ success: false, message: "儿童未找到" });
    }

    // ✅ 返回学习历史（倒序排列）
  

    res.json({
      success: true,
      message: "查询成功",
      data: child
    });

  } catch (error) {
    console.error("❌ GetLearningHistoryForChild 错误:", error);
    res.status(500).json({ success: false, message: "查询学习历史失败" });
  }
});

router.get("/GetLearningHistoryForChild", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "未授权" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    const { id, name } = req.query; // ✅ 允许查询 `id` 或 `name`
    if (!id && !name) {
      return res.status(400).json({ success: false, message: "缺少儿童 ID 或 名称参数" });
    }

    // ✅ 找到当前登录教师
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "教师账号不存在" });
    }

    let child;

    // ✅ 允许通过 `id` 或 `name` 进行查找
    if (id) {
      child = teacher.children.find(child => child._id.toString() === id);
    } else if (name) {
      child = teacher.children.find(child => child.name === name);
    }

    if (!child) {
      return res.status(404).json({ success: false, message: "儿童未找到" });
    }

    // ✅ 返回学习历史（倒序排列）
    const learningHistory = child.LearningHistory || [];
    const sortedHistory = learningHistory.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      message: "查询成功",
      data: sortedHistory
    });

  } catch (error) {
    console.error("❌ GetLearningHistoryForChild 错误:", error);
    res.status(500).json({ success: false, message: "查询学习历史失败" });
  }
});



module.exports = router;
 