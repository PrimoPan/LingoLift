import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import Header from './Header';
import ThemeSelector from './ThemeSelector';
import ModuleSelector from './ModuleSelector';
import ThemeGrid from './ThemeGrid';
import ActionButtons from './ActionButtons';

const LearningThemeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={styles.contentWrapper}>
        <ThemeSelector />
        <Image
          resizeMode="contain"
          source={{
            uri: 'https://cdn.builder.io/api/v1/image/assets/248c3eeefc164ad3bce1d814c47652e0/4859b89750c84c573ceec5ea8ba3b33b94db695010593ac6f36401e563ccfee4?apiKey=248c3eeefc164ad3bce1d814c47652e0&',
          }}
          style={styles.dividerImage}
        />
        <ModuleSelector />
        <ThemeGrid />
        <ActionButtons />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 49,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  dividerImage: {
    width: '100%',
    maxWidth: 1027,
    aspectRatio: 500,
    marginTop: 11,
  },
});

export default LearningThemeScreen;
