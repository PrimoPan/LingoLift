const { getDefaultConfig } = require('@react-native/metro-config');
module.exports = (async () => {
    const config = await getDefaultConfig(__dirname);
    return {
        ...config,
        /** 关键：禁用 Watchman（顶层字段）*/
        useWatchman: false,
    };
})();
