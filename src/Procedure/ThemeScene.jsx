import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { generateImage, gptQuery } from '../utils/api';
import useStore from '../store/store';

const environmentData = require('../Knowledge/Environment.json');

const ThemeScene = ({ selectedMajor, onSelectScene }) => {
    /* ----- Zustand cache ----- */
    const { sceneCache, setSceneCache } = useStore();

    /* ----- 本地状态 (先尝试从 cache 还原) ----- */
    const cacheForMajor = sceneCache[selectedMajor] || {};
    const [availableScenes, setAvailableScenes] = useState(
        cacheForMajor.availableScenes || []
    );
    const [selectedScene, setSelectedScene] = useState(
        cacheForMajor.selectedScene || null
    );
    const [imageUrl, setImageUrl] = useState(cacheForMajor.imageUrl || null);

    const [sceneLoading, setSceneLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [customDescription, setCustomDescription] = useState('');

    /* ----- 解析 GPT 返回 ----- */
    const parseScenes = (resp) => {
        const match = resp.match(/\[.*?\]/);
        if (!match) throw new Error('格式异常');
        return JSON.parse(match[0].replace(/'/g, '"'));
    };

    /* ----- 拉取场景列表 ----- */
    const loadScenes = async () => {
        setSceneLoading(true);
        setSelectedScene(null);
        setImageUrl(null);

        try {
            let scenes = environmentData[selectedMajor] || [];

            if (scenes.length === 0) {
                const prompt = `作为自闭症教学专家，请生成三个与${selectedMajor}相关的教学场景，返回格式如['场景1','场景2','场景3']：`;
                const resp = await gptQuery(prompt);
                scenes = parseScenes(resp);
            }

            setAvailableScenes(scenes);
            // 写 cache
            setSceneCache(selectedMajor, { availableScenes: scenes });
        } catch (e) {
            Alert.alert('错误', e.message);
        } finally {
            setSceneLoading(false);
        }
    };

    /* ----- major 变化：1) 有 cache 则直接用 2) 否则重新加载 ----- */
    useEffect(() => {
        if (!selectedMajor) return;
        if (!sceneCache[selectedMajor]) {
            loadScenes();
        } else {
            // 已缓存但可能是上一位学生修改过 -> 同步给父组件
            if (sceneCache[selectedMajor].imageUrl) {
                onSelectScene(
                    sceneCache[selectedMajor].selectedScene,
                    sceneCache[selectedMajor].imageUrl
                );
            }
        }
    }, [selectedMajor]);

    /* ----- 选择场景并生成图片 ----- */
    const handleSelectScene = async (scene) => {
        setImageLoading(true);
        setSelectedScene(scene);
        setImageUrl(null);

        try {
            const desc = `自闭症教学背景图，主题：${selectedMajor}，场景：${scene}，简洁风格，留白区域`;
            const img = await generateImage(desc);

            setImageUrl(img);
            onSelectScene(scene, img);
            setSceneCache(selectedMajor, {
                selectedScene: scene,
                imageUrl: img,
            });
        } catch (e) {
            Alert.alert('错误', e.message);
        } finally {
            setImageLoading(false);
        }
    };

    /* ----- 自定义描述重新生成 ----- */
    const handleRegenerate = async () => {
        if (!customDescription.trim()) return;
        setImageLoading(true);
        setSelectedScene(customDescription);
        setImageUrl(null);

        try {
            const img = await generateImage(customDescription);
            setImageUrl(img);
            onSelectScene(customDescription, img);
            setSceneCache(selectedMajor, {
                selectedScene: customDescription,
                imageUrl: img,
            });
        } catch (e) {
            Alert.alert('错误', e.message);
        } finally {
            setImageLoading(false);
        }
    };

    /* ----- 场景按钮渲染 ----- */
    const sceneButtons = () => {
        if (sceneLoading)
            return <ActivityIndicator size="small" color="#39B8FF" />;
        return availableScenes.map((sc) => (
            <TouchableOpacity
                key={sc}
                style={[styles.btn, selectedScene === sc && styles.btnSel]}
                onPress={() => handleSelectScene(sc)}
                disabled={imageLoading}
            >
                <Text style={styles.btnTxt}>{`场景：${sc}`}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            {/* -------- 左列 -------- */}
            <View style={styles.left}>
                <Text style={styles.title}>选择场景</Text>
                {sceneButtons()}

                <TextInput
                    style={styles.input}
                    placeholder="输入自定义场景描述"
                    value={customDescription}
                    onChangeText={setCustomDescription}
                />
                <Button
                    title="重新生成图片"
                    onPress={handleRegenerate}
                    disabled={!customDescription.trim() || imageLoading}
                />
            </View>

            {/* -------- 右列 -------- */}
            <View style={styles.right}>
                <Text style={styles.modTxt}>当前主题: {selectedMajor}</Text>
                {imageLoading ? (
                    <ActivityIndicator size="large" color="#39B8FF" />
                ) : imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text style={styles.noImg}>请选择一个场景</Text>
                )}
            </View>
        </View>
    );
};

/* ----- 禁止“下一步” 的辅助：父组件 Procedure 已校验 backgroundUrl 是否存在；当 imageLoading==true 时 onSelectScene 尚未执行，因此仍满足“禁止下一步” 提示：‘请等待 AI 生成教学背景图片’ ----- */

/* ----- Styles ----- */
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '33%',
        left: '5%',
        width: '90%',
        height: '55%',
        flexDirection: 'row',
    },
    left: { flex: 1, paddingRight: 12 },
    right: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    btn: {
        width: '100%',
        paddingVertical: 10,
        marginBottom: 12,
        backgroundColor: '#D4E9FF',
        borderRadius: 15,
        alignItems: 'center',
    },
    btnSel: { backgroundColor: '#39B8FF' },
    btnTxt: { fontSize: 16, color: '#1C5B83' },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    modTxt: { fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
    image: { width: '60%', aspectRatio: 1, borderRadius: 10 },
    noImg: { fontSize: 16, color: '#888' },
});

export default ThemeScene;
