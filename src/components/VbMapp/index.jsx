// components/VbMapp/index.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Helper function to split an array into chunks of specified size
 * @param {Array} array - The array to split
 * @param {number} size - The size of each chunk
 * @returns {Array[]} - An array of chunks
 */
const chunkArray = (array, size) => {
    const results = [];
    for (let i = 0; i < array.length; i += size) {
        results.push(array.slice(i, i + size));
    }
    return results;
};

/**
 * VbMapp Component
 * @param {Array[]} milestones - 里程碑数据，每个子数组对应一列
 * @param {string[]} milestoneColors - 每列的颜色
 * @param {function} onMilestoneToggle - 里程碑点击回调
 */
const VbMapp = ({ milestones, milestoneColors, onMilestoneToggle }) => {
    const columnLabels = ['词汇', '命名', '语言结构', '对话'];
    const stageLabels = ['第一阶段', '第二阶段', '第三阶段'];

    // 最大级别
    const maxLevel = 15;
    const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);
    const groups = chunkArray(levels, 5); // 每组5个级别

    return (
        <View style={styles.container}>
            {/* 标题 */}
            <Text style={styles.title}>语言发展里程碑</Text>

            {/* 主内容区域 */}
            <View style={styles.mainRow}>
                {/* 左侧的等级标签 */}
                <View style={styles.labelsColumn}>
                    {groups.map((groupLevels, groupIndex) => (
                        <View key={groupIndex} style={styles.labelGroup}>
                            {/* 阶段标签 */}
                            <Text style={styles.stageLabel}>
                                {stageLabels[groupIndex] || ''}
                            </Text>
                            {/* 从下往上渲染标签 */}
                            {groupLevels.slice().reverse().map((level) => (
                                <View key={level} style={styles.labelContainer}>
                                    <Text style={styles.labelText}>{`${level}-M`}</Text>
                                </View>
                            ))}
                        </View>
                    )).reverse()}
                </View>

                {/* 里程碑列 */}
                <View style={styles.milestoneColumns}>
                    {milestones.map((column, colIndex) => {
                        const columnGroups = chunkArray(column, 5); // 每5个里程碑为一组

                        return (
                            <View key={colIndex} style={styles.milestoneColumn}>
                                {/* 渲染组，从下往上 */}
                                {columnGroups.map((group, groupIndex) => (
                                    <View key={groupIndex} style={styles.milestoneGroup}>
                                        {/* 每组顶部的圆角矩形头部，仅在有里程碑时渲染 */}
                                        {group.length > 0 && (
                                            <View style={[styles.groupHeader, { backgroundColor: milestoneColors[colIndex] }]}>
                                                <Text style={styles.groupHeaderText}>{columnLabels[colIndex]}</Text>
                                            </View>
                                        )}

                                        {/* 从下往上渲染里程碑块 */}
                                        {group.map((_, milestoneIndexInGroup) => {
                                            const dataIndex = groupIndex * 5 + milestoneIndexInGroup;
                                            const isSelected = milestones[colIndex][dataIndex];

                                            return { dataIndex, isSelected };
                                        }).reverse().map(({ dataIndex, isSelected }) => (
                                            <TouchableOpacity
                                                key={dataIndex}
                                                style={[
                                                    styles.milestoneBlock,
                                                    { backgroundColor: isSelected ? milestoneColors[colIndex] : '#FFF' },
                                                    { borderColor: 'grey' }, // 设置边框颜色为灰色
                                                ]}
                                                onPress={() => {
                                                    onMilestoneToggle(colIndex, dataIndex);
                                                }}
                                            />
                                        ))}

                                        {/* 每组之间的间隔 */}
                                        {groupIndex < columnGroups.length - 1 && <View style={styles.groupSpacer} />}
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    mainRow: {
        flexDirection: 'row',
    },
    labelsColumn: {
        flexDirection: 'column',
        justifyContent: 'center', // 垂直方向居中对齐
        alignItems: 'flex-end',
        marginRight: 10,
    },
    labelGroup: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: 30, // 每组之间的间隔
    },
    labelContainer: {
        height: 30, // 与里程碑块高度一致
        justifyContent: 'center',
    },
    labelText: {
        color: 'grey',
        fontSize: 12,
    },
    stageLabel: {
        color: 'grey',
        fontSize: 10,
        textAlign: 'right',
        marginBottom: 5,
    },
    milestoneColumns: {
        flexDirection: 'row',
    },
    milestoneColumn: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 20,
    },
    milestoneGroup: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    groupHeader: {
        width: 60,
        height: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1, // 添加边框宽度
        borderColor: 'grey', // 设置边框颜色为灰色
    },
    groupHeaderText: {
        color: '#FFF',
        fontSize: 12,
    },
    milestoneBlock: {
        width: 60,
        height: 30,
        borderWidth: 0.5,
        borderColor: 'grey', // 设置边框颜色为灰色
    },
    groupSpacer: {
        height: 20, // 每组之间的间隔
    },
});

export default VbMapp;
