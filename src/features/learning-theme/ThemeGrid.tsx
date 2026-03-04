import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const ThemeGrid = () => {
  const themes = [
    {title: '综合学习主题', options: ['超市购物']},
    {title: '儿童兴趣主题', options: ['糖果乐园（强化物：棒棒糖）']},
    {title: '家庭生活', options: ['汽车大赛（强化物：小汽车）']},
    {title: '未来职业', options: ['动物乐园（强化物：小动物）']},
  ];

  return (
    <View style={styles.themeGridContainer}>
      <View style={styles.gridWrapper}>
        <View style={styles.themeColumns}>
          {themes.map((theme, index) => (
            <View key={index} style={styles.themeColumn}>
              <Text style={styles.themeTitle}>{theme.title}</Text>
              {theme.options.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.themeOption}>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.customThemeColumn}>
          <Text style={styles.themeTitle}>自由主题</Text>
          <TextInput
            style={styles.customThemeInput}
            placeholder="请输入"
            placeholderTextColor="rgba(28, 91, 131, 0.5)"
          />
        </View>
      </View>
      <Text style={styles.helperText}>
        *请选择您本次的学习主题，或者自由输入主题
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  themeGridContainer: {
    width: '100%',
    maxWidth: 1029,
    borderRadius: 40,
    paddingHorizontal: 69,
    paddingTop: 71,
    paddingBottom: 46,
    marginTop: 16,
  },
  gridWrapper: {
    flexDirection: 'row',
    gap: 20,
  },
  themeColumns: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  themeColumn: {
    flex: 1,
    minWidth: '45%',
  },
  customThemeColumn: {
    flex: 1,
  },
  themeTitle: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 20,
    color: 'rgba(28, 91, 131, 1)',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  themeOption: {
    backgroundColor: 'rgba(28, 91, 131, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  optionText: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 20,
    color: 'rgba(28, 91, 131, 1)',
    fontWeight: '400',
    textAlign: 'center',
  },
  customThemeInput: {
    borderWidth: 1,
    borderColor: 'rgba(28, 91, 131, 0.5)',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 20,
    color: 'rgba(28, 91, 131, 1)',
    textAlign: 'center',
  },
  helperText: {
    color: 'rgba(28, 91, 131, 0.5)',
    fontSize: 16,
    fontFamily: 'PingFang SC, sans-serif',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 39,
  },
});

export default ThemeGrid;
