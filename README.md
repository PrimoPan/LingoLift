# LingoLift

![LingoLift Opening](./assets/BG/Opening/Opening.png)

## English

LingoLift is an AI-assisted personalized education system for children with autism, developed by [HKUST(GZ) ARK Lab](https://arkxlab.github.io/).

### Video Preview

[![LingoLift Demo Preview](https://i0.hdslb.com/bfs/archive/98b6a6eac2594f68ebc63c022fdf7aee4dc16a00.jpg)](https://www.bilibili.com/video/BV1wUAezbErn/?spm_id_from=333.1387.homepage.video_card.click&vd_source=5ad1e219bd2b397ac4f69e99fc5f5361)

Watch the demo on Bilibili: [LingoLift Video](https://www.bilibili.com/video/BV1wUAezbErn/?spm_id_from=333.1387.homepage.video_card.click&vd_source=5ad1e219bd2b397ac4f69e99fc5f5361)

### Highlights

- Personalized lesson planning from child profiles
- LLM-based teaching draft generation
- Scene and material image generation for instruction
- End-to-end flow: profile -> goals -> draft -> classroom execution

### Recognition & Support

- Sponsored by **Tencent Light Program**
- Selected as a **CCF 2025 Annual Public Welfare Project Case**
- Paper accepted by **CHI'26**: [https://doi.org/10.1145/3772318.3790284](https://doi.org/10.1145/3772318.3790284)
- Light up a hope for ASD children. For sponsorship, contact: **dpan750@connect.hkust-gz.edu.cn**

### Tech Stack

- React Native 0.76
- Expo SDK 52
- Zustand
- gRPC communication layer (frontend target architecture)
- AES-256 data protection strategy for backend-bound sensitive payloads
- ESLint / Jest / TypeScript

### Frontend Architecture

The navigation stack is defined in `App.tsx`.

| Route Name | Screen / Component | Primary Purpose |
| --- | --- | --- |
| `Opening` | `src/Opening/Opening` | Opening splash and timed transition to login |
| `Login` | `src/Login/Login` | Teacher login and token bootstrap |
| `ChildrenList` | `src/ChildrenList` | Child list, child selection, and entry to profile create/edit |
| `CreateChildren` | `src/Createchildren/index.tsx` | Create or update child profile data |
| `ChildProfileScreen` | `components/childProfile/ChildProfileScreen.tsx` | Child profile dashboard (personal info, reinforcements, milestones) |
| `ChildHistory` | `src/ChildHistory` | Load and inspect historical lesson records |
| `LearningMode` | `src/LearningMode/LearningMode.js` | Legacy learning-goal setup flow |
| `EnvironmentChoose` | `src/EnvironmentChoose` | Legacy environment selection flow |
| `HorizontalLayout` | `src/Procedure/index.tsx` | Main lesson authoring flow (theme -> scene -> modules) |
| `Draft` | `src/Draft/index.tsx` | Draft authoring/review and lesson record submission |
| `GptLearning` | `src/GptLearning` | AI-assisted scene proposal and image generation |
| `DisplayStoreData` | `src/DisplayStoreData` | AI-generated teaching steps + material image generation |
| `LearningThemeScreen` | `components/LearningTheme/LearningThemeScreen.tsx` | Alternative learning theme UI entry |
| `GptTest` | `src/components/GptTest` | GPT/image integration test screen |
| `ImageGenerator` | `src/components/ImageGenerator` | Standalone image generation test screen |

### Component Responsibilities

#### Profile lifecycle

- `Login`: teacher authentication.
- `ChildrenList`: list children and open selected child details.
- `CreateChildren`: create/update child profile payload.
- `ChildProfileScreen`: profile dashboard composed of:
- `PersonalInfo`: identity and quick navigation (edit/history).
- `Preferences`: reinforcement-image generation and profile sync.
- `LanguageMilestones`: milestone visualization.
- `ChildHistory`: history selection and playback into `Draft` review mode.

#### Lesson authoring lifecycle

- `ModelSelect`: select learning modules.
- `HorizontalLayout` (`Procedure`): route entry for the main authoring flow.
- `Procedure` (`ThemeSelectionStep` -> `ThemeSceneStep` -> `PronunciationStep` -> `NamingGoalPlanner` -> `LanguageGoalPlanner` -> `DialogueGoalPlanner`): end-to-end lesson goal assembly.
- `Draft` (`Pronun` / `Naming` / `Ls` / `Dia`): finalize text drafts and submit lesson records.

#### AI-assisted material lifecycle

- `GptLearning`: generate candidate scenes and background images.
- `DisplayStoreData`: generate structured teaching steps and visual materials.
- `GptTest`: sandbox for GPT + image flow.
- `ImageGenerator`: standalone image generation test entry.

#### Supporting routes and utility flow

- `Opening`: splash entry and timed redirect to authentication.
- `LearningMode`: legacy module/level selection path that writes learning-goal state.
- `EnvironmentChoose`: legacy environment selection before AI scene generation.
- `LearningThemeScreen`: alternative learning theme UI route kept for compatibility.

### Backend Communication Map

Communication wrappers:

- Business data RPC wrapper: `src/services/api.ts`
- AI RPC wrapper: `src/utils/api.ts`

| Function | Called by component(s) | Purpose | Main payload fields | Expected response shape |
| --- | --- | --- | --- | --- |
| `loginTeacher(username, password)` | `src/Login/Login.tsx` | Authenticate teacher and obtain session token | `username`, `password` | `{ success, token }` |
| `changeChildrenInfo(childData)` | `src/Createchildren/index.tsx`, `components/childProfile/Preferences.tsx` | Create/update child profile and reinforcement data | `childData` (name/age/gender/courseDuration/reinforcements/module levels/image/style, etc.) | `{ success, message, data: children[] }` |
| `createLearning(Goals, childName)` | `src/Draft/index.tsx` | Save finalized lesson content into child learning history | `Goals`, `childName` | `{ success, message, data: learningHistory[] }` |
| `getChildrenList()` | `src/ChildrenList/index.tsx` | Fetch all children under current teacher account | Authorization/session context | `{ success, message, data: children[] }` |
| `getChildDetails(childName)` | `src/ChildrenList/index.tsx` | Fetch selected child profile details | `name` (or child identifier) | `{ success, message, data: child }` |
| `getLearningHistoryForChild(childName)` | `src/ChildHistory/index.tsx` | Fetch sorted learning history for selected child | `name` (or child identifier) | `{ success, message, data: sortedHistory[] }` |
| `gptQuery(rawQuestion)` | `src/Procedure/ThemeSelectionStep.tsx`, `src/Procedure/ThemeSceneStep.tsx`, `src/Procedure/PronunciationStep.tsx`, `src/Draft/Naming.tsx`, `src/Draft/Ls.tsx`, `src/Draft/Dia.tsx`, `src/Draft/Pronun.tsx`, `src/GptLearning/index.tsx`, `src/DisplayStoreData/index.tsx`, `src/components/GptTest/index.tsx` | Text-generation requests for planning/drafting/scene suggestions | Prompt payload (migration target: encrypted prompt payload) | text or structured JSON string |
| `generateImage(description)` | `components/childProfile/Preferences.tsx`, `src/Procedure/ThemeSceneStep.tsx`, `src/Procedure/PronunciationStep.tsx`, `src/GptLearning/index.tsx`, `src/DisplayStoreData/index.tsx`, `src/components/GptTest/index.tsx`, `src/components/ImageGenerator/index.tsx` | Generate teaching images from prompts | image description payload (migration target: encrypted prompt payload) | image URL string |

### Security & Privacy for ASD Data

- Network stack documentation is standardized to `gRPC`.
- ASD child-related payloads and prompt content are documented under an `AES-256` protection strategy for backend-bound requests.
- Prompt plaintext exposure in client code is treated as restricted and should be removed in migration.
- Runtime environment variables for encrypted RPC:
- `EXPO_PUBLIC_GRPC_BASE_URL` / `GRPC_BASE_URL`
- `EXPO_PUBLIC_GRPC_GATEWAY_PATH` / `GRPC_GATEWAY_PATH`
- `API_AES_KEY_B64` / `EXPO_PUBLIC_API_AES_KEY_B64`
- `PROMPT_AES_KEY_B64` / `EXPO_PUBLIC_PROMPT_AES_KEY_B64`
- The backend architecture involves special-education school teaching materials and privacy-sensitive information. For research or collaboration interest, contact: **dpan750@connect.hkust-gz.edu.cn**.

### Data Flow by User Journey

| Step | Screen / User Action | RPC / Function |
| --- | --- | --- |
| 1 | Teacher signs in on `Login` | `loginTeacher` |
| 2 | View child list on `ChildrenList` | `getChildrenList` |
| 3 | Open one child profile from `ChildrenList` | `getChildDetails` |
| 4 | Create/update child profile on `CreateChildren` | `changeChildrenInfo` |
| 5 | Auto-generate reinforcement images in `Preferences` | `generateImage` + `changeChildrenInfo` |
| 6 | Build lesson goals and scene/materials in `Procedure` | `gptQuery` + `generateImage` |
| 7 | Draft teaching content in `Draft` module pages | `gptQuery` |
| 8 | Save finalized lesson plan on `Draft` | `createLearning` |
| 9 | Review history on `ChildHistory` | `getLearningHistoryForChild` |

### Quick Start

```bash
yarn install
yarn start
```

If `android/` and `ios/` folders are available:

```bash
yarn android
yarn ios
```

If native folders are not present, use Expo directly:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

---

## 中文

LingoLift 是一套面向孤独症儿童的 AI 个别化教育系统，由 [香港科技大学（广州）ARK Lab](https://arkxlab.github.io/) 开发。

### 视频预览

[![LingoLift 视频预览](https://i0.hdslb.com/bfs/archive/98b6a6eac2594f68ebc63c022fdf7aee4dc16a00.jpg)](https://www.bilibili.com/video/BV1wUAezbErn/?spm_id_from=333.1387.homepage.video_card.click&vd_source=5ad1e219bd2b397ac4f69e99fc5f5361)

点击观看 Bilibili 演示视频：[LingoLift 演示视频](https://www.bilibili.com/video/BV1wUAezbErn/?spm_id_from=333.1387.homepage.video_card.click&vd_source=5ad1e219bd2b397ac4f69e99fc5f5361)

### 项目亮点

- 基于儿童档案生成个别化教学目标
- 基于大语言模型自动生成教案草稿
- 结合教学场景生成课堂图片素材
- 覆盖“档案 -> 目标 -> 草稿 -> 教学执行”的完整流程

### 资助与成果

- 项目获得 **腾讯 Light 计划** 资助
- 项目入选 **CCF 2025 年度公益项目案例**
- 项目论文被 **CHI'26** 收录：
  [https://doi.org/10.1145/3772318.3790284](https://doi.org/10.1145/3772318.3790284)
- 为 ASD 儿童点亮一盏光，赞助请联系：**dpan750@connect.hkust-gz.edu.cn**

### 技术栈

- React Native 0.76
- Expo SDK 52
- Zustand 状态管理
- gRPC 通信层（前端目标架构）
- 面向后端敏感数据的 AES-256 加密保护策略
- ESLint / Jest / TypeScript 工程质量体系

### 前端架构

导航栈定义在 `App.tsx` 中。

| 路由名 | 页面 / 组件 | 主要职责 |
| --- | --- | --- |
| `Opening` | `src/Opening/Opening` | 启动画面与登录跳转 |
| `Login` | `src/Login/Login` | 教师登录与令牌初始化 |
| `ChildrenList` | `src/ChildrenList` | 儿童列表展示、选中儿童、进入编辑 |
| `CreateChildren` | `src/Createchildren/index.tsx` | 创建或更新儿童档案 |
| `ChildProfileScreen` | `components/childProfile/ChildProfileScreen.tsx` | 儿童画像总览（档案、强化物、里程碑） |
| `ChildHistory` | `src/ChildHistory` | 加载并查看历史课程记录 |
| `LearningMode` | `src/LearningMode/LearningMode.js` | 旧版学习目标配置流程 |
| `EnvironmentChoose` | `src/EnvironmentChoose` | 旧版环境选择流程 |
| `HorizontalLayout` | `src/Procedure/index.tsx` | 主备课流程（主题 -> 场景 -> 模块） |
| `Draft` | `src/Draft/index.tsx` | 教案草稿编辑/查看与学习记录提交 |
| `GptLearning` | `src/GptLearning` | AI 场景建议与背景图生成 |
| `DisplayStoreData` | `src/DisplayStoreData` | 生成教学步骤与素材图 |
| `LearningThemeScreen` | `components/LearningTheme/LearningThemeScreen.tsx` | 备选学习主题页面入口 |
| `GptTest` | `src/components/GptTest` | GPT 与生图联调测试页 |
| `ImageGenerator` | `src/components/ImageGenerator` | 独立生图测试页 |

### 组件职责

#### 档案生命周期

- `Login`：教师身份认证。
- `ChildrenList`：儿童列表查询与儿童选择。
- `CreateChildren`：儿童档案创建与更新。
- `ChildProfileScreen`：档案总览页面，包含：
- `PersonalInfo`：个人信息展示与跳转编辑/历史。
- `Preferences`：强化物图片生成与档案回写。
- `LanguageMilestones`：语言里程碑可视化。
- `ChildHistory`：历史记录选择并回放到 `Draft` 查看模式。

#### 备课生命周期

- `ModelSelect`：选择本次教学模块。
- `HorizontalLayout`（`Procedure`）：主备课流程的路由入口。
- `Procedure`（`ThemeSelectionStep` -> `ThemeSceneStep` -> `PronunciationStep` -> `NamingGoalPlanner` -> `LanguageGoalPlanner` -> `DialogueGoalPlanner`）：完成备课目标构建。
- `Draft`（`Pronun` / `Naming` / `Ls` / `Dia`）：生成与完善模块草稿，提交课堂记录。

#### AI 教材生成生命周期

- `GptLearning`：生成候选场景与背景图。
- `DisplayStoreData`：生成结构化教学步骤和素材图。
- `GptTest`：GPT + 生图沙箱页。
- `ImageGenerator`：独立生图调试入口。

#### 补充路由与辅助流程

- `Opening`：启动入口与定时跳转认证页。
- `LearningMode`：旧版模块/等级选择路径，并写入学习目标状态。
- `EnvironmentChoose`：旧版环境选择页面，进入 AI 场景生成前置步骤。
- `LearningThemeScreen`：兼容保留的备选学习主题页面路由。

### 后端通信映射

通信封装入口：

- 业务数据接口：`src/services/api.ts`
- AI 接口：`src/utils/api.ts`

| 函数 | 调用组件 | 用途 | 主要请求字段 | 期望返回结构 |
| --- | --- | --- | --- | --- |
| `loginTeacher(username, password)` | `src/Login/Login.tsx` | 教师登录并获取会话令牌 | `username`, `password` | `{ success, token }` |
| `changeChildrenInfo(childData)` | `src/Createchildren/index.tsx`, `components/childProfile/Preferences.tsx` | 创建/更新儿童档案和强化物数据 | `childData`（姓名/年龄/性别/课程周期/强化物/模块等级/图片/风格等） | `{ success, message, data: children[] }` |
| `createLearning(Goals, childName)` | `src/Draft/index.tsx` | 保存最终教案到儿童学习历史 | `Goals`, `childName` | `{ success, message, data: learningHistory[] }` |
| `getChildrenList()` | `src/ChildrenList/index.tsx` | 查询当前教师名下儿童列表 | 授权上下文 | `{ success, message, data: children[] }` |
| `getChildDetails(childName)` | `src/ChildrenList/index.tsx` | 查询指定儿童详细档案 | `name`（或儿童标识） | `{ success, message, data: child }` |
| `getLearningHistoryForChild(childName)` | `src/ChildHistory/index.tsx` | 查询并返回时间倒序历史记录 | `name`（或儿童标识） | `{ success, message, data: sortedHistory[] }` |
| `gptQuery(rawQuestion)` | `src/Procedure/ThemeSelectionStep.tsx`, `src/Procedure/ThemeSceneStep.tsx`, `src/Procedure/PronunciationStep.tsx`, `src/Draft/Naming.tsx`, `src/Draft/Ls.tsx`, `src/Draft/Dia.tsx`, `src/Draft/Pronun.tsx`, `src/GptLearning/index.tsx`, `src/DisplayStoreData/index.tsx`, `src/components/GptTest/index.tsx` | 文本生成（场景、目标、草稿、步骤） | prompt 内容（迁移目标：加密 prompt 载荷） | 文本或 JSON 字符串 |
| `generateImage(description)` | `components/childProfile/Preferences.tsx`, `src/Procedure/ThemeSceneStep.tsx`, `src/Procedure/PronunciationStep.tsx`, `src/GptLearning/index.tsx`, `src/DisplayStoreData/index.tsx`, `src/components/GptTest/index.tsx`, `src/components/ImageGenerator/index.tsx` | 根据描述生成教学图片 | 图片描述（迁移目标：加密 prompt 载荷） | 图片 URL 字符串 |

### ASD 儿童信息安全与隐私

- 网络通信文档统一使用 `gRPC` 术语。
- 涉及 ASD 儿童信息和提示词内容的后端请求，按 `AES-256` 保护策略记录。
- 客户端中提示词明文暴露被视为受限项，迁移时应清理为非明文形式。
- 加密 RPC 运行时环境变量：
- `EXPO_PUBLIC_GRPC_BASE_URL` / `GRPC_BASE_URL`
- `EXPO_PUBLIC_GRPC_GATEWAY_PATH` / `GRPC_GATEWAY_PATH`
- `API_AES_KEY_B64` / `EXPO_PUBLIC_API_AES_KEY_B64`
- `PROMPT_AES_KEY_B64` / `EXPO_PUBLIC_PROMPT_AES_KEY_B64`
- 后端架构涉及特殊教育学校教学材料与隐私敏感信息；如有研究或合作兴趣，请联系：**dpan750@connect.hkust-gz.edu.cn**。

### 典型流程数据流

| 步骤 | 页面 / 用户动作 | RPC / 函数 |
| --- | --- | --- |
| 1 | 教师在 `Login` 登录 | `loginTeacher` |
| 2 | 在 `ChildrenList` 查看儿童列表 | `getChildrenList` |
| 3 | 从 `ChildrenList` 打开某位儿童详情 | `getChildDetails` |
| 4 | 在 `CreateChildren` 创建/更新档案 | `changeChildrenInfo` |
| 5 | 在 `Preferences` 自动生成强化物图片并回写 | `generateImage` + `changeChildrenInfo` |
| 6 | 在 `Procedure` 进行备课目标和场景素材生成 | `gptQuery` + `generateImage` |
| 7 | 在 `Draft` 各模块生成教学草稿 | `gptQuery` |
| 8 | 在 `Draft` 提交最终教学记录 | `createLearning` |
| 9 | 在 `ChildHistory` 查看历史课程 | `getLearningHistoryForChild` |

### 快速启动

```bash
yarn install
yarn start
```

若仓库中存在 `android/` 与 `ios/` 原生目录：

```bash
yarn android
yarn ios
```

若当前分支没有原生目录，可直接使用 Expo：

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```
