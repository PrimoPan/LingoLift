import axios from 'axios';
import useStore from '../store/store';  // ✅ 引入 Zustand

const BASE_URL = 'http://43.138.212.17:2124/api';

// **自动获取 Token 并添加到请求头**
const api = axios.create({
    baseURL: BASE_URL,
});


api.interceptors.request.use(
    async (config) => {
        const token = useStore.getState().token;  // ✅ 获取 Zustand 里的 Token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// **登录 API**
export const loginTeacher = async (username, password) => {
    try {
        const response = await api.post('/login', { username, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || '登录失败';
    }
};

// **儿童信息增改 API**
export const changeChildrenInfo = async (childData) => {
    try {
        const token = useStore.getState().token;  // ✅ 获取 Token
        const response = await axios.post(`${BASE_URL}/ChangeChildrenInfo`, childData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "提交儿童信息失败";
    }
};

export const createLearning = async (Goals, childName) => {
    try {
        const token = useStore.getState().token;  // ✅ 获取 Zustand 里的 JWT Token
        if (!token) throw new Error("未登录，无法提交学习记录");
        console.log('debug:', Goals);
        console.log('Name:', childName);
        const response = await axios.post(
            `${BASE_URL}/CreateLearning`,
            { Goals, childName },
            { headers: { Authorization: `Bearer ${token}` } } // ✅ 发送 JWT Token
        );

        return response.data; // ✅ 返回服务器的学习历史数据
    } catch (error) {
        throw error.response?.data?.message || "提交学习记录失败";
    }
};

export const getChildrenList = async () => {
    try {
        const token = useStore.getState().token;  // ✅ 获取 JWT Token
        if (!token) throw new Error("未登录，无法获取儿童列表");

        const response = await axios.get(`${BASE_URL}/GetChildrenList`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "获取儿童列表失败";
    }
};


export const getChildDetails = async (childName) => {
    try {
        const token = useStore.getState().token;  // ✅ 从 Zustand 获取 Token
        if (!token) throw new Error("未登录，无法获取儿童信息");

        const response = await axios.get(`${BASE_URL}/GetChildDetails`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { name: childName }  // ✅ 传递儿童名称
        });

        return response.data; // ✅ 返回服务器的儿童信息
    } catch (error) {
        throw error.response?.data?.message || "获取儿童详情失败";
    }
};

export const getLearningHistoryForChild = async (childName) => {
    try {
        const token = useStore.getState().token;
        if (!token) throw new Error("未登录，无法获取学习历史");

        // 发送 GET 请求，带上 Authorization 头和查询参数 name=childName
        const response = await axios.get(`${BASE_URL}/GetLearningHistoryForChild`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { name: childName },
        });

        return response.data;  // { success, message, data: sortedHistory[] }
    } catch (error) {
        throw error.response?.data?.message || "获取学习历史失败";
    }
};