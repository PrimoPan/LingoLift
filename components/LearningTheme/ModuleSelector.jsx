import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ModuleSelector = () => {
  const modules = [
    '学习主题',
    '主题场景',
    '构音模块',
    '命名模块',
    '语言结构模块',
    '对话模块',
  ];

  return (
    <View style={styles.moduleSelectorContainer}>
      {modules.map((module, index) => (
        <Text
          key={index}
          style={[
            styles.moduleText,
            index === 0 ? styles.activeModule : styles.inactiveModule,
          ]}>
          {module}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  moduleSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1023,
    marginTop: 12,
    gap: 40,
  },
  moduleText: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 20,
    fontWeight: '500',
  },
  activeModule: {
    color: 'rgba(28, 91, 131, 1)',
    borderRadius: 20,
    paddingHorizontal: 57,
    paddingVertical: 23,
  },
  inactiveModule: {
    color: 'rgba(28, 91, 131, 0.5)',
  },
});

export default ModuleSelector;
