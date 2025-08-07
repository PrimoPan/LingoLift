import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 导入导航功能
import { gptQuery, generateImage } from '../utils/api'; // 导入 GPT 和图片生成 API
import useStore from '../store/store.jsx'; // 导入 zustand store

const GptLearning = () => {
    const navigation = useNavigation(); // 获取导航对象
    const [scenesData, setScenesData] = useState([]); // 场景和图片数据
    const [loading, setLoading] = useState(false); // 加载状态
    const [regenerateLoading, setRegenerateLoading] = useState([]); // 单独场景重新生成的加载状态
    const [selectedScene, setSelectedScene] = useState(null); // 选中的场景
    const learningGoals = useStore((state) => state.learningGoals); // 获取 store 中的 learningGoals
    const setLearningGoals = useStore((state) => state.setLearningGoals); // 更新 store 中的 learningGoals

    useEffect(() => {
        const fetchLearningContent = async () => {
            setLoading(true);
            try {
                const prompt = `基于以下环境要求生成三个场景：${learningGoals?.环境 || '默认环境'}`;
                const gptResponse = await gptQuery(prompt); // 调用 GPT API
                const scenes = JSON.parse(gptResponse)?.response || [];
                console.log('GPT Scenes:', scenes);

                // 为每个场景生成卡通风格图片
                const imagePromises = scenes.map((scene) =>
                    generateImage(`绝对不允许出现文字。卡通风格。重要：场景尽量人物较少，不允许超过2个人，且全部为中国人，场景尽量较空，绝对不允许出现文字。以下是场景描述${scene.描述}`).then((url) => ({ ...scene, imageUrl: url }))
                );
                const generatedScenes = await Promise.all(imagePromises);
                setScenesData(generatedScenes);

                Alert.alert('学习成功', 'GPT 已学习内容并生成反馈。');
            } catch (error) {
                console.error('学习失败:', error);
                Alert.alert('错误', error.message || '学习内容失败，请重试。');
            } finally {
                setLoading(false);
            }
        };

        fetchLearningContent();
    }, [learningGoals]); // 监听 learningGoals 的变化

    const handleRegenerate = async (index, description) => {
        setRegenerateLoading((prev) => {
            const newLoading = [...prev];
            newLoading[index] = true;
            return newLoading;
        });
        try {
            const newImageUrl = await generateImage(`${description}，卡通风格`);
            setScenesData((prev) =>
                prev.map((scene, i) => (i === index ? { ...scene, imageUrl: newImageUrl } : scene))
            );
        } catch (error) {
            console.error('重新生成失败:', error);
            Alert.alert('错误', '无法重新生成图片，请重试。');
        } finally {
            setRegenerateLoading((prev) => {
                const newLoading = [...prev];
                newLoading[index] = false;
                return newLoading;
            });
        }
    };

    const handleSubmit = () => {
        if (!selectedScene) {
            Alert.alert('错误', '请选择一个场景进行提交');
            return;
        }
        const updatedGoals = { ...learningGoals, 选中场景: selectedScene };
        setLearningGoals(updatedGoals);
        Alert.alert('提交成功', `选中的场景已更新到学习目标: ${JSON.stringify(updatedGoals, null, 2)}`);
        navigation.navigate('DisplayStoreData'); // 跳转到 DisplayStoreData 页面
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007BFF" />
                ) : (
                    scenesData.map((scene, index) => (
                        <View key={index} style={styles.card}>
                            <Image source={{ uri: scene.imageUrl }} style={styles.image} resizeMode="contain" />
                            <Text style={styles.sceneTitle}>{scene.场景}</Text>
                            <Text style={styles.sceneDescription}>{scene.描述}</Text>
                            <TouchableOpacity
                                style={[styles.regenerateButton, regenerateLoading[index] && styles.buttonDisabled]}
                                onPress={() => handleRegenerate(index, scene.描述)}
                                disabled={regenerateLoading[index]}
                            >
                                {regenerateLoading[index] ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>重新生成图片</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={
                                    selectedScene === scene
                                        ? [styles.selectButton, styles.selected]
                                        : styles.selectButton
                                }
                                onPress={() => setSelectedScene(scene)}
                            >
                                <Text style={styles.buttonText}>
                                    {selectedScene === scene ? '已选中' : '选择此场景'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>
            <TouchableOpacity
                style={[
                    styles.submitButton,
                    !selectedScene && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!selectedScene}
            >
                <Text style={styles.buttonText}>提交选中场景</Text>
            </TouchableOpacity>
        </View>
    );
};

export default GptLearning;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    card: {
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '90%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    sceneTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    sceneDescription: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginBottom: 12,
    },
    regenerateButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 6,
        marginBottom: 8,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    selectButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#28A745',
        borderRadius: 6,
    },
    selected: {
        backgroundColor: '#FFC107',
    },
    submitButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#DC3545',
        borderRadius: 6,
        alignItems: 'center',
        marginVertical: 16,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    feedbackText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});
