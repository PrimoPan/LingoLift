import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DIR = `${RNFetchBlob.fs.dirs.CacheDir}/reinforcement_images/`;

// 初始化创建目录
const initCacheDir = async () => {
    const exists = await RNFetchBlob.fs.isDir(CACHE_DIR);
    if (!exists) {
        await RNFetchBlob.fs.mkdir(CACHE_DIR);
    }
};

// 清理文件名的函数
const sanitizeFilename = (filename) => {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F%&]/g, '_');
};

// 生成文件名
const generateFilename = (url) => {
    const filename = url.split('/').pop().split('?')[0];
    const sanitizedFilename = sanitizeFilename(filename);
    // 确保以 .png 结尾
    if (!sanitizedFilename.endsWith('.png')) {
        return `${sanitizedFilename}.png`;
    }
    return sanitizedFilename;
};

export const cacheImage = async (url) => {
    try {
        await initCacheDir();

        const filename = generateFilename(url);
        const localPath = `${CACHE_DIR}${filename}`;

        // Step1: 尝试从AsyncStorage里拿到缓存记录
        const cachedUri = await AsyncStorage.getItem(url);
        if (cachedUri && (await RNFetchBlob.fs.exists(cachedUri.replace('file://','')))) {
            // 若已存过且文件存在，就直接返回
            return cachedUri;
        }

        // Step2: 下载并存到文件系统
        await RNFetchBlob.config({
            fileCache: true,
            path: localPath,
        }).fetch('GET', url);

        // 再次确认文件确实存在
        const fileExists = await RNFetchBlob.fs.exists(localPath);
        if (!fileExists) {
            throw new Error('File not downloaded correctly.');
        }

        // 加 file:// 前缀并存储到 AsyncStorage
        const finalUri = `file://${localPath}`;
        await AsyncStorage.setItem(url, finalUri);

        console.log('Cached image path:', finalUri);
        return finalUri;

    } catch (error) {
        console.error('Caching failed:', error);
        return url; // 如果下载/缓存失败，就回退用原 URL
    }
};
