import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import useStore from '../store/store';
import { gptQuery } from '../utils/api';

/* ─── 静态环境库 ─────────────────────────────────── */
const environmentData = require('../Knowledge/Environment.json');
const allThemes = Object.keys(environmentData);

/* ─── 主组件 ─────────────────────────────────────── */
const ThemeSelection = ({ selectedBox, handleSelectBox, handleSelectMajor }) => {
    const { currentChildren, themeCache, setThemeCache } = useStore();
    const { reinforcements = [] } = currentChildren || {};

    /* ========= 左栏：随机 3 张（始终从 cache 恢复） ========= */
    const [randomThemes, setRandomThemes] = useState(
        themeCache.randomThemes ?? getRandomThemes()
    );
    useEffect(() => {
        setThemeCache({ randomThemes });              // 任何变动都写 cache
    }, [randomThemes]);

    /* ========= 中栏：兴趣 3 张（GPT 或 cache） ========= */
    const [interestThemes, setInterestThemes] = useState(
        themeCache.interestThemes ?? []
    );
    const [loadingGen, setLoadingGen] = useState(false);

    /* ========= 右栏：自由主题输入 ========= */
    const [freeThemeText, setFreeThemeText] = useState(
        themeCache.freeThemeText ?? ''
    );

    /* ─── 工具函数 ─────────────────────────── */
    function getRandomThemes() {
        const copy = [...allThemes].sort(() => 0.5 - Math.random());
        return copy.slice(0, 3);
    }

    const pickReinforcements = () => {
        const copy = [...reinforcements].sort(() => 0.5 - Math.random());
        return copy.slice(0, 3).map((r) => r.value);
    };

    const generateInterestThemes = async (reinArr) => {
        setLoadingGen(true);
        Alert.alert('提示', '正在根据儿童强化物生成场景，请稍后');
        const prompt = `你是一位儿童教育专家，请根据以下强化物生成对应的儿童教学场景名称，每个场景名称用中文括号注明强化物，直接返回包含三个场景名称的数组字符串，不要任何解释和额外内容。例如：['超市购物（苹果）', '汽车大赛（小汽车）', '户外游戏（丢手绢）']。强化物列表：${reinArr.join(', ')}`;

        try {
            const resp = await gptQuery(prompt);
            let list = [];
            try {
                list = JSON.parse(resp.replace(/'/g, '"'));
            } catch {}
            if (!Array.isArray(list) || list.length !== 3) {
                list = reinArr.map((r) => `${r}主题`).slice(0, 3);
            }
            return list;
        } catch {
            return reinArr.map((r) => `自定义场景（${r}）`).slice(0, 3);
        } finally {
            setLoadingGen(false);
        }
    };

    /* ─── 首次挂载：若无 cache 则生成兴趣主题 ─── */
    useEffect(() => {
        (async () => {
            if (reinforcements.length < 3 || themeCache.interestThemes) return;
            const picked = pickReinforcements();
            const themes = await generateInterestThemes(picked);
            setInterestThemes(themes);
            setThemeCache({ interestThemes: themes });
        })();
    }, [reinforcements]);

    /* ─── 自由主题文本同步 cache ─── */
    const onFreeTextChange = (txt) => {
        setFreeThemeText(txt);
        setThemeCache({ freeThemeText: txt });
        if (selectedBox === '自由主题') handleSelectMajor(txt);
    };

    /* ─── Reselect handlers ─── */
    const reselectRandom = () => {
        const list = getRandomThemes();
        setRandomThemes(list);
    };

    const regenerateInterest = async () => {
        if (loadingGen) return;
        const picked = pickReinforcements();
        const themes = await generateInterestThemes(picked);
        setInterestThemes(themes);
        setThemeCache({ interestThemes: themes });
    };

    /* ─── 首次挂载：恢复选中状态 ─── */
    useEffect(() => {
        if (themeCache.selectedBox) handleSelectBox(themeCache.selectedBox);
        if (themeCache.selectedMajor) handleSelectMajor(themeCache.selectedMajor);
    }, []);

    /* ─── 渲染 ───────────────────────────────── */
    return (
        <View style={styles.container}>
            {/* 左栏：综合学习主题 */}
            <Column title="综合学习主题">
                {randomThemes.map((txt, i) => (
                    <Card
                        key={i}
                        text={txt}
                        selected={selectedBox === `综合学习主题-${i}`}
                        onPress={() => {
                            handleSelectBox(`综合学习主题-${i}`);
                            handleSelectMajor(txt);
                            setThemeCache({
                                selectedBox: `综合学习主题-${i}`,
                                selectedMajor: txt,
                            });
                        }}
                    />
                ))}
                <ReselectBtn onPress={reselectRandom} />
            </Column>

            {/* 中栏：兴趣主题 */}
            <Column title="儿童兴趣主题">
                {loadingGen ? (
                    <ActivityIndicator size="large" color="#1C5B83" style={{ marginTop: 24 }} />
                ) : (
                    interestThemes.map((txt, i) => (
                        <Card
                            key={i}
                            text={txt}
                            selected={selectedBox === `儿童兴趣主题-${i}`}
                            onPress={() => {
                                handleSelectBox(`儿童兴趣主题-${i}`);
                                handleSelectMajor(txt);
                                setThemeCache({
                                    selectedBox: `儿童兴趣主题-${i}`,
                                    selectedMajor: txt,
                                });
                            }}
                        />
                    ))
                )}
                <ReselectBtn onPress={regenerateInterest} disabled={loadingGen} />
            </Column>

            {/* 右栏：自由主题 */}
            <Column title="自由主题">
                <TextInput
                    style={[
                        styles.inputBox,
                        selectedBox === '自由主题' && styles.selectedBox,
                    ]}
                    multiline
                    placeholder="请输入内容"
                    value={freeThemeText}
                    onChangeText={onFreeTextChange}
                    onFocus={() => {
                        handleSelectBox('自由主题');
                        handleSelectMajor(freeThemeText);
                        setThemeCache({
                            selectedBox: '自由主题',
                            selectedMajor: freeThemeText,
                        });
                    }}
                />
            </Column>
        </View>
    );
};

/* ─── 小组件 ───────────────────────────── */
const Column = ({ title, children }) => (
    <View style={styles.column}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.group}>{children}</View>
    </View>
);

const Card = ({ text, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.card, selected && styles.selectedBox]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Text style={styles.cardText}>{text}</Text>
    </TouchableOpacity>
);

const ReselectBtn = ({ onPress, disabled }) => (
    <TouchableOpacity
        style={[styles.reselectBtn, disabled && { opacity: 0.5 }]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.reselectTxt}>重新选择</Text>
    </TouchableOpacity>
);

/* ─── 样式 ─────────────────────────────── */
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '33%',
        left: '5%',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: { width: '30%', alignItems: 'center' },
    title: {
        fontSize: 19,
        fontWeight: '500',
        color: '#1C5B83',
        marginBottom: 6,
    },
    group: { alignItems: 'center', marginTop: 4 },
    card: {
        width: 220,
        height: 65,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
        shadowOpacity: 1,
    },
    selectedBox: { backgroundColor: '#A2D7FF' },
    cardText: { fontSize: 18, color: '#1C5B83', textAlign: 'center' },
    inputBox: {
        width: 200,
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        marginTop: 10,
    },
    reselectBtn: {
        marginTop: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#1C5B83',
        borderRadius: 5,
    },
    reselectTxt: { color: '#fff', fontSize: 14, fontWeight: '500' },
});

export default ThemeSelection;
