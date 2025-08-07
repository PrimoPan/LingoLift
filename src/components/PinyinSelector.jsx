import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

// 定义声母分组数据
const pinyinGroupsByPosition = [
    { label: '双唇音', initials: ['b', 'p', 'm'] },
    { label: '唇齿音', initials: ['f'] },
    { label: '舌面音', initials: ['j', 'q', 'x'] },
    { label: '舌尖前音', initials: ['z', 'c', 's'] },
    { label: '舌尖中音', initials: ['d', 't', 'n', 'l'] },
    { label: '舌尖后音', initials: ['zh', 'ch', 'sh', 'r'] },
    { label: '舌根音', initials: ['g', 'k', 'h'] },
];

const pinyinGroupsByStage = [
    { label: '构音第一阶段', initials: ['b', 'm', 'd', 'h'] },
    { label: '构音第二阶段', initials: ['p', 't', 'g', 'k', 'n'] },
    { label: '构音第三阶段', initials: ['f', 'j', 'q', 'x'] },
    { label: '构音第四阶段', initials: ['l', 'z', 's', 'r'] },
    { label: '构音第五阶段', initials: ['c', 'zh', 'ch', 'sh'] },
];

const PinyinSelector = ({
                            selectedInitials,
                            onSelectedInitialsChange,
                            maxCount = 3,
                        }) => {
    const [arrangement, setArrangement] = useState('position'); // 当前排列方式

    // 根据排列方式动态选择分组数据
    const pinyinGroups =
        arrangement === 'position' ? pinyinGroupsByPosition : pinyinGroupsByStage;

    const handlePress = (initial) => {
        if (selectedInitials.includes(initial)) {
            const newSelected = selectedInitials.filter((item) => item !== initial);
            onSelectedInitialsChange(newSelected);
            return;
        }
        if (selectedInitials.length < 999999) {
            const newSelected = [...selectedInitials, initial];
            onSelectedInitialsChange(newSelected);
        } else {
            Alert.alert('提示', `最多只能选择${maxCount}个声母`);
        }
    };

    return (
        <View>
            {/* 切换排列方式的按钮 */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[
                        styles.switchButton,
                        arrangement === 'position' && styles.activeButton,
                    ]}
                    onPress={() => setArrangement('position')}
                >
                    <Text
                        style={[
                            styles.switchButtonText,
                            arrangement === 'position' && styles.activeButtonText,
                        ]}
                    >
                        声母发生部位
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.switchButton,
                        arrangement === 'stage' && styles.activeButton,
                    ]}
                    onPress={() => setArrangement('stage')}
                >
                    <Text
                        style={[
                            styles.switchButtonText,
                            arrangement === 'stage' && styles.activeButtonText,
                        ]}
                    >
                        构音阶段
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 渲染拼音按钮 */}
            {pinyinGroups.map((group) => (
                <View key={group.label} style={styles.groupContainer}>
                    <Text style={styles.groupLabel}>{group.label}</Text>
                    <View style={styles.groupRow}>
                        {group.initials.map((initial) => {
                            const isSelected = selectedInitials.includes(initial);
                            return (
                                <TouchableOpacity
                                    key={initial}
                                    style={[
                                        styles.pinyinButton,
                                        {
                                            backgroundColor: isSelected
                                                ? '#2980b9'
                                                : '#bdc3c7',
                                        },
                                    ]}
                                    onPress={() => handlePress(initial)}
                                >
                                    <Text style={styles.pinyinText}>{initial}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default PinyinSelector;

// 样式表
const styles = StyleSheet.create({
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    switchButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
        borderRadius: 6,
        backgroundColor: '#bdc3c7',
    },
    activeButton: {
        backgroundColor: '#2980b9',
    },
    switchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    activeButtonText: {
        color: '#fff',
    },
    groupContainer: {
        marginBottom: 10,
    },
    groupLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    groupRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pinyinButton: {
        width: 50,
        marginRight: 8,
        marginBottom: 6,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    pinyinText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
