import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import useStore from '../store/store'; // 引入 zustand store

const Opening = ({ navigation }) => {
    const { user } = useStore(); // 从zustand获取user状态

    useEffect(() => {
        // 如果用户已登录，直接跳转到 Login 页面，否则 5 秒后跳转到 Login
        const timer = setTimeout(() => {
            if (user?.username) {
                navigation.replace('Login'); // 用户已登录，跳转到登录页面
            } else {
                navigation.replace('Login'); // 或者可以跳转到注册页面
            }
        }, 5000);

        // 清除定时器
        return () => clearTimeout(timer);
    }, [navigation, user?.username]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/BG/Opening/Opening.png')}
                style={styles.image}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F7FA',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default Opening;
