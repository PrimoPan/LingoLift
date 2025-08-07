import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const LearningTitle = ({ selectedTheme, onSelect, onChangeStep, availableModules = [] }) => {
    return (
        <View style={styles.textRow}>
            {availableModules.includes("构音模块") && (
                <Text
                    style={[
                        styles.moduleTitle,
                        selectedTheme === "构音模块" && styles.selected
                    ]}
                    onPress={() => {
                        onSelect("构音模块");
                        onChangeStep(0); // Set currentStep to 0
                    }}
                >
                    构音模块
                </Text>
            )}
            {availableModules.includes("命名模块") && (
                <Text
                    style={[
                        styles.moduleTitle,
                        selectedTheme === "命名模块" && styles.selected
                    ]}
                    onPress={() => {
                        onSelect("命名模块");
                        onChangeStep(1); // Set currentStep to 1
                    }}
                >
                    命名模块
                </Text>
            )}
            {availableModules.includes("语言结构模块") && (
                <Text
                    style={[
                        styles.moduleTitle,
                        selectedTheme === "语言结构模块" && styles.selected
                    ]}
                    onPress={() => {
                        onSelect("语言结构模块");
                        onChangeStep(2); // Set currentStep to 2
                    }}
                >
                    语言结构模块
                </Text>
            )}
            {availableModules.includes("对话模块") && (
                <Text
                    style={[
                        styles.moduleTitle,
                        selectedTheme === "对话模块" && styles.selected
                    ]}
                    onPress={() => {
                        onSelect("对话模块");
                        onChangeStep(3); // Set currentStep to 3
                    }}
                >
                    对话模块
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        position: 'absolute',
        top: 130,        // 原来 188 之类 → 150
        left: 118,
    },

    moduleTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(28.44, 91.45, 131.42, 0.50)',
    },
    selected: {
        color: '#39B8FF',  // Highlight the selected theme
    },
});

export default LearningTitle;
