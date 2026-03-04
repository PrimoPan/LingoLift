import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle} />
        <Text style={styles.logoText}>LOGO</Text>
      </View>
      <View style={styles.childrenList}>
        {['儿童姓名', '儿童姓名', '儿童姓名'].map((name, index) => (
          <View key={index} style={styles.childItem}>
            <Image
              source={{
                uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f120721ed5f1ff5c7bda64739440781c488602f54ea8ca6562529070d3fd7093?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
              }}
              style={styles.childImage}
              resizeMode="contain"
            />
            <Text style={styles.childName}>{name}</Text>
          </View>
        ))}
      </View>
      <Image
        source={{
          uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/79368a322f5a428db59e38b1e7a3d63ea9c8fc0f807cc7a1c96496a6d86d0791?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
        }}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    backgroundColor: '#1C5B83',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 5,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  childrenList: {
    marginBottom: 20,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  childImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  childName: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  bottomImage: {
    width: 34,
    height: 34,
    alignSelf: 'flex-start',
  },
});

export default Header;
