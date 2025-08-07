import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import useStore from '../store/store.jsx';
import LearningTitle from './LearningTitle';
import ThemeSelection from './ThemeSelection';
import ButtonGroup from './ButtonGroup';
import ThemeScene from './ThemeScene';
import Pronunciation from './PronunciationModule';
import Naming from './Naming';
import Language from './Language';
import DH from './DH';

const { width, height } = Dimensions.get('window');
const Models = [
    '学习主题',
    '主题场景',
    '构音模块',
    '命名模块',
    '语言结构模块',
    '对话模块',
];

const Procedure = () => {
    const navigation = useNavigation();
    const {
        currentChildren,
        learningGoals,
        setLearningGoals,
        resetLesson,
        moduleFlags,
    } = useStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState(Models[0]);
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedMajor, setSelectedMajor] = useState(null);

    const [availableModules, setAvailableModules] = useState([
        '学习主题',
        '主题场景',
    ]);

    const [activity, setActivity] = useState(null);
    const [backgroundUrl, setBackgroundUrl] = useState(null);

    const [Gy, setGy] = useState(null);
    const [namingGoal, setNamingGoal] = useState(null);
    const [LgGoal, setLgGoal] = useState(null);
    const [DhGoal, setDhGoal] = useState(null);

    const lastMajorRef = useRef(null);
    const lastSceneKeyRef = useRef(
        learningGoals?.主题场景
            ? `${learningGoals.主题场景.major}-${learningGoals.主题场景.activity}`
            : null
    );

    // 1. 根据 flags / learningGoals 更新导航标签
    useEffect(() => {
        const mods = ['学习主题', '主题场景', '构音模块'];
        if (moduleFlags.命名 || learningGoals?.命名) mods.push('命名模块');
        if (moduleFlags.语言结构 || learningGoals?.语言结构) mods.push('语言结构模块');
        if (moduleFlags.对话 || learningGoals?.对话) mods.push('对话模块');
        setAvailableModules(mods);
    }, [learningGoals, moduleFlags]);

    // 2. 选主题时：若换了 major，则重置流程
    const handleSelectMajor = (major) => {
        setSelectedMajor(major);
        if (major && major !== lastMajorRef.current) {
            resetLesson();
            lastMajorRef.current = major;
        }
    };

    // 计算可用模块索引列表
    const safeAvailableModulesIndex = availableModules
        .map((mod) => Models.indexOf(mod))
        .filter((idx) => idx >= 0);
    const allowedLastStep = safeAvailableModulesIndex[safeAvailableModulesIndex.length - 1];

    // 3. 下一步
    const handleNextStep = () => {
        // 场景校验
        if (currentStep === 1 && (!activity || !backgroundUrl)) {
            Alert.alert('提示', '请先选择场景并生成图片');
            return;
        }

        // 保存各步骤数据
        if (currentStep === 1) {
            const newKey = `${selectedMajor}-${activity}`;
            const changed = newKey !== lastSceneKeyRef.current;
            setLearningGoals({
                ...learningGoals,
                主题场景: { major: selectedMajor, activity, background: backgroundUrl },
                构音: changed ? null : learningGoals.构音,
            });
            if (changed) {
                setGy(null);
                lastSceneKeyRef.current = newKey;
            }
        } else if (currentStep === 2 && Gy) {
                        // 构音素材校验：必须选中至少一张卡片
                           if (!Gy?.cards || Gy.cards.length === 0) {
                                Alert.alert('提示', '请先选取构音素材，再进入下一步（点击“选择该元素”选取）！');
                                return;
                            }
            setLearningGoals({ ...learningGoals, 构音: Gy });
        } else if (currentStep === 3 && namingGoal) {
            setLearningGoals({
                ...learningGoals,
                命名: { ...(learningGoals.命名 || {}), detail: namingGoal },
            });
        } else if (currentStep === 4 && LgGoal) {
            setLearningGoals({
                ...learningGoals,
                语言结构: { ...(learningGoals.语言结构 || {}), detail: LgGoal },
            });
        } else if (currentStep === 5 && DhGoal) {
            setLearningGoals({
                ...learningGoals,
                对话: { ...(learningGoals.对话 || {}), detail: DhGoal },
            });
            return navigation.navigate('Draft');
        }

        // 如果已到最后一个可用模块，进入 Draft
        if (currentStep === allowedLastStep) {
            return navigation.navigate('Draft');
        }

        // 否则跳到下一个可用模块
        const idx = safeAvailableModulesIndex.findIndex((i) => i === currentStep);
        if (idx >= 0 && idx < safeAvailableModulesIndex.length - 1) {
            setCurrentStep(safeAvailableModulesIndex[idx + 1]);
        }
    };

    // 4. 上一步
    const handleLast = () => {
        if (currentStep === 0) {
            return navigation.navigate('ChildProfileScreen');
        }
        const idx = safeAvailableModulesIndex.findIndex((i) => i === currentStep);
        if (idx > 0) {
            setCurrentStep(safeAvailableModulesIndex[idx - 1]);
        } else {
            navigation.navigate('ChildProfileScreen');
        }
    };

    // 5. 标签跳转
    const handleChangeStep = (step) => setCurrentStep(step);

    // 6. 同步 selectedTheme
    useEffect(() => {
        setSelectedTheme(Models[currentStep]);
    }, [currentStep]);

    // 7. 渲染
    return (
        <View style={[styles.container, { width, height }]}>
            {currentStep < 6 && <Text style={styles.title}>智能生成教材</Text>}

            {/* 顶栏 */}
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>LingoLift</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{currentChildren?.name || ''}</Text>
            <View style={styles.rectangle75} />

            {/* 标签导航 */}
            {currentStep < 6 && (
                <LearningTitle
                    selectedTheme={selectedTheme}
                    onSelect={setSelectedTheme}
                    onChangeStep={handleChangeStep}
                    availableModules={availableModules}
                />
            )}

            {/* 步骤内容 */}
            {currentStep === 0 && (
                <ThemeSelection
                    selectedBox={selectedBox}
                    handleSelectBox={setSelectedBox}
                    handleSelectMajor={handleSelectMajor}
                />
            )}
            {currentStep === 1 && (
                <ThemeScene
                    selectedMajor={selectedMajor}
                    onSelectScene={(sc, url) => {
                        setActivity(sc);
                        setBackgroundUrl(url);
                    }}
                />
            )}
            {currentStep === 2 && (
                    <Pronunciation
                        materials={learningGoals.构音 || []}
                        handleGy={setGy}
                        navigation={navigation}
                        selectedModule="构音模块"
                    />
                        )}
            {currentStep === 3 && <Naming onSelectGoal={setNamingGoal} />}
            {currentStep === 4 && <Language onSelectGoal={setLgGoal} />}
            {currentStep === 5 && <DH onSelectGoal={setDhGoal} />}

            {/* 按钮组 */}
            <ButtonGroup handleNext={handleNextStep} handleLast={handleLast} step={currentStep} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DBF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangle75: {
        width: '90%',
        height: '59%',
        backgroundColor: 'white',
        borderRadius: 40,
        position: 'absolute',
        top: '28%',
        left: '5%',
    },
    childFile: { fontSize: 18, color: '#1C5B83', position: 'absolute', top: 80, left: 54 },
    title: { fontSize: 18, color: '#1C5B83', fontWeight: '500', position: 'absolute', top: 80, left: 150 },
    logo: { fontSize: 20, color: '#39B8FF', fontWeight: '500', position: 'absolute', top: 15, left: 39 },
    ellipse: { width: 20, height: 20, backgroundColor: '#FFCB3A', borderRadius: 9999, position: 'absolute', top: 19, left: 14 },
    childName: { fontSize: 18, color: '#39B8FF', fontWeight: '500', position: 'absolute', top: 17, left: '75%' },
});

export default Procedure;
