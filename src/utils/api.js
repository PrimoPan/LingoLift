// utils/api.js

import axios from 'axios'
import useStore from '../store/store' // 根据项目实际路径调整

// 配置 API 基础 URL
const BASE_URL = 'http://47.242.78.104:6088'

/**
 * GPT 问答接口
 * @param {string} rawQuestion - 用户的问题（包含回车也会被正确处理）
 * @returns {Promise<string>} - 返回 GPT 的回答
 */
export const gptQuery = async (rawQuestion) => {
    // 1. 去除首尾空格，并把所有实际换行符替换成 "\n" 字面量
    const question = rawQuestion
           .replace(/\s+/g, ' ')      // 把 \r\n \n \t 以及多余空格全部变成单空格
        .trim()                    // 去首尾空格
        .replace(/\n/g, '\\n');    // 若还有 \n，转义成字面量
    if (!question) {
        throw new Error('问题不能为空')
    }

    try {
        console.log('gptQuery prompt:', question)
        const response = await axios.post(
            `${BASE_URL}/i/gpt`,
            {
                uid: 'abcd', // 后端需要的用户标识
                qus: question,
                newtalk: 1,
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        const { data } = response.data
        if (!data) {
            throw new Error('接口未返回回答')
        }
        return data
    } catch (err) {
        console.error('gptQuery 错误:', err)
        throw new Error(err.response?.data?.message || '请求 GPT 失败')
    }
}

/**
 * 图像生成接口
 * @param {string} description - 图片描述
 * @returns {Promise<string>} - 返回生成的图片 URL
 */
export const generateImage = async (description) => {
    const desc = description.trim()
    if (!desc) {
        throw new Error('图片描述不能为空')
    }

    // 读取全局 store 中当前儿童的 imageStyle
    const { currentChildren } = useStore.getState()
    const imageStyle = currentChildren.imageStyle  // 可能是 "cartoon" 或 "realistic"

    // 接口要求的 style 值：默认 "ertonghuiben"，写实时 "xieshi"
    const style = imageStyle === 'realistic' ? 'xieshi' : 'ertonghuiben'
    console.log('使用的生图 style:', style)

    // 根据 style 决定前缀
    let prefix = ''
    if (imageStyle === 'cartoon') {
        prefix = '卡通风格！'
    } else if (imageStyle === 'realistic') {
        prefix = '风格为摄影风格'
    }

    const finalPrompt = `${prefix}${desc}`
    console.log('generateImage prompt:', finalPrompt)

    try {
        console.log('style', style);
        const response = await axios.post(
            `${BASE_URL}/i/pic_hy`,
            {
                uid: 'a81s',       // 后端提供的用户标识
                picreq: finalPrompt,
                style: style,            // 新增 style 字段
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        )
        if (response.data.code !== 0 || !response.data.imgurl) {
            throw new Error('接口未返回有效的图片 URL')
        }
        return response.data.imgurl
    } catch (err) {
        console.error('generateImage 错误:', err)
        throw new Error(err.response?.data?.message || '生成图片失败')
    }
}
