import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle} />
        <Text style={styles.logoText}>LOGO</Text>
      </View>
      <Text style={styles.childName}>儿童姓名：派派</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
  },
  logoText: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 20,
    color: 'rgba(57, 184, 255, 1)',
    fontWeight: '500',
  },
  childName: {
    fontFamily: 'PingFang SC, sans-serif',
    fontSize: 18,
    color: 'rgba(57, 184, 255, 1)',
    fontWeight: '500',
  },
});

export default Header;
