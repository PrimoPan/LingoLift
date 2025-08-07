import React from 'react';
import ReactDOM from 'react-dom';
import { AppRegistry } from 'react-native';
import App from './App';  // 你的 React Native 应用
import { name as appName } from './app.json';

// 使用 React Native Web
import { configureFonts } from 'react-native-web';
import { useFonts } from '@use-expo/font';

AppRegistry.registerComponent(appName, () => App);

// 运行应用
AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app-root'),
});
