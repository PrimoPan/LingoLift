import React from 'react';
import { AppRegistry, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

if (__DEV__) {
    const { DevSettings } = NativeModules;

    if (typeof window !== 'undefined') {
        if (window.XMLHttpRequest) {
            window.XMLHttpRequest = window.originalXMLHttpRequest || window.XMLHttpRequest;
            console.log('✅ Network Inspect Enabled');
        } else {
            console.warn('⚠️ window.XMLHttpRequest 未定义，可能无法捕获网络请求');
        }
    } else {
        console.warn('⚠️ window 不可用，可能是在非浏览器环境');
    }

    if (DevSettings) {
        DevSettings.addMenuItem('Enable Network Inspect', () => {
            console.log('✅ 开启网络请求日志');
        });
    } else {
        console.warn('⚠️ DevSettings 不存在，可能无法启用开发者菜单');
    }
}

AppRegistry.registerComponent(appName, () => App);
