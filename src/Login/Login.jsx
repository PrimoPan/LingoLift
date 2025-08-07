import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    Alert,
    Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ①
import useStore from '../store/store';
import { loginTeacher } from '../services/api';

const STORAGE_KEY = 'teacher_credentials';

const Login = ({ navigation }) => {
    const [username, setUsername]   = useState('');
    const [password, setPassword]   = useState('');
    const [rememberMe, setRemember] = useState(false);              // ②

    const { setUsernameAsync, setToken } = useStore();

    /** ③ 组件挂载时尝试自动填充 */
    useEffect(() => {
        (async () => {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) {
                    const { username: u, password: p } = JSON.parse(data);
                    setUsername(u);
                    setPassword(p);
                    setRemember(true);
                }
            } catch (e) {
                // 忽略读取失败
            }
        })();
    }, []);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('提示', '请输入用户名和密码');
            return;
        }
        const normalizedUsername = username.trim().toLowerCase();

        try {
            const { token } = await loginTeacher(normalizedUsername, password);

            // ✅ 存 Zustand
            await setUsernameAsync(normalizedUsername);
            setToken(token);

            /** ④ 记住 or 清除 */
            if (rememberMe) {
                await AsyncStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ username: normalizedUsername, password })
                );
            } else {
                await AsyncStorage.removeItem(STORAGE_KEY);
            }

            Alert.alert('登录成功');
            navigation.replace('ChildrenList');
        } catch (error) {
            Alert.alert('登录失败', error?.message || String(error));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>教师登录</Text>

            <TextInput
                style={styles.input}
                placeholder="用户名"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* ⑤ 记住密码开关 */}
            <View style={styles.rememberRow}>
                <Text style={styles.rememberText}>记住密码</Text>
                <Switch value={rememberMe} onValueChange={setRemember} />
            </View>

            <Button title="登录" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#E0F7FA',
    },

    title: { fontSize: 24, marginBottom: 20 },

    /** 输入框回到最初的 33% 屏宽 */
    input: {
        width: '33%',
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },

    /** “记住密码” 行与输入框同宽 */
    rememberRow: {
        width: '33%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rememberText: { fontSize: 16 },
});



export default Login;
