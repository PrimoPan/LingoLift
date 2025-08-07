import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const ImageGenerator = () => {
    const [description, setDescription] = useState(''); // 用户输入的图片描述
    const [imageUrl, setImageUrl] = useState(''); // 返回的图片 URL
    const [loading, setLoading] = useState(false); // 请求状态

    const handleGenerateImage = async () => {
        if (!description.trim()) {
            Alert.alert('错误', '请输入图片描述！');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://47.242.78.104:6088/i/pic', // 文生图接口地址
                {
                    uid: 'a81s', // 替换为后端提供的用户标识
                    picreq: description, // 用户输入的描述
                },
                {
                    headers: {
                        'Content-Type': 'application/json', // 设置请求头
                    },
                }
            );

            const { data } = response.data; // 获取返回的图片 URL
            setImageUrl(data); // 设置图片 URL
        } catch (error) {
            console.error('请求失败:', error);
            Alert.alert('错误', '生成图片失败，请重试！');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="请输入图片描述"
                value={description}
                onChangeText={setDescription}
                editable={!loading} // 禁用输入框防止重复提交
            />
            <Button title={loading ? '生成中...' : '生成图片'} onPress={handleGenerateImage} disabled={loading} />
            {imageUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                />
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    input: {
        width: '100%',
        padding: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default ImageGenerator;
