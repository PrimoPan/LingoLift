import { create } from 'zustand';

const useStore = create((set, get) => ({
    /* ========== 账户 & Token ========== */
    username: '',
    token: '',
    setUsername: (username) => set({ username }),
    setToken:    (token)    => set({ token }),
    setUsernameAsync: async (username) => {
        await new Promise(res => setTimeout(res, 1000));
        set({ username });
    },

    /* ========== 儿童信息 ========== */
    currentChildren: {},
    setCurrentChildren: (data) => {
        if (JSON.stringify(get().currentChildren) === JSON.stringify(data)) return;
           set({
                 currentChildren: {
                  ...data,
                       selectedInitials: data.selectedInitials ?? (
                         typeof get().learningGoals?.构音 === 'string'
                           ? get().learningGoals.构音.split(', ')
                               : []
                           ),
                     },
           });
    },

    /* ========== 学习目标（主数据） ========== */
    learningGoals: null,
    setLearningGoals: (goals) => {
        if (JSON.stringify(get().learningGoals) === JSON.stringify(goals)) return;
        set({ learningGoals: goals });
    },

    /* ========== 主题选择页缓存 ========== */
    themeCache: {
        randomThemes:   null,
        interestThemes: null,
        freeThemeText:  '',
        selectedBox:    null,
        selectedMajor:  null,
    },
    setThemeCache: (patch) =>
        set((state) => ({
            themeCache: { ...state.themeCache, ...patch },
        })),

    /* ========== 场景页缓存 ========== */
    sceneCache: {},                                   // { major: { availableScenes, selectedScene, imageUrl } }
    setSceneCache: (major, patch) =>
        set((state) => ({
            sceneCache: {
                ...state.sceneCache,
                [major]: { ...(state.sceneCache[major] || {}), ...patch },
            },
        })),

    /* ========== 模块勾选标志 ========== */
    moduleFlags: { 构音: true, 命名: false, 语言结构: false, 对话: false },
    setModuleFlag: (key, val) =>
        set((state) => ({
            moduleFlags: { ...state.moduleFlags, [key]: val },
        })),

    /* ========== 通用工具：写各模块 Draft ========== */
    updateDraft: (moduleKey, draftStr) =>
        set((state) => ({
            learningGoals: {
                ...state.learningGoals,
                [moduleKey]: {
                    ...(state.learningGoals?.[moduleKey] || {}),
                    Draft: draftStr,
                },
            },
        })),

    /* ========== 流程重置（换主题时调用） ========== */
    resetLesson: () =>
        set((state) => {
            const lg = state.learningGoals || {};

            // 仅清内容，保留键结构，避免导航标签消失
            const wiped = {
                ...lg,
                主题场景: null,
                构音: null,
                命名:       lg.命名       ? { ...lg.命名,       detail: null, Draft: null } : undefined,
                语言结构:   lg.语言结构   ? { ...lg.语言结构,   detail: null, Draft: null } : undefined,
                对话:       lg.对话       ? { ...lg.对话,       detail: null, Draft: null } : undefined,
            };

            return {
                learningGoals: wiped,
                sceneCache: {},
                themeCache: {
                    freeThemeText:  '',
                    selectedBox:    null,
                    selectedMajor:  null,
                },
                /* moduleFlags 不清空 —— 标签仍按老师勾选保留 */
            };
        }),
}));

export default useStore;
