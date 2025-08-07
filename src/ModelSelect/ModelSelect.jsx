import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    Alert,
} from 'react-native';
import useStore from '../store/store';
import {useNavigation} from "@react-navigation/native";
const skillsData = [
    { name: '构音', color: '#44DCF8' },
    { name: '命名', color: '#FCC40B' },
    { name: '语言结构', color: '#FF7A69' },
    { name: '对话', color: '#0ED89E' },
];

const ModelSelect = ({ visible, onClose, onSubmit }) => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    // 横屏时，容器宽度取屏幕宽度的70%
    const containerWidth = width * 0.7;
    // 计算技能按钮宽度：容器内左右各留20内边距，按钮之间间隙20，总共减去40+20=60
    const skillButtonWidth = (containerWidth - 60) / 2;
    const [submitting, setSubmitting] = useState(false);
    // 维护每个技能的选中状态
    const [selectedSkills, setSelectedSkills] = useState({
        命名: false,
        语言结构: false,
        对话: false,
        构音: false,
    });

    // 切换技能选中状态
    const toggleSkill = (skillName) => {
        setSelectedSkills((prev) => ({
            ...prev,
            [skillName]: !prev[skillName],
        }));
    };

    // 提交时构造数据，并调用 store 的 setLearningGoals 更新 learningGoals 状态
    const handleSubmit = () => {
                // —— 新增校验 ——
                    // 1) 全都没选
                        const anySelected = Object.values(selectedSkills).some(v => v);
                if (!anySelected) {
                        Alert.alert('提示', '请至少选择一个构音模块，并额外选择一个模块！！');
                        return;
                    }
                // 2) 如果选了“构音”，但没有选任何其他 VB-Mapp 模块
                    if (selectedSkills['构音'] &&
                        !selectedSkills['命名'] &&
                        !selectedSkills['语言结构'] &&
                        !selectedSkills['对话']
                    ) {
                        Alert.alert('提示', '请选择构音模块的同时，至少选择一个VB-Mapp模块！');
                       return;
                    }
               // —— 校验通过，继续下面的逻辑 ——
        let data = {};
        // 从 store 中获取 currentChildren 数据
        const { currentChildren } = useStore.getState();

        if (submitting) return;
        setSubmitting(true);
        console.log(currentChildren);
        // 遍历所有技能，若被选中，则构造 data 对象
        Object.keys(selectedSkills).forEach((skill) => {
            if (selectedSkills[skill]) {
                if (skill === '构音') {
                    // 将 currentChildren 的 selectedInitials 字段赋值给 "命名"
                    data[skill] = currentChildren.selectedInitials;
                } else {
                    // 其他技能选中时赋值为空对象
                    data[skill] = {level: currentChildren[skill]};
                }
            }
        });
        // 调用 store 中的 setLearningGoals 更新 learningGoals 状态
        const { setLearningGoals } = useStore.getState();
        setLearningGoals(data);
        onClose();
        navigation.navigate('HorizontalLayout');
        setSubmitting(false);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            supportedOrientations={['landscape']} // 限制为横屏模式
        >
            <View style={styles.overlay}>
                <View style={[styles.popupContainer, { width: containerWidth }]}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>学习内容</Text>
                        <Text style={styles.headerSubtitle}>
                            请您根据本次学习计划，选择目标练习技能
                        </Text>
                    </View>

                    {/* 技能按钮 */}
                    <View style={[styles.skillsContainer, { width: containerWidth - 40 }]}>
                        {skillsData.map((skill) => {
                            const isSelected = selectedSkills[skill.name];
                            return (
                                <TouchableOpacity
                                    key={skill.name}
                                    style={[
                                        styles.skillButton,
                                        {
                                            width: skillButtonWidth,
                                            // 未选中时背景为灰色，选中后显示对应颜色
                                            backgroundColor: isSelected ? skill.color : 'gray',
                                        },
                                        isSelected && styles.skillButtonSelected,
                                    ]}
                                    onPress={() => toggleSkill(skill.name)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.skillButtonText}>{skill.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* 提交按钮 */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>生成教材</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)', // 半透明背景
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContainer: {
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 20,
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        color: '#1C5B83',
        fontSize: 20,
        fontWeight: '500',
    },
    headerSubtitle: {
        color: '#1C5B83',
        fontSize: 15,
        fontWeight: '400',
        marginTop: 5,
        textAlign: 'center',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // 水平居中排列
        marginVertical: 20,
    },
    skillButton: {
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    skillButtonSelected: {
        borderWidth: 3,
        borderColor: '#000',
    },
    skillButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#39B8FF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
});

export default ModelSelect;
