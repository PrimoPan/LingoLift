import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/store';
import environmentData from '../Knowledge/Goals.json';

const getRandomLowestLevelItems = (data, count) => {
    const allItems = [];

    const traverse = (obj, parentTitle = '') => {
        Object.entries(obj).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                allItems.push({ title: key, parent: parentTitle, items: value });
            } else {
                traverse(value, key);
            }
        });
    };

    traverse(data);

    const shuffled = allItems.flatMap((item) =>
        item.items.map((subItem) => ({ parent: item.parent, title: item.title, content: subItem }))
    ).sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
};

const EnvironmentChoose = () => {
    const navigation = useNavigation();
    const setLearningGoals = useStore((state) => state.setLearningGoals);
    const learningGoals = useStore((state) => state.learningGoals || {});

    const [randomItems, setRandomItems] = useState(() => getRandomLowestLevelItems(environmentData.课程, 3));
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleSelect = (item) => {
        setSelectedItem(selectedItem === item ? null : item);
    };

    const handleRegenerate = () => {
        setRandomItems(getRandomLowestLevelItems(environmentData.课程, 3));
        setSelectedItem(null);
    };

    const handleSubmit = () => {
        const updatedGoals = {
            ...learningGoals,
            环境: selectedItem || "无",
        };
        setLearningGoals(updatedGoals);
        Alert.alert('提交成功', JSON.stringify(updatedGoals, null, 2));
        navigation.navigate('GptLearning');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>返回</Text>
            </TouchableOpacity>

            <Text style={styles.title}>选择环境内容</Text>

            {randomItems.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.parentTitle}>{item.parent} - {item.title}</Text>
                    <TouchableOpacity
                        style={[styles.itemButton, selectedItem === item.content && styles.itemButtonSelected]}
                        onPress={() => toggleSelect(item.content)}
                    >
                        <Text style={styles.itemButtonText}>{item.content}</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity
                style={styles.regenerateButton}
                onPress={handleRegenerate}
            >
                <Text style={styles.regenerateButtonText}>重新生成</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.submitButton, !selectedItem && styles.submitButtonDisabled]}
                onPress={selectedItem ? handleSubmit : null}
            >
                <Text style={styles.submitButtonText}>提交</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EnvironmentChoose;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F2F2F2',
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
        marginBottom: 20,
        textAlign: 'center',
    },
    itemContainer: {
        marginBottom: 20,
    },
    parentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    itemButton: {
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#bdc3c7',
        alignItems: 'center',
    },
    itemButtonSelected: {
        backgroundColor: '#2980b9',
    },
    itemButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    regenerateButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#f39c12',
        alignItems: 'center',
    },
    regenerateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: '#27ae60',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#bdc3c7',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
