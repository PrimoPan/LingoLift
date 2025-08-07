const mongoose = require("mongoose");

// **强化物 Schema**
const reinforcementSchema = new mongoose.Schema({
  id: Number,
  value: String,
  categoryIndex: Number,
  image: {
    remote: String // ✅ **只存 `remote` URL，不存 `uri`**
  }
});

// **学习历史 Schema**
const learningHistorySchema = new mongoose.Schema({
  命名: {
    level: String,
    detail: [
      {
        title: String,
        code: String,
        description: mongoose.Schema.Types.Mixed // ✅ **支持字符串或数组**
      }
    ],
    Draft: String
  },
  语言结构: {
    level: String,
    detail: [
      {
        title: String,
        code: String,
        description: mongoose.Schema.Types.Mixed
      }
    ],
    Draft: String
  },
  对话: {
    level: String,
    detail: [
      {
        title: String,
        code: String,
        description: mongoose.Schema.Types.Mixed
      }
    ],
    Draft: String
  },
  构音: {
    cards: [
      {
        word: String,
        pinyin: String,
        image: String
      }
    ],
    teachingGoal: String,
    fy: String,
    Draft: String
  },
  主题场景: {
    major: String,
    activity: String,
    background: String
  },
  createdAt: { type: Date, default: Date.now } // ✅ **学习记录的创建时间**
});

// **儿童 Schema**
const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  courseDuration: Number,
  reinforcements: [reinforcementSchema], // ✅ **使用独立的强化物 Schema**
  命名: Number,
  语言结构: Number,
  对话: Number,
  selectedInitials: [String],
  createdAt: { type: Date, default: Date.now }, // ✅ **创建时自动生成**
  changedAt: { type: Date, default: null }, // ✅ **仅在更新时修改**
  childImage: String,
  imageStyle: String,
  LearningHistory: [learningHistorySchema] // ✅ **新增学习历史**
});

// **教师 Schema**
const teacherSchema = new mongoose.Schema({
  username: String,
  password: String,
  children: [childSchema] // **每个教师可以管理多个儿童**
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
