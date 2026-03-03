# LingoLift

![LingoLift Opening](./assets/BG/Opening/Opening.png)

## English

LingoLift is an AI-assisted personalized education system for children with autism, developed by [HKUST(GZ) ARK Lab](https://arkxlab.github.io/).

### Highlights

- Personalized lesson planning from child profiles
- LLM-based teaching draft generation
- Scene and material image generation for instruction
- End-to-end flow: profile -> goals -> draft -> classroom execution

### Recognition & Support

- Sponsored by **Tencent Light Program**
- Selected as a **CCF 2025 Annual Public Welfare Project Case**
- Paper accepted by **CHI'26**: [https://doi.org/10.1145/3772318.3790284](https://doi.org/10.1145/3772318.3790284)

### Tech Stack

- React Native 0.76
- Expo SDK 52
- Zustand
- Axios
- ESLint / Jest / TypeScript

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

### 技术栈

- React Native 0.76
- Expo SDK 52
- Zustand 状态管理
- Axios 网络请求
- ESLint / Jest / TypeScript 工程质量体系

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
