# LingoLift

LingoLift 是一个面向孤独症儿童个别化教学的 React Native 应用。项目核心能力围绕三件事：

- 基于儿童档案生成个别化教学目标
- 基于教学目标调用 LLM 生成教案草稿
- 基于场景/词语生成教学图片素材

## 核心功能

- 教师登录与儿童档案管理
- 教学主题、场景、模块目标的分步配置
- 构音 / 命名 / 语言结构 / 对话 4 类模块化教案生成
- 教学历史记录回看
- 强化物图片自动生成与缓存

## 技术栈

- React Native 0.76
- Expo SDK 52（依赖中包含）
- Zustand（状态管理）
- Axios（接口请求）
- Jest + ESLint（基础工程质量保障）

## 目录结构

```text
.
├─ App.tsx                     # 应用入口路由
├─ src/
│  ├─ services/api.js          # 业务后端 API（登录、儿童信息、学习记录）
│  ├─ utils/api.js             # GPT/生图接口封装
│  ├─ store/store.jsx          # Zustand 全局状态
│  ├─ Procedure/               # 教学流程编排页
│  ├─ Draft/                   # 教案草稿页
│  └─ ...
├─ components/                 # 复用组件
├─ assets/                     # 静态资源
└─ package.json
```

## 环境要求

- Node.js >= 18
- Yarn 1.x（项目当前使用 `yarn.lock`）

可选（真机/模拟器调试）：

- Android Studio（Android）
- Xcode（iOS）

## 本地启动

1. 安装依赖

```bash
yarn install
```

2. 启动 Metro

```bash
yarn start
```

3. 启动 App

```bash
# 若仓库中存在 android/ios 原生目录
yarn android
yarn ios
```

如果当前分支没有 `android/`、`ios/` 目录，建议直接使用 Expo 方式启动：

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

## API 配置

当前仓库有两处后端入口配置：

- `src/services/api.js` 中的 `BASE_URL`
- `src/utils/api.js` 中的 `BASE_URL`

请在开发/部署前替换成你自己的服务地址。登录成功后，JWT Token 会存入 Zustand（`store.token`），后续请求自动带上 `Authorization`。

## 常用命令

```bash
yarn lint                           # 代码检查
yarn eslint . --fix                # 自动修复可修复问题
yarn test --watchAll=false --passWithNoTests
yarn tsc --noEmit                  # TypeScript 配置与类型检查
```

## 当前代码质量状态

- `yarn lint` 无 error（可通过）
- 仍有少量 warning（主要是未使用变量和内联样式），不会阻塞构建

## 教学流程概览

1. 登录教师账号
2. 创建/编辑儿童档案
3. 选择教学主题与场景
4. 配置教学模块目标（构音/命名/语言结构/对话）
5. 生成并编辑教案草稿
6. 提交并在历史记录中回看

## 备注

本仓库面向内部教学研发使用，若需对外发布，请先补齐：

- 环境变量管理（避免硬编码地址）
- 隐私与合规说明
- 自动化测试与 CI
