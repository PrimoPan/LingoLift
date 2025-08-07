import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import useStore from "../store/store.jsx";
import { gptQuery } from "../utils/api";
import Naming from "./Naming";

const Pronun = ({viewMode}) => {
    // 从 store 中获取数据和更新方法
    const {
        currentChildren: { name },
        learningGoals,
        setLearningGoals  // 假设这是你在 store 中定义的更新 learningGoals 的方法
    } = useStore();
    const isFinal = viewMode === "final";
    const [loading, setLoading] = useState(false);
    const [planContent, setPlanContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editableContent, setEditableContent] = useState('');

    // 如果 store 里已经有 Draft 的值，就让它成为初始显示内容
    useEffect(() => {
        if (learningGoals?.构音?.Draft) {
            setPlanContent(learningGoals.构音.Draft);
            setEditableContent(learningGoals.构音.Draft);
        }
    }, [learningGoals]);

    // 仅调试用：查看 name/learningGoals
    useEffect(() => {
        console.log("Goals", learningGoals);
        console.log(isFinal);
        console.log(viewMode);
    }, [name, learningGoals]);

    // 拼接卡片素材字符串
    const cardsContent = learningGoals?.构音?.cards
        ?.map(card => card.word)
        ?.join(', ');

    // 点击按钮请求 GPT，获取教学计划
    const fetchTeachingPlan = async () => {
        const prompt =`这是构音阶段的教学内容生成模块：请你给出完整的教学计划，保证是一段可以直接包裹在包裹在我写的Text组件内的React Native的字符串，使用反斜杠n来换行。不要在返回内容里出现Text、jsx等无关内容（因为返回内容是一段字符串，会被直接包裹在text中）。大概300汉字字左右，用词尽量专业。你是一个中国孤独症教育专家，现在要对孤独症儿童进行某一个拼音辅音的教学。你的教学场景是：${learningGoals?.主题场景?.major} - ${learningGoals?.主题场景?.activity}，你教学的目标是：${learningGoals?.构音?.teachingGoal}，你需要教学的词语有：${cardsContent}，请你生成一个具体的教学步骤，能将这些词语和场景进行串联，给出大概150字的教学计划，直接给出内容，不需要其他任何多余回答！`;

        setLoading(true);
        try {
            const result = await gptQuery(prompt);
            setPlanContent(result);
            setEditableContent(result);
            const updatedGoals = {
                     ...learningGoals,
                     构音: {
                       ...learningGoals?.构音,
                           Draft: result,        // 只更新 Draft，不动其他字段
                         },
               };
            setLearningGoals(updatedGoals);
        } catch (error) {
            console.error('Error fetching teaching plan:', error);
        } finally {
            setLoading(false);
        }
    };

    // “编辑/完成” 按钮逻辑
    const handleEditButtonPress = () => {
        if (editing) {
            // 如果从“编辑”切换到“完成”，需要把编辑内容同步到 learningGoals
            setPlanContent(editableContent);
            const updatedGoals = {
                ...learningGoals,
                构音: {
                    ...learningGoals?.构音,
                    Draft: editableContent, // 将编辑后的内容存到 Draft
                    },
            };
            setLearningGoals(updatedGoals);
        }
        setEditing(!editing);
    };

    return (
        <View style={styles.container}>
            {/* 左侧内容区域 */}
            <View style={styles.leftContainer}>
                <Text style={styles.mainTitle}>构音教学草稿</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>教学场景: </Text>
                        <Text style={styles.infoValue}>
                            {learningGoals?.主题场景?.major} - {learningGoals?.主题场景?.activity}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>教学目标: </Text>
                        <Text style={styles.infoValue}>
                            {learningGoals?.构音?.teachingGoal}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>卡片素材: </Text>
                        <Text style={styles.infoValue}>{cardsContent}</Text>
                    </View>
                </View>
            </View>

            {/* 右侧内容区域 */}
            <View style={styles.rightContainer}>
                { !isFinal && (
                <TouchableOpacity style={styles.fetchButton} onPress={fetchTeachingPlan}>
                    <Text style={styles.fetchButtonText}>
                        {planContent ? '生成教学计划' : '获取教学计划'}
                    </Text>
                </TouchableOpacity>
                )}
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    planContent !== '' && (
                        <View style={styles.planContainer}>
                            {editing ? (
                                <TextInput
                                    style={styles.editableText}
                                    multiline
                                    scrollEnabled
                                    value={editableContent}
                                    onChangeText={text => setEditableContent(text)}
                                />
                            ) : (
                                <ScrollView style={styles.scrollContent}>
                                    <Text style={styles.planText}>{planContent}</Text>
                                </ScrollView>
                            )}
                            { !isFinal && (
                            <TouchableOpacity
                                style={styles.editButtonWrapper}
                                onPress={handleEditButtonPress}
                            >
                                <Text style={styles.editButtonText}>
                                    {editing ? '完成' : '编辑'}
                                </Text>
                            </TouchableOpacity>
                                )}
                        </View>
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    /* 根容器保持原样 */
    container: {
        top: '10%',
        flexDirection: 'row',
        width: '100%',
        maxWidth: 1029,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'flex-start',
    },

    /* 左侧信息栏不变 */
    leftContainer: {
        width: '30%',
        marginLeft: '5%',
        paddingRight: '1%',
    },

    /* 右侧区域加宽、内边距稍减 */
    rightContainer: {
        width: '60%',      // 原 50%
        paddingLeft: '8%', // 原 10%
        alignItems: 'center',
    },

    /* 左侧标题 */
    mainTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C5B83',
        marginBottom: 20,
        textAlign: 'center',
    },

    infoContainer: { alignSelf: 'flex-start' },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    infoLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1C5B83',
    },
    infoValue: {
        fontSize: 14,
        color: '#1C5B83',
        flexShrink: 1,
        flexWrap: 'wrap',
    },

    /* 生成教学计划按钮：上下间距缩小一点 */
    fetchButton: {
        backgroundColor: '#1C5B83',
        paddingVertical: 8,     // 原 10
        paddingHorizontal: 18,  // 原 20
        borderRadius: 5,
        marginVertical: 12,     // 原 20
    },
    fetchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    /* 教学计划框：更宽、更矮 */
    planContainer: {
        position: 'relative',
        width: '100%',  // 铺满 rightContainer
        height: 160,    // 原 240
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
    },

    /* 查看模式滚动区 */
    scrollContent: {
        padding: 10,
        maxHeight: 160, // 防止内容撑高
    },

    /* 普通文本 */
    planText: {
        fontSize: 15,
        color: '#333',
    },

    /* 编辑模式输入框，同样锁高 */
    editableText: {
        fontSize: 16,    // 原 18
        color: '#333',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        height: 160,     // 原 300
    },

    /* 编辑/完成按钮 */
    editButtonWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    editButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
});





export default Pronun;
