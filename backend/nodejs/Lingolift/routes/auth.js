const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

const router = express.Router();
const SECRET_KEY = "LingoLiftSecretKey";  // JWT 密钥

// **教师登录接口**
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacher = await Teacher.findOne({ username });
    if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
      return res.status(401).json({ success: false, message: "账号或密码错误" });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ id: teacher._id, username: teacher.username }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "登录失败" });
  }
});

module.exports = router;
