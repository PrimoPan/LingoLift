import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/store';
import PinyinSelector from '../components/PinyinSelector';
import vbMappData from '../Knowledge/VBMapp.json';

function getRandomOne(domain, level) {
    const numericLevel = parseInt(level, 10);
    if (isNaN(numericLevel) || numericLevel < 1 || numericLevel > 15) {
        return null;
    }
    const levelKey = String(numericLevel).padStart(2, '0') + '-M';
    const items = vbMappData[domain]?.[levelKey];
    if (!items || items.length === 0) {
        return null;
    }
    const subset = items.slice(0, items.length - 1);
    if (subset.length === 0) {
        return null;
    }
    const randIndex = Math.floor(Math.random() * subset.length);
    return subset[randIndex];
}

const LearningMode = () => {
    const navigation = useNavigation();

    const initialStoreValue = useStore.getState().currentChildren || {};
    const savedLearningGoals = useStore.getState().learningGoals || null;

    const namingLevel = initialStoreValue['命名'] || '1';
    const structureLevel = initialStoreValue['语言结构'] || '1';
    const dialogueLevel = initialStoreValue['对话'] || '1';

    const [namingSolution, setNamingSolution] = useState(() =>
        savedLearningGoals?.命名 || getRandomOne('命名', namingLevel)
    );
    const [structureSolution, setStructureSolution] = useState(() =>
        savedLearningGoals?.语言结构 || getRandomOne('语言结构', structureLevel)
    );
    const [dialogueSolution, setDialogueSolution] = useState(() =>
        savedLearningGoals?.对话 || getRandomOne('对话', dialogueLevel)
    );

    const [selectedInitials, setSelectedInitials] = useState(
        Array.isArray(savedLearningGoals?.构音)
            ? savedLearningGoals.构音.split(', ')
            : Array.isArray(initialStoreValue.selectedInitials)
                ? initialStoreValue.selectedInitials
                : []
    );

    const [moduleSelections, setModuleSelections] = useState({
        naming: savedLearningGoals ? !!savedLearningGoals.命名 : true,
        structure: savedLearningGoals ? !!savedLearningGoals.语言结构 : true,
        dialogue: savedLearningGoals ? !!savedLearningGoals.对话 : true,
        pinyin: savedLearningGoals ? !!savedLearningGoals.构音 : true,
    });

    const toggleModuleSelection = (module) => {
        setModuleSelections((prev) => ({
            ...prev,
            [module]: !prev[module],
        }));
    };

    const reRandomNaming = () => {
        setNamingSolution(getRandomOne('命名', namingLevel));
    };
    const reRandomStructure = () => {
        setStructureSolution(getRandomOne('语言结构', structureLevel));
    };
    const reRandomDialogue = () => {
        setDialogueSolution(getRandomOne('对话', dialogueLevel));
    };

    const handleSubmit = () => {
        const learningGoals = {
            构音: moduleSelections.pinyin && selectedInitials.length > 0
                ? selectedInitials.join(', ')
                : "无",
            命名: moduleSelections.naming ? namingSolution || "无" : "无",
            语言结构: moduleSelections.structure ? structureSolution || "无" : "无",
            对话: moduleSelections.dialogue ? dialogueSolution || "无" : "无",
        };

        // 更新 learningGoals
        useStore.setState({ learningGoals });

        // 同步更新 currentChildren 的 selectedInitials
        const currentChildren = useStore.getState().currentChildren;
        useStore.setState({
            currentChildren: {
                ...currentChildren,
                selectedInitials: selectedInitials,
            },
        });

        Alert.alert('提交的学习目标', JSON.stringify(learningGoals, null, 2));
        navigation.navigate('EnvironmentChoose');
    };


    useEffect(() => {
        const syncSelectedInitials = () => {
            const { currentChildren, learningGoals } = useStore.getState();
            const initialsFromChildren = currentChildren?.selectedInitials ?? [];
            const initialsFromGoals = learningGoals?.构音?.split(', ') ?? [];

            // 如果两个值不一致，优先使用 currentChildren 的值同步到 learningGoals
            if (JSON.stringify(initialsFromChildren) !== JSON.stringify(initialsFromGoals)) {
                useStore.setState({
                    learningGoals: {
                        ...learningGoals,
                        构音: initialsFromChildren.join(', '),
                    },
                });
            }
        };

        syncSelectedInitials();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.leftColumn}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('CreateChildren')}
                >
                    <Text style={styles.backButtonText}>回退</Text>
                </TouchableOpacity>
                <Text style={styles.title}>拼音选择</Text>
                <PinyinSelector
                    selectedInitials={selectedInitials}
                    onSelectedInitialsChange={setSelectedInitials}
                    maxCount={3}
                />
                <TouchableOpacity
                    style={[styles.moduleButton, moduleSelections.pinyin && styles.moduleButtonSelected]}
                    onPress={() => toggleModuleSelection('pinyin')}
                >
                    <Text style={styles.moduleButtonText}>本次学习声母</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.rightColumn}>
                <Text style={styles.title}>等级选择</Text>

                <TouchableOpacity
                    style={[styles.moduleButton, moduleSelections.naming && styles.moduleButtonSelected]}
                    onPress={() => toggleModuleSelection('naming')}
                >
                    <Text style={styles.moduleButtonText}>
                        命名 (Level: {namingLevel})
                    </Text>
                </TouchableOpacity>
                <RandomItemDisplay solution={namingSolution} />
                <TouchableOpacity style={styles.randomButton} onPress={reRandomNaming}>
                    <Text style={styles.randomButtonText}>重新随机</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moduleButton, moduleSelections.structure && styles.moduleButtonSelected]}
                    onPress={() => toggleModuleSelection('structure')}
                >
                    <Text style={styles.moduleButtonText}>
                        语言结构 (Level: {structureLevel})
                    </Text>
                </TouchableOpacity>
                <RandomItemDisplay solution={structureSolution} />
                <TouchableOpacity style={styles.randomButton} onPress={reRandomStructure}>
                    <Text style={styles.randomButtonText}>重新随机</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moduleButton, moduleSelections.dialogue && styles.moduleButtonSelected]}
                    onPress={() => toggleModuleSelection('dialogue')}
                >
                    <Text style={styles.moduleButtonText}>
                        对话 (Level: {dialogueLevel})
                    </Text>
                </TouchableOpacity>
                <RandomItemDisplay solution={dialogueSolution} />
                <TouchableOpacity style={styles.randomButton} onPress={reRandomDialogue}>
                    <Text style={styles.randomButtonText}>重新随机</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>提交</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

function RandomItemDisplay({ solution }) {
    if (!solution) {
        return <Text style={styles.warn}>无可用条目</Text>;
    }
    const keyName = Object.keys(solution)[0];
    const content = solution[keyName];
    return (
        <View style={styles.randomBox}>
            <Text style={styles.randomBoxText}>
                {keyName}: {content}
            </Text>
        </View>
    );
}

export default LearningMode;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
    },
    leftColumn: {
        flex: 0.5,
        padding: 20,
    },
    rightColumn: {
        flex: 0.5,
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#bdc3c7',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    moduleButton: {
        marginTop: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#bdc3c7',
    },
    moduleButtonSelected: {
        backgroundColor: '#2980b9',
    },
    moduleButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    randomButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#27ae60',
        alignSelf: 'flex-start',
    },
    randomButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    randomBox: {
        backgroundColor: '#eee',
        padding: 10,
        marginVertical: 8,
        borderRadius: 6,
    },
    randomBoxText: {
        fontSize: 14,
    },
    warn: {
        color: 'red',
        marginVertical: 8,
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        backgroundColor: '#27ae60',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
