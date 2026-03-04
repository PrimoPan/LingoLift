import { create } from 'zustand';

type ModuleFlags = Record<string, boolean>;

type LearningGoalMap = Record<string, unknown>;

type ThemeCache = {
  randomThemes: unknown;
  interestThemes: unknown;
  freeThemeText: string;
  selectedBox: unknown;
  selectedMajor: string | null;
};

type SceneCache = Record<string, Record<string, unknown>>;

type CurrentChildren = Record<string, unknown> & {
  selectedInitials?: string[];
};

type StoreState = {
  username: string;
  token: string;
  setUsername: (username: string) => void;
  setToken: (token: string) => void;
  setUsernameAsync: (username: string) => Promise<void>;

  currentChildren: CurrentChildren;
  setCurrentChildren: (data: CurrentChildren) => void;

  learningGoals: LearningGoalMap | null;
  setLearningGoals: (goals: LearningGoalMap | null) => void;

  themeCache: ThemeCache;
  setThemeCache: (patch: Partial<ThemeCache>) => void;

  sceneCache: SceneCache;
  setSceneCache: (major: string, patch: Record<string, unknown>) => void;

  moduleFlags: ModuleFlags;
  setModuleFlag: (key: string, val: boolean) => void;

  updateDraft: (moduleKey: string, draftStr: string) => void;
  resetLesson: () => void;
};

const safeJsonEquals = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

const useStore = create<StoreState>((set, get) => ({
  username: '',
  token: '',
  setUsername: (username) => set({ username }),
  setToken: (token) => set({ token }),
  setUsernameAsync: async (username) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ username });
  },

  currentChildren: {},
  setCurrentChildren: (data) => {
    if (safeJsonEquals(get().currentChildren, data)) {
      return;
    }

    const pronunciationGoal = get().learningGoals?.构音;
    const selectedInitials =
      data.selectedInitials ??
      (typeof pronunciationGoal === 'string' ? pronunciationGoal.split(', ') : []);

    set({
      currentChildren: {
        ...data,
        selectedInitials,
      },
    });
  },

  learningGoals: null,
  setLearningGoals: (goals) => {
    if (safeJsonEquals(get().learningGoals, goals)) {
      return;
    }
    set({ learningGoals: goals });
  },

  themeCache: {
    randomThemes: null,
    interestThemes: null,
    freeThemeText: '',
    selectedBox: null,
    selectedMajor: null,
  },
  setThemeCache: (patch) =>
    set((state) => ({
      themeCache: { ...state.themeCache, ...patch },
    })),

  sceneCache: {},
  setSceneCache: (major, patch) =>
    set((state) => ({
      sceneCache: {
        ...state.sceneCache,
        [major]: { ...(state.sceneCache[major] || {}), ...patch },
      },
    })),

  moduleFlags: { 构音: true, 命名: false, 语言结构: false, 对话: false },
  setModuleFlag: (key, val) =>
    set((state) => ({
      moduleFlags: { ...state.moduleFlags, [key]: val },
    })),

  updateDraft: (moduleKey, draftStr) =>
    set((state) => ({
      learningGoals: {
        ...(state.learningGoals || {}),
        [moduleKey]: {
          ...(((state.learningGoals || {})[moduleKey] as Record<string, unknown>) || {}),
          Draft: draftStr,
        },
      },
    })),

  resetLesson: () =>
    set((state) => {
      const lg = state.learningGoals || {};

      const wiped: LearningGoalMap = {
        ...lg,
        主题场景: null,
        构音: null,
        命名: lg.命名
          ? { ...(lg.命名 as Record<string, unknown>), detail: null, Draft: null }
          : undefined,
        语言结构: lg.语言结构
          ? { ...(lg.语言结构 as Record<string, unknown>), detail: null, Draft: null }
          : undefined,
        对话: lg.对话
          ? { ...(lg.对话 as Record<string, unknown>), detail: null, Draft: null }
          : undefined,
      };

      return {
        learningGoals: wiped,
        sceneCache: {},
        themeCache: {
          ...state.themeCache,
          freeThemeText: '',
          selectedBox: null,
          selectedMajor: null,
        },
      };
    }),
}));

export default useStore;
