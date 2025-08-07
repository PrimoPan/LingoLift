import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const ButtonGroup = ({ handleNext, handleLast}, step) => {
    return (
        <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.button} onPress={handleLast}>
                <Text style={styles.buttonText}>上一步</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>下一步</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between', // 两端对齐
        width: '80%',                    // 占屏宽 80%
        position: 'absolute',
        bottom: 20,                      // 距离屏幕底部 20 px
        left: '10%',                     // 配合 width 实现水平居中
    },
    button: {
        flex: 1,                         // 两个按钮平均分配剩余空间
        maxWidth: 180,                   // 不让按钮过宽
        height: 57,
        backgroundColor: '#39B8FF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,            // 按钮之间留空
        shadowColor: 'rgba(12, 12, 13, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,                    // Android 阴影
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
    },
});


export default ButtonGroup;
