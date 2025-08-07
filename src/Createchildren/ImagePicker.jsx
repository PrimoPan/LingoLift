import React from 'react';
import { View, TouchableOpacity, Image, Text, Alert, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const ImagePicker = ({ childImage, setChildImage, setBase64Image }) => {
    const handleOpenCamera = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            saveToPhotos: true,
            cameraType: 'back',
        };

        launchCamera(options, async (response) => {
            if (response.didCancel) {
                Alert.alert('提示', '用户取消了拍照');
            } else if (response.errorCode) {
                Alert.alert('错误', `拍照失败: ${response.errorMessage}`);
            } else {
                const imageUri = response.assets?.[0]?.uri;

                if (imageUri) {
                    setChildImage(imageUri); // 设置图片路径

                    // 读取文件并转换为 base64
                    try {
                        const base64Data = await RNFS.readFile(imageUri, 'base64');
                        setBase64Image(`data:image/jpeg;base64,${base64Data}`); // 这里可以存 base64 供上传
                    } catch (error) {
                        Alert.alert('错误', '图片转换失败');
                    }
                }
            }
        });
    };

    return (
        <View style={styles.avatarWrapper}>
            <TouchableOpacity style={styles.avatarCircle} onPress={handleOpenCamera}>
                {childImage ? (
                    <Image style={styles.avatarImage} source={{ uri: childImage }} />
                ) : (
                    <>
                        <Text style={styles.uploadPlaceholder}>+</Text>
                        <Text style={styles.uploadText}>上传头像</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    avatarWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    uploadPlaceholder: {
        fontSize: 40,
        color: '#bbb',
        marginBottom: 6,
    },
    uploadText: {
        fontSize: 14,
        color: '#555',
    },
});

export default ImagePicker;
