// @ts-nocheck
import React, { useState } from 'react';
import { TextInput, Button, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { generateImage } from '../../utils/api';
import { buildAdhocCipherPrompt } from '../../prompts/buildCipherPrompt';

const ImageGenerator = () => {
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerateImage = async () => {
        if (!description.trim()) {
            Alert.alert('错误', '请输入图片描述！');
            return;
        }

        setLoading(true);
        try {
            const cipherPrompt = buildAdhocCipherPrompt(
                description,
                'IMAGE_GENERATOR_USER_INPUT'
            );
            const result = await generateImage(cipherPrompt);
            setImageUrl(result);
        } catch (error) {
            Alert.alert('错误', error.message || '生成图片失败，请重试！');
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
                editable={!loading}
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
