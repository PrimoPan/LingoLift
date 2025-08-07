import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoalSection from './GoalSection';
import useStore from "../store/store";
import vbMappData from '../Knowledge/VBMapp.json';

const Naming = ({ onSelectGoal }) => {
    // 全局 store 中恢复已保存的命名 detail（数组）
    const saved = useStore(state => state.learningGoals?.命名?.detail) || [];
    const currentChildren = useStore(state => state.currentChildren);
    const level = currentChildren?.命名;

    // 随机函数
    function getRandomOne(domain, lvl) {
        const n = parseInt(lvl, 10);
        if (isNaN(n) || n < 1 || n > 15) return null;
        const key = String(n).padStart(2, '0') + '-M';
        const arr = vbMappData[domain]?.[key] || [];
        if (!arr.length) return null;
        const subset = arr.slice(0, arr.length - 1);
        if (!subset.length) return null;
        const idx = Math.floor(Math.random() * subset.length);
        const item = subset[idx];
        return Object.values(item).map(v => String(v));
    }

    // 首次生成目标列表
    const [initialGoals] = useState(() => [
        {
            title: '复习目标',
            code: 'T' + (level - 1),
            description: getRandomOne('命名', level - 1),
        },
        {
            title: '新学习目标',
            code: 'T' + level,
            description: getRandomOne('命名', level),
        },
        {
            title: '自定义目标',
            code: '自定义',
            description: ['使用"你好""再见"等礼貌用词'],
        },
    ]);

    // 本地选中状态，优先恢复 saved，否则初始为空
    const [selectedGoals, setSelectedGoals] = useState(saved);

    // 如果全局 saved 为空，首次挂载后回调 initialGoals
    useEffect(() => {
        if (!saved.length) {
            setSelectedGoals([]);
            onSelectGoal?.([]);
        }
    }, []);

    // 点击切换选中/取消
    const handleGoalSelect = (goal) => {
        setSelectedGoals(prev => {
            const exists = prev.find(g => g.code === goal.code);
            let next;
            if (exists) {
                // 取消选中
                next = prev.filter(g => g.code !== goal.code);
            } else {
                // 新增选中
                next = [...prev, { ...goal }];
            }
            onSelectGoal?.(next);
            return next;
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>命名教学目标</Text>
            <Text style={styles.subTitle}>
                综合历史学习记录与儿童未掌握技能，推荐本堂课训练目标：
            </Text>
            <View style={styles.goalsContainer}>
                {initialGoals.map((goal, i) => {
                    const isSelected = selectedGoals.some(g => g.code === goal.code);
                    // 如果已保存并被选中，用 saved 中的 description
                    const savedItem = selectedGoals.find(g => g.code === goal.code);
                    const description = savedItem?.description || goal.description;
                    return (
                        <GoalSection
                            key={goal.code}
                            title={goal.title}
                            code={goal.code}
                            description={description}
                            selected={isSelected}
                            onPress={updatedDesc =>
                                handleGoalSelect({ ...goal, description: updatedDesc })
                            }
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        marginTop: 16,
        width: '100%',
        maxWidth: 1029,
        paddingHorizontal: 49,
        paddingTop: 51,
        paddingBottom: 137,
        alignItems: 'center',
    },
    mainTitle: {
        marginTop: 20,
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
    },
    subTitle: {
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 16,
        fontWeight: '400',
        marginTop: 13,
    },
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        marginTop: 30,
        width: '100%',
        paddingHorizontal: 10,
    },
});

export default Naming;
