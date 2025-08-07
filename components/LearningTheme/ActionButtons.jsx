import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const ActionButtons = () => {
  return (
    <View style={styles.actionButtonsContainer}>
      <Image
        resizeMode="contain"
        source={{
          uri: 'https://cdn.builder.io/api/v1/image/assets/248c3eeefc164ad3bce1d814c47652e0/c81bbc19931d3cc48e2aecb5e281e83038c1eacceada090a793facd3d4a48aae?apiKey=248c3eeefc164ad3bce1d814c47652e0&',
        }}
        style={styles.actionButton}
      />
      <Image
        resizeMode="contain"
        source={{
          uri: 'https://cdn.builder.io/api/v1/image/assets/248c3eeefc164ad3bce1d814c47652e0/f063f2251b6251a939f8863b74f6aa4e3054ff41c983bc0c475a8db3b222ff02?apiKey=248c3eeefc164ad3bce1d814c47652e0&',
        }}
        style={styles.actionButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 482,
    maxWidth: '100%',
    marginTop: 31,
    marginLeft: 10,
  },
  actionButton: {
    width: 192,
    aspectRatio: 3.37,
  },
});

export default ActionButtons;
