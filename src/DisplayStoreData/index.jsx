import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Pressable,
} from 'react-native';
import useStore from '../store/store.jsx'; // 导入 zustand store
import { gptQuery, generateImage } from '../utils/api'; // 导入 GPT 和生图 API

const DisplayStoreData = () => {
    const currentChildren = useStore((state) => state.currentChildren); // 获取 store 中的 currentChildren
    const learningGoals = useStore((state) => state.learningGoals);     // 获取 store 中的 learningGoals

    const [generatedData, setGeneratedData] = useState(null);     // 保存生成的教学数据
    const [sceneImage, setSceneImage] = useState(null);           // 保存场景图
    const [elementImages, setElementImages] = useState([]);       // 保存小元素图
    const [loading, setLoading] = useState(false);                // 加载状态
    const [imageLoading, setImageLoading] = useState(false);      // 图片生成加载状态

    // 新增：选中小元素的下标集合
    const [selectedElements, setSelectedElements] = useState([]);

    // 点击小元素时，切换选中状态
    const toggleElementSelection = (index) => {
        setSelectedElements((prevSelected) => {
            if (prevSelected.includes(index)) {
                // 如果已选中，则取消选中
                return prevSelected.filter((i) => i !== index);
            } else {
                // 如果未选中，则添加到选中列表
                return [...prevSelected, index];
            }
        });
    };

    // 生成 GPT 文本
    const generateData = async () => {
        setLoading(true);
        try {
            const prompt = `请你给我的数据直接以{}包裹，不需要其他任何文字内容.每一次生成的内容与教学步骤不允许与上次一样.每一个步骤都必须详细，且包含三个递进步骤.每一个步骤不得少于50字. 注意一切生成内容要以选中场景与“环境”的描述为优先.1. 如果教学目标里有构音，请生成5个汉语词汇，包含用构音中的几个汉语拼音声母构成的词语，如果 Current Children中有强化物，请结合这些强化物做生成； 2. 根据选中场景中的描述，根据LearningGoals中的‘命名’、‘构音’、‘语言结构’（如果有就生成，如果没有就不生成），返回满足每个对应目标的，和场景结合的教学步骤（注意被教学儿童患有自闭症），每个目标返回A,B,C依次3个步骤。当前数据Current Children: ${JSON.stringify(currentChildren).replace(/"/g, "'")}, Learning Goals: ${JSON.stringify(learningGoals).replace(/"/g, "'")}`;
            const gptResponse = await gptQuery(prompt); // 调用 GPT API
            let results;
            try {
                results = JSON.parse(gptResponse);
            } catch (parseError) {
                console.error('Error parsing GPT response:', parseError);
                throw new Error('Invalid JSON format in GPT response.');
            }
            console.log('Generated Data from GPT:', results);
            setGeneratedData(results);
        } catch (error) {
            console.error('Error generating data from GPT:', error);
        } finally {
            setLoading(false);
        }
    };

    // 生成图片
    const generateImages = async () => {
        setImageLoading(true);
        try {
            // 生图 Prompt 示例，可根据实际需求进行细化或修改
            const scenePrompt = `生成一个简单的卡通风格场景图。绝对不允许出现文字！,场景尽量不要出现人物，如果有，不能超过2人，且全部为中国人，场景尽量较空，绝对不允许出现文字，基于教学目标：${JSON.stringify(
                learningGoals
            )}，仅展示环境。`;

            // 假设 GPT 返回的 5 个构音词汇是存放在 generatedData.words 中
            const elementPrompts =
                generatedData?.words?.map(
                    (word) => `接下来你生成的所有元素图都要保证，尽量简单，避免重复元素，避免复杂；生成一个卡通风格小元素图，基于：${word}。`
                ) || [];

            const sceneResponse = await generateImage(scenePrompt); // 调用生图 API 生成场景图
            const elementResponses = await Promise.all(
                elementPrompts.map((prompt) => generateImage(prompt))
            ); // 调用生图 API 生成小元素图
            setSceneImage(sceneResponse); // 设置场景图 URL
            setElementImages(elementResponses); // 设置小元素图 URL 数组
            setSelectedElements([]); // 重置选中状态
        } catch (error) {
            console.error('Error generating images:', error);
        } finally {
            setImageLoading(false);
        }
    };

    useEffect(() => {
        // 当 currentChildren 或 learningGoals 改变时，自动重新生成
        generateData();
    }, [currentChildren, learningGoals]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* ======== 文本生成结果展示 ======== */}
                {generatedData && (
                    <View style={styles.section}>
                        <Text style={styles.title}>生成的构音词汇</Text>
                        <Text style={styles.content}>
                            {generatedData.words?.join(', ') || '无构音数据'}
                        </Text>
                    </View>
                )}

                {generatedData?.['教学步骤'] &&
                    Object.entries(generatedData['教学步骤']).map(([key, steps]) => (
                        <View key={key} style={styles.section}>
                            <Text style={styles.title}>{key} 教学步骤</Text>
                            {Object.entries(steps).map(([stepKey, stepValue]) => (
                                <View key={stepKey} style={styles.stepContainer}>
                                    <Text style={styles.stepKey}>{stepKey}:</Text>
                                    <Text style={styles.stepValue}>{stepValue}</Text>
                                </View>
                            ))}
                        </View>
                    ))}

                {/* ======== 图片区域展示 ======== */}
                {imageLoading ? (
                    <ActivityIndicator size="large" color="#007BFF" />
                ) : (
                    <>
                        {/* 场景图 */}
                        <View style={styles.imageContainer}>
                            {sceneImage && (
                                <Image
                                    source={{ uri: sceneImage }}
                                    style={styles.sceneImage}
                                    resizeMode="contain" // 确保完整显示
                                />
                            )}
                        </View>
                        {/* 小元素图（依次排列，点击可选/不选） */}
                        {elementImages.length > 0 && (
                            <View style={styles.elementsWrapper}>
                                {elementImages.map((imgUri, index) => {
                                    const isSelected = selectedElements.includes(index);
                                    return (
                                        <Pressable
                                            key={index}
                                            onPress={() => toggleElementSelection(index)}
                                            style={[
                                                styles.elementImageWrapper,
                                                isSelected && styles.selectedBorder,
                                            ]}
                                        >
                                            <Image
                                                source={{ uri: imgUri }}
                                                style={styles.elementImage}
                                            />
                                        </Pressable>
                                    );
                                })}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* ======== 按钮区域 ======== */}
            <TouchableOpacity
                style={[styles.regenerateButton, loading && styles.disabledButton]}
                onPress={generateData}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? '重新生成中...' : '重新生成'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.generateImagesButton, imageLoading && styles.disabledButton]}
                onPress={generateImages}
                disabled={imageLoading}
            >
                <Text style={styles.buttonText}>
                    {imageLoading ? '生成图片中...' : '生成图片'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        alignItems: 'flex-start',
        paddingVertical: 16,
    },
    section: {
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    content: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    stepContainer: {
        marginBottom: 8,
        paddingLeft: 10,
    },
    stepKey: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    stepValue: {
        fontSize: 14,
        color: '#333',
    },
    imageContainer: {
        width: '100%',
        height: 300,
        marginTop: 20,
    },
    sceneImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        marginBottom: 16,
    },
    elementsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        justifyContent: 'center', // 确保元素居中
        alignItems: 'center', // 确保元素垂直居中
    },
    elementImageWrapper: {
        margin: 5,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
        width: 80, // 限制小元素图的宽度
        height: 80, // 限制小元素图的高度
    },
    elementImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    selectedBorder: {
        borderColor: '#007BFF',
    },
    regenerateButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
    },
    generateImagesButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#28A745',
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DisplayStoreData;
