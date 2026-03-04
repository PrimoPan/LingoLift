import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const ThemeSelector = () => {
  return (
    <View style={styles.selectorContainer}>
      <View style={styles.optionContainer}>
        <Text style={styles.optionText}>儿童档案</Text>
      </View>
      <Image
        resizeMode="contain"
        source={{
          uri: 'https://cdn.builder.io/api/v1/image/assets/248c3eeefc164ad3bce1d814c47652e0/a184acbdbe8e33eb6a34d8a08b442c58bfed9de2ff9ec0164c03fa63a7c0881e?apiKey=248c3eeefc164ad3bce1d814c47652e0&',
        }}
        style={styles.dividerImage}
      />
      <View style={styles.optionContainer}>
        <Text style={styles.selectedOptionText}>智能生成教材</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 72,
    marginLeft: 47,
  },
  optionContainer: {
    flex: 1,
  },
  optionText: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 18,
    color: 'rgba(28, 91, 131, 1)',
    fontWeight: '400',
  },
  selectedOptionText: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 18,
    color: 'rgba(28, 91, 131, 1)',
    fontWeight: '500',
  },
  dividerImage: {
    width: 5,
    aspectRatio: 0.5,
  },
});

export default ThemeSelector;
