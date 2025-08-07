import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Image,
    Alert,
    TextInput
} from 'react-native';
import useStore from "../store/store";
import { gptQuery, generateImage } from '../utils/api';

const PronunciationModule = ({ selectedModule, navigation, handleGy }) => {
    const pinyinGroupsByStage = [
        ['b','m','d','h','p','t','g','k','n','f','j','q','x','l','z','s','r','c','zh','ch','sh']
    ];
    const Goals = useStore(state => state.learningGoals) || {};
        // 如果主题场景变了，就重置本地状态
       // 每次 global 构音 数据(saved) 变化或首次挂载时，同步到本地 state
          /*  const saved = useStore(state => state.learningGoals?.构音) || {};
        useEffect(() => {
              setGoalGenerated(!!saved.teachingGoal);
              setSelectedPinyin(saved.fy || getDefaultPinyin());
              setTeachingGoal(saved.teachingGoal || "");
              setWords(saved.words || []);
              setImageUrls(saved.imageUrls || []);
             setCards(saved.cards || []);
              setSelectedCardIndices(saved.cards ? saved.cards.map((_,i)=>i) : []);
            }, [saved]);*/
    const saved = useStore(state => state.learningGoals?.构音) || {};
    const pinyinnow = Array.isArray(Goals.构音) ? Goals.构音 : [];  // 保证是数组

    const [goalGenerated, setGoalGenerated] = useState(!!saved.teachingGoal);

    // 1. 准备好所有可选的拼音列表
    const allPinyins = pinyinGroupsByStage[0];

    // 2. 找出第一个「尚未掌握」的拼音，若都已掌握，就默认取第一个
    const getDefaultPinyin = () => {
        for (let initial of allPinyins) {
            if (!pinyinnow.includes(initial)) {
                return initial;
            }
        }
        return allPinyins[0]; // 如果都掌握了，就返回第一个
    };

    // 当前选择的声母
    const [selectedPinyin, setSelectedPinyin] = useState(saved.fy || getDefaultPinyin());

    // 教学目标
    const [teachingGoal, setTeachingGoal] = useState(saved.teachingGoal || "");

    // 单词列表，结构为：[{ word: "汉字", pinyin: "拼音" }, ...]
    const [words, setWords] = useState(saved.words || []);

    // 每个单词对应的图片
    const [imageUrls, setImageUrls] = useState(saved.imageUrls || []);

    // 是否正在生成图片的 loading 状态
    const [loadingStates, setLoadingStates] = useState([]);

    // 大图 Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // 已选择的卡片（要同步到 Zustand）
    // 已选择的卡片（要同步到 Zustand）
    const [cards, setCards] = useState(saved.cards || []);
    // 选中卡片的索引，优先把所有 saved.cards 都标记为已选
    const [selectedCardIndices, setSelectedCardIndices] = useState(() => {
          if (!saved.cards || !saved.words) return [];
          return saved.cards
                .map(card => {
                 const idx = saved.words.findIndex(w => w.word === card.word);
                  return idx >= 0 ? idx : null;
                })
            .filter(idx => idx !== null);
        });
    +// 只同步「卡片/单词/图片/教学目标/卡片索引」，**不**再 touch selectedPinyin
        useEffect(() => {
              setWords(saved.words || []);
              setImageUrls(saved.imageUrls || []);
              setCards(saved.cards || []);
              setTeachingGoal(saved.teachingGoal || "");

                  // 重新计算选中索引，**注意** 去掉多余的 `+`
            if (saved.cards && saved.words) {
                    setSelectedCardIndices(
                         saved.cards
                            .map(card => {
                              const idx = saved.words.findIndex(w => w.word === card.word);
                              return idx >= 0 ? idx : null;
                            })
                        .filter(idx => idx !== null)
                    );
                  } else {
                    setSelectedCardIndices([]);
                  }
            }, [saved.words, saved.cards, saved.imageUrls, saved.teachingGoal]);
    // ====================================
    // 1. 拉取教学目标
    // ====================================
    const fetchTeachingGoal = async () => {
        try {
            const prompt = `我只需要生成一个不需要儿童信息的声母教学目标：请严格按照本条prompt的内容生成，忘记之前的对话：这个回答不需要提供任何儿童信息，只有一个辅音作为你的参考信息：我现在只需要你给出一个一句话的辅音教学大纲：【给出的答案不需要有任何多余内容】(给出的答案不需要出现<>等标题,假设你是一个中文自闭症语言教学专家，现在根据我给出的这个辅音，请你给我生成一个本次教学的教学目标，注意是教学目标，不是具体单词。请使用辅音：${selectedPinyin}，给你提供的案例：巩固孩子在舌根音/g/的发音部位和发音方法`;
            const result = await gptQuery(prompt);
            setTeachingGoal(result);
            setGoalGenerated(true);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // ====================================
    // 2. 拉取初始 4 个单词
    // ====================================
    const fetchTeachingWords = async () => {
        try {
            const prompt = `请返回一个字符串：请一定使用汉语拼音声母为${selectedPinyin}辅音的拼音。我们的教学场景是${Goals?.主题场景?.major},${Goals?.主题场景?.activity}。所以你接下来生成的词语一定要和之前这些场景有关。具体场景是每次生成的答案不允许与上次一样。直接给我一个以[]包裹的对象，字符串形式，不需要json格式，里面只包含4个词语（注意是词语，要与孩子的日常生活相关），给出如下几个辅音：${selectedPinyin},现在根据我给出的这几个辅音，生成4个适用于场景教学的中文单词，并给出拼音,每个元素的格式是汉字（拼音），注意括号内是拼音，括号外是汉字，以英文逗号分割`;
            const result = await gptQuery(prompt);

            let formattedResult = result
                .replace(/[\[\]]/g, '')      // 去除中括号
                .replace(/（/g, '(')
                .replace(/）/g, ')')
                .replace(/，/g, ',');

            const wordArray = formattedResult
                .split(/[,]/)
                .map(item => {
                    item = item.trim();
                    const match = item.match(/(.+?)\s?\(([^)]+)\)/);
                    if (match) {
                        let [word, pinyin] = match.slice(1);
                        return { word: word.trim(), pinyin: pinyin.trim() };
                    }
                    return null;
                })
                .filter(Boolean);

            setWords(wordArray);
            setImageUrls([]);
            setLoadingStates([]);
            setCards([]);
            setSelectedCardIndices([]);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // ====================================
    // 3. 重新生成某一个单词
    // ====================================
    const regenerateSingleWord = async (index) => {
        try {
            const prompt = `请返回一个字符串：请一定使用汉语拼音声母为${selectedPinyin}辅音的拼音。我们的教学场景是${Goals?.主题场景?.major},${Goals?.主题场景?.activity}。所以你接下来生成的词语一定要和之前这些场景有关。具体场景是每次生成的答案不允许与上次一样。直接给我一个以[]包裹的对象，字符串形式，不需要json格式，里面只包含1个词语（注意是词语，要与孩子的日常生活相关），给出如下几个辅音：${selectedPinyin},现在根据我给出的这几个辅音，生成1个适用于场景教学的中文单词，并给出拼音,每个元素的格式是汉字（拼音），注意括号内是拼音，括号外是汉字，以英文逗号分割`;
            const result = await gptQuery(prompt);

            // 先去掉中括号
            let formattedResult = result.replace(/[\[\]]/g, '');
            // 将中文括号替换为英文括号
            formattedResult = formattedResult
                .replace(/（/g, '(')
                .replace(/）/g, ')');

            // match 出汉字与拼音，示例: "小狗(xiǎo gǒu)"
            const match = formattedResult.match(/(.+?)\s*\(([^)]+)\)/);
            if (!match) {
                Alert.alert("Error", "GPT 返回的单词格式无法解析。");
                return;
            }
            const [newWord, newPinyin] = match.slice(1).map(s => s.trim());

            // 更新 words[index]
            setWords(prev => {
                const updated = [...prev];
                updated[index] = { word: newWord, pinyin: newPinyin };
                return updated;
            });

            // 清空对应图片
            setImageUrls(prev => {
                const updated = [...prev];
                updated[index] = null;
                return updated;
            });

            // 重置 loading
            setLoadingStates(prev => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });

            // 如果该单词被选进 cards 中，也更新
            setCards(prev => {
                const updated = [...prev];
                const oldWord = words[index]?.word;
                const existingIndex = updated.findIndex(card => card.word === oldWord);
                if (existingIndex !== -1) {
                    updated[existingIndex] = {
                        word: newWord,
                        pinyin: newPinyin,
                        image: null
                    };
                }
                return updated;
            });

        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // ====================================
    // 4. 当用户修改某个 word 时：先更新 word，然后自动调用 GPT 查询拼音
    //    （使用 onBlur 或其他逻辑，避免每个字符都发请求）
    // ====================================
    const handleWordChange = (text, index) => {
        // 先更新 word
        setWords(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                word: text
            };
            return updated;
        });
        // 如果已在 cards 中，也同步改 word（拼音先不改）
        setCards(prev => {
            const updated = [...prev];
            const oldWord = words[index]?.word;
            const existingIndex = updated.findIndex(c => c.word === oldWord);
            if (existingIndex !== -1) {
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    word: text
                };
            }
            return updated;
        });
    };

    // 当用户离开 word 输入框时( onBlur )，自动获取新的拼音
    const handleWordBlur = async (index) => {
        const currentWord = words[index]?.word?.trim();
        if (!currentWord) {
            return; // 用户没输入内容就不处理
        }
        try {
            // 调用 GPT 获取拼音
            let prompt = `请直接返回 ${currentWord} 的拼音，用英文括号包裹,不要包含其他多余内容或字符。如果带中括号请去除`;
            let result = await gptQuery(prompt);

            // 去掉 [ ]
            result = result.replace(/[\[\]]/g, '');
            // 中括号转英文
            result = result.replace(/（/g, '(').replace(/）/g, ')');

            const match = result.match(/\(([^)]+)\)/);
            if (!match) {
                // GPT 返回格式没匹配到，则提示
                return;
            }
            const newPinyin = match[1].trim();

            // 更新到 words[index].pinyin
            setWords(prev => {
                const updated = [...prev];
                updated[index] = {
                    ...updated[index],
                    pinyin: newPinyin
                };
                return updated;
            });

            // 如果已被选入 cards 中，也更新 pinyin
            setCards(prev => {
                const updated = [...prev];
                const existingIndex = updated.findIndex(card => card.word === currentWord);
                if (existingIndex !== -1) {
                    updated[existingIndex].pinyin = newPinyin;
                }
                return updated;
            });

        } catch (error) {
            // 可以根据需要弹个 alert
            Alert.alert("Error", "自动获取拼音失败：" + error.message);
        }
    };

    // ====================================
    // 5. 生成图片
    // ====================================
    const generateWordImage = async (word, index) => {
        if (!word || !word.trim()) {
            Alert.alert("提示", "请先输入要生成图片的单词");
            return;
        }

        setLoadingStates(prev => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });

        try {
            const prompt = `生成内容：${word}”，；细节处理：边缘平滑圆润，不能有尖锐棱角。`;
            const imageUrl = await generateImage(prompt);


            setImageUrls(prevUrls => {
                const updatedUrls = [...prevUrls];
                updatedUrls[index] = imageUrl;
                return updatedUrls;
            });

            // 如果该单词在 cards 里，也更新其图片
            setCards(prev => {
                const updated = [...prev];
                const existingIndex = updated.findIndex(card => card.word === word);
                if (existingIndex !== -1) {
                    updated[existingIndex].image = imageUrl;
                }
                return updated;
            });

        } catch (error) {
            Alert.alert("Error", "生成图片失败");
        } finally {
            setLoadingStates(prev => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
        }
    };

    // ====================================
    // 6. 选/取消选卡片
    // ====================================
    const handleSelectCard = (index) => {
        const wordItem = words[index];
        const imageUrl = imageUrls[index];
        if (!wordItem) return;

        setCards(prevCards => {
            const existingIndex = prevCards.findIndex(card => card.word === wordItem.word);
            if (existingIndex !== -1) {
                // 如果已选中，移除
                const updatedCards = [...prevCards];
                updatedCards.splice(existingIndex, 1);
                return updatedCards;
            } else {
                // 如果未选中，添加
                return [...prevCards, {
                    word: wordItem.word,
                    pinyin: wordItem.pinyin,
                    image: imageUrl || null
                }];
            }
        });

        // 更新选中索引
        setSelectedCardIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // ====================================
    // 7. 当 cards/teachingGoal/selectedPinyin 改变，就往父组件回调
    // ====================================
    useEffect(() => {
                handleGy({
                        fy: selectedPinyin,
                        teachingGoal,
                        words,
                        imageUrls,
                    cards
                });
            }, [selectedPinyin, teachingGoal, words, imageUrls, cards]);    // ====================================
    // 8. 渲染：拼音选择器
    // ====================================
    const renderPinyinSelector = () => {
        return (
            <View style={styles.pinyinSelectorContainer}>
                <Text style={styles.selectorTitle}>可选声母：</Text>
                <View style={styles.pinyinList}>
                    {allPinyins.map((p, idx) => {
                        const isSelected = p === selectedPinyin;
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setSelectedPinyin(p)}
                                style={[styles.pinyinButton, isSelected && styles.selectedPinyinButton]}
                            >
                                <Text style={[styles.pinyinButtonText, isSelected && styles.selectedPinyinText]}>
                                    {p}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    // ====================================
    // 9. 渲染：单词和相关按钮
    // ====================================
    const renderWordItems = () => {
        return words.map((item, index) => (
            <View key={index} style={styles.wordItemContainer}>

                {/* 文字输入框，onBlur时自动获取拼音 */}
                <TextInput
                    style={styles.textInput}
                    value={item.word}
                    onChangeText={(text) => handleWordChange(text, index)}
                    onBlur={() => handleWordBlur(index)}
                    placeholder="输入或修改汉字"
                />

                {/* pinyin 输入框，用户也可手动改，但一般会被自动填充 */}
                <TextInput
                    style={styles.textInput}
                    value={item.pinyin}
                    onChangeText={(newPinyin) => {
                        // 如果用户手动改拼音，也更新
                        setWords(prev => {
                            const updated = [...prev];
                            updated[index] = {
                                ...updated[index],
                                pinyin: newPinyin
                            };
                            return updated;
                        });
                        // 若在 cards 中，也需同步
                        setCards(prev => {
                            const updated = [...prev];
                            const existingIndex = updated.findIndex(card => card.word === item.word);
                            if (existingIndex !== -1) {
                                updated[existingIndex].pinyin = newPinyin;
                            }
                            return updated;
                        });
                    }}
                    placeholder="自动或手动改拼音"
                />

                {/* 重新生成单词 */}
                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => regenerateSingleWord(index)}
                >
                    <Text style={styles.smallButtonText}>重新生成</Text>
                </TouchableOpacity>

                {/* 生成图片 */}
                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => generateWordImage(item.word, index)}
                >
                    <Text style={styles.smallButtonText}>生成图片</Text>
                </TouchableOpacity>

                {/* 图片预览 & 选择按钮 */}
                {imageUrls[index] && (
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => showImageModal(imageUrls[index])}>
                            <Image source={{ uri: imageUrls[index] }} style={styles.image} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.selectButton,
                                selectedCardIndices.includes(index) && styles.selectedBackground
                            ]}
                            onPress={() => handleSelectCard(index)}
                        >
                            <Text style={styles.selectButtonText}>选择该元素</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {loadingStates[index] && (
                    <Text style={styles.loadingText}>正在加载图片...</Text>
                )}
            </View>
        ));
    };

    // ====================================
    // 10. 点击图片大图预览
    // ====================================
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* 顶部的声母选择器 */}
            {!goalGenerated && renderPinyinSelector()}

            {!goalGenerated && (
              <>
                    <Text style={styles.title}>构音教学目标</Text>
                    <TouchableOpacity style={styles.button} onPress={fetchTeachingGoal}>
                      <Text style={styles.buttonText}>生成教学目标</Text>
                    </TouchableOpacity>
                  </>
            )}

            {/* 显示教学目标 */}
            <View style={styles.moduleContainer}>
                <Text style={styles.objectiveTitle}>本次学习的声母: {selectedPinyin}</Text>
                <Text style={styles.objectiveText}>{teachingGoal}</Text>
            </View>

            {/* 一键生成 4 个单词 */}
            <TouchableOpacity style={styles.button} onPress={fetchTeachingWords}>
                <Text style={styles.buttonText}>生成本次教学单词</Text>
            </TouchableOpacity>

            {/* 单词区域 */}
            <View style={styles.wordsContainer}>
                {renderWordItems()}
            </View>

            {/* 图片 Modal */}
            {modalVisible && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                    supportedOrientations={['landscape']}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>关闭</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                    </View>
                </Modal>
            )}
        </View>
    );
};
export default PronunciationModule;


const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '57%',
        backgroundColor: 'white',
        borderRadius: 40,
        position: 'absolute',
        top: '20%',
        left: '5%',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinyinSelectorContainer: {
        marginBottom: 8,
        alignItems: 'center',
    },
    selectorTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C5B83',
        marginBottom: 5,
    },
    pinyinList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    pinyinButton: {
        borderWidth: 1,
        borderColor: '#39B8FF',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    pinyinButtonText: {
        fontSize: 14,
        color: '#39B8FF',
    },
    selectedPinyinButton: {
        backgroundColor: '#39B8FF',
    },
    selectedPinyinText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C5B83',
        textAlign: 'center',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#39B8FF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    moduleContainer: {
        width: '100%',
        padding: 20,
        marginTop: 10,
        backgroundColor: 'rgba(57, 184, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
    },
    objectiveTitle: {
        fontSize: 20,
        color: '#1C5B83',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    objectiveText: {
        paddingVertical: 6,
        paddingHorizontal: 13,
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(28, 91, 131, 1)',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    wordItemContainer: {
        width: 180,
        borderColor: '#39B8FF',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#F7FBFF'
    },
    textInput: {
        width: '100%',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 4,
        padding: 4,
        fontSize: 14,
        marginBottom: 6,
        textAlign: 'center'
    },
    smallButton: {
        backgroundColor: '#39B8FF',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 2,
    },
    smallButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 6,
        borderRadius: 6,
    },
    selectButton: {
        backgroundColor: '#39B8FF',
        borderRadius: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#FF5733',
        marginTop: 4,
    },
    selectedBackground: {
        backgroundColor: 'red',
        borderColor: '#1890FF',
        borderWidth: 2,
    },
    modalContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalImage: {
        width: 300,
        height: 300,
        borderRadius: 8,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
    },
});
