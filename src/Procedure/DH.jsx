import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DHSection from './DHSection';
import useStore from "../store/store";
import vbMappData from '../Knowledge/VBMapp.json';

const DH = ({ onSelectGoal }) => {
    const currentChildren = useStore(state => state.currentChildren);
    const level = currentChildren?.对话;
    const [selectedGoals, setSelectedGoals] = useState([]);
    let goals = [
        {
            title: '复习目标',
            code: 'IV'+ (level-1),
            description: getRandomOne('对话',level-1),
        },
        {
            title: '新学习目标',
            code: 'IV'+(level),
            description: getRandomOne('对话',level),
        },
        {
            title: '自定义目标',
            code: '自定义',
            description: '使用"你好""再见"等礼貌用词',
        },
    ];
    function getRandomOne(domain, level) {
        const numericLevel = parseInt(level, 10);
        if (isNaN(numericLevel) || numericLevel < 1 || numericLevel > 15) {
            return null;
        }
        const levelKey = String(numericLevel).padStart(2, '0') + '-M';
        const items = vbMappData[domain]?.[levelKey];
        if (!items || items.length === 0) {
            return null;
        }
        const subset = items.slice(0, items.length - 1);
        if (subset.length === 0) {
            return null;
        }
        const randIndex = Math.floor(Math.random() * subset.length);
        const st = subset[randIndex];
        const valuesAsString = Object.values(st).map(value => String(value));
        return valuesAsString;
    }
    const handleGoalSelect = (goal) => {
        setSelectedGoals(prevSelected => {
            const index = prevSelected.findIndex(g => g.code === goal.code);
            const newSelected = [...prevSelected];
            if (index > -1) {
                // If goal is already selected, update it
                newSelected[index] = goal;
            } else {
                // If goal is not selected, add it
                newSelected.push(goal);
            }
            if (onSelectGoal) {
                onSelectGoal(newSelected);
            }
            return newSelected;
        });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>对话教学目标</Text>
            <Text style={styles.subTitle}>
                综合 历史学习记录 与 儿童未掌握技能 ，推荐您本堂课训练目标为：
            </Text>
            <View style={styles.goalsContainer}>
                {goals.map((goal, index) => (
                    <DHSection
                        key={index}
                        title={goal.title}
                        code={goal.code}
                        description={goal.description}
                        onPress={updatedDescription => handleGoalSelect({ ...goal, description: updatedDescription })}
                    />
                ))}
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

    /** 1. 标题向下移 20px */
    mainTitle: {
        marginTop: 20,                       // 新增
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 20,
        fontFamily: 'PingFang SC, sans-serif',
        fontWeight: '500',
        textAlign: 'center',
    },

    /** 2. 缩小副标题与目标区域之间的空隙 */
    subTitle: {
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 16,
        fontFamily: 'PingFang SC, sans-serif',
        fontWeight: '400',
        marginTop: 13,
    },

    /** 3. 三个目标水平排列更紧凑，避免超出卡片 */
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',     // 较紧凑的间距
        alignItems: 'flex-start',
        marginTop: 30,                      // 原 77 → 30
        width: '100%',
        paddingHorizontal: 10,              // 左右各收 10px
    },
});


export default DH;