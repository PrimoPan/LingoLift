import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LearningTheme = ({ selectedModule }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, selectedModule === '学习主题' && styles.selectedText]}>
                学习主题内容
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#1C5B83',
    },
    selectedText: {
        color: '#39B8FF',  // High light color for selected module
    }
});

export default LearningTheme;
