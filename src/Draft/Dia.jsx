import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import useStore from "../store/store.jsx";
import { gptQuery } from "../utils/api";

const Dia = ({viewMode}) => {
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals, setLearningGoals, setModuleFlag } = useStore();
    const isFinal = viewMode === "final";

    const [loading, setLoading] = useState(false);
    const [planContent, setPlanContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editableContent, setEditableContent] = useState('');
    const namingDetails = learningGoals?.对话?.detail || [];
    useEffect(() => {
        console.log("Goals", learningGoals);
        console.log(isFinal);
    }, []);

    // 处理卡片素材字符串
    const cardsContent = learningGoals?.构音?.cards
        ?.map(card => card.word)
        ?.join(', ');


    const namingDescriptions = namingDetails
        .map(detailItem => {
            // 判断 detailItem.description 是否为数组
            if (Array.isArray(detailItem.description)) {
                // 若为数组则 join
                return detailItem?.description.join(',');
            } else {
                // 若为字符串或其他类型，直接返回
                return detailItem.description;
            }
        })
        .join(',');
    const fetchTeachingPlan = async () => {
        const safeDescriptions = namingDescriptions
            .replace(/\s+/g, ' ')   // 压缩所有空白（\n  \r  \t  连续空格）为单空格
            .replace(/[\"\'\\]/g, '') // 去掉 ", ', 反斜线
            .trim();                 // 去首尾空格
        //之前的bug, description格式没有统一
        const prompt = `这是阶段的教学内容生成模块：请你给出完整的教学计划，保证是一段可以直接包裹在包裹在我写的Text组件内的React Native的字符串，使用反斜杠n来换行。不要在返回内容里出现Text、jsx等无关内容（因为返回内容是一段字符串，会被直接包裹在text中）。大概300汉字字左右，用词尽量专业。你是一个中国孤独症教育专家，现在要对孤独症儿童VB-mapp中的对话教学模块教学。你的教学目标是：${safeDescriptions}。你的教学场景是：${learningGoals?.主题场景?.major} - ${learningGoals?.主题场景?.activity}，你可以用到的教学的词语有：${cardsContent}，请你生成一个具体的教学步骤，尽可能将这些词语和场景进行串联，同时符合对话学的教学目标，给出大概300字的教学计划，直接给出内容，不需要其他任何多余回答！`;
        setLoading(true);
        try {
            const result = await gptQuery(prompt);
            setPlanContent(result);
            setEditableContent(result);
            const updatedGoals = {
                ...learningGoals,
                对话: {
                    ...learningGoals?.对话,
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
    // 获取 detail 数组
    useEffect(() => {
        if (learningGoals?.对话?.Draft) {
            setPlanContent(learningGoals.对话.Draft);
            setEditableContent(learningGoals.对话.Draft);
        }
    }, [learningGoals]);
    const handleEditButtonPress = () => {
        if (editing) {
            // 如果从“编辑”切换到“完成”，需要把编辑内容同步到 learningGoals
            setPlanContent(editableContent);
            const updatedGoals = {
                ...learningGoals,
                对话: {
                    ...learningGoals?.对话,
                    Draft: editableContent, // 将编辑后的内容存到 Draft
                },
            };
            setLearningGoals(updatedGoals);
        }
        setEditing(!editing);
    };

    // 对每个 detailItem 的 description 做 join，然后再整体 join 起来
    // 假设你想每条 description 各占一行，可以用 '\n' 连接


    return (
        <View style={styles.container}>
            {/* 左侧内容区域 */}
            <View style={styles.leftContainer}>
                <Text style={styles.mainTitle}>对话教学草稿</Text>
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
                            {namingDescriptions}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>卡片素材: </Text>
                        <Text style={styles.infoValue}>{cardsContent}</Text>
                    </View>

                    {/* 关键：固定高度或最大高度，让它不会无限撑开 */}
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

export default Dia;
