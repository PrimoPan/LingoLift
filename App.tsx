import 'react-native-gesture-handler'; // 确保在其他任何导入之前导入这个
import { LogBox } from 'react-native';

// 保留运行时告警，避免线上问题被全局吞掉。
LogBox.ignoreLogs([]);

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Opening from './src/Opening/Opening';
import Login from './src/Login/Login';
import CreateChildren from './src/Createchildren/index';  // 引入 CreateChildren 组件
import DisplayStoreData from './src/DisplayStoreData';
import GptTest from './src/components/GptTest';
import ImageGenerator from './src/components/ImageGenerator';
import LearningMode from './src/LearningMode/LearningMode';
import EnvironmentChoose from './src/EnvironmentChoose';
import GptLearning from './src/GptLearning';
import useStore from './src/store/store'; // 引入 zustand store
import ChildProfileScreen from './components/childProfile/ChildProfileScreen';
import LearningThemeScreen from './components/LearningTheme/LearningThemeScreen';
import Procedure from './src/Procedure';
import Draft from './src/Draft/index';
import ChildrenList from './src/ChildrenList';
import GlobalBrandMark from './src/components/GlobalBrandMark';
const Stack = createNativeStackNavigator();
import ChildHistory from './src/ChildHistory';
const App = () => {
    const username = useStore((state) => state.username);

    return (
        <NavigationContainer>
            <GlobalBrandMark />
            <Stack.Navigator initialRouteName={username ? 'Login' : 'Opening'} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Opening" component={Opening} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ChildProfileScreen" component={ChildProfileScreen}/>
                <Stack.Screen name="CreateChildren" component={CreateChildren} />
                <Stack.Screen name="GptTest" component={GptTest}/>
                <Stack.Screen name="ImageGenerator" component={ImageGenerator}/>
                <Stack.Screen name="LearningMode" component={LearningMode}/>
                <Stack.Screen name="EnvironmentChoose" component={EnvironmentChoose}/>
                <Stack.Screen name="GptLearning" component={GptLearning}/>
                <Stack.Screen name="DisplayStoreData" component={DisplayStoreData}/>
                <Stack.Screen name="HorizontalLayout" component={Procedure}/>
                <Stack.Screen name="LearningThemeScreen" component={LearningThemeScreen}/>
                <Stack.Screen name="Draft" component={Draft}/>
                <Stack.Screen name="ChildrenList" component={ChildrenList}/>
                <Stack.Screen name="ChildHistory" component={ChildHistory}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
