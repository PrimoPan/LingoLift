import React, { useState } from 'react';
import { View, Button, StyleSheet, Text, ScrollView, Image, Alert } from 'react-native';
import { gptQuery, generateImage } from '../../utils/api'; // 引入封装的接口

const GptTest = () => {
    const [imagesData, setImagesData] = useState([]); // 图片和描述的数据数组
    const [loading, setLoading] = useState(false); // 加载状态
    const handleGenerate = async () => {
        setLoading(true);
        try {
            // 调用 GPT 接口生成描述
            const prompt = "生成三个描述，每个描述用于图片生成。";
            const response = await gptQuery(prompt);
            const descriptions = JSON.parse(response)?.response || [];

            // 调用图片生成接口为每个描述生成图片
            const imagePromises = descriptions.map((desc) =>
                generateImage(desc.描述).then((url) => ({ ...desc, imageUrl: url }))
            );
            const generatedImages = await Promise.all(imagePromises);

            setImagesData(generatedImages);
        } catch (error) {
            Alert.alert('错误', error.message || '生成失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title={loading ? '处理中...' : '生成图片和描述'}
                onPress={handleGenerate}
                disabled={loading}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {imagesData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
                        <Text style={styles.description}>{item.描述}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    card: {
        marginBottom: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '90%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
});

export default GptTest;
