import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';

// 如果需要真机拍照，可引入 camera 方法：
// import { launchCamera } from 'react-native-image-picker';

import useStore from '../store/store';
import { useNavigation } from '@react-navigation/native';
import PinyinSelector from '../components/PinyinSelector';
import { changeChildrenInfo } from "../services/api";
import ImagePicker from "./ImagePicker.jsx"

const CreateChildren = () => {
  const navigation = useNavigation();
  const currentChildren = useStore((state) => state.currentChildren);
  const setCurrentChildren = useStore((state) => state.setCurrentChildren);

  // =============== 表单状态 ===============
  const [name, setName] = useState(currentChildren?.name || '');
  const [age, setAge] = useState(currentChildren?.age?.toString() || '');
  const [gender, setGender] = useState(currentChildren?.gender || '');
  const [courseDuration, setCourseDuration] = useState(
      currentChildren?.courseDuration?.toString() || ''
  );
  const [reinforcements, setReinforcements] = useState(
      currentChildren?.reinforcements || []
  );
  const [naming, setNaming] = useState(currentChildren?.['命名']?.toString() || '');
  const [languageStructure, setLanguageStructure] = useState(
      currentChildren?.['语言结构']?.toString() || ''
  );
  const [dialogue, setDialogue] = useState(currentChildren?.['对话']?.toString() || '');
  const [selectedInitials, setSelectedInitials] = useState(
      currentChildren?.selectedInitials || []
  );
  const [imageStyle, setImageStyle] = useState(currentChildren?.imageStyle || '');
  const [base64Image, setBase64Image] = useState('');
  // 图片占位
  const [childImage, setChildImage] = useState(currentChildren?.childImage || '');
  useEffect(() => {
    return () => {
      console.log(currentChildren);
    };
  },[]);

  // =============== 强化物逻辑 ===============
  // 每条新 Reinforcement 带上 categoryIndex，避免删除串行
  const addReinforcement = (categoryIndex) => {
    const itemsInCat = reinforcements.filter(
        (r) => r.categoryIndex === categoryIndex
    );
    if (itemsInCat.length >= 3) {
      Alert.alert('提示', '每个分类最多只能添加 3 个强化物');
      return;
    }
    setReinforcements([
      ...reinforcements,
      { id: Date.now(), value: '', categoryIndex },
    ]);
  };
  const removeReinforcement = (id) => {
    setReinforcements(reinforcements.filter((item) => item.id !== id));
  };
  const updateReinforcement = (id, value) => {
    const updated = reinforcements.map((item) =>
        item.id === id ? { ...item, value } : item
    );
    setReinforcements(updated);
  };

  // =============== 上传头像逻辑 (仅示例) ===============
  const handleOpenCamera = () => {
    // 若需要真机拍照，可使用 react-native-image-picker:
    // launchCamera({ mediaType: 'photo' }, (res) => { ... })
    Alert.alert(
        '提示',
        '这里可以调用相机/相册逻辑，拍摄或选择图片后更新 childImage。'
    );
  };

  // =============== 提交 ===============
  const handleSubmit = async () => {
    if (!name || !age || !gender || !courseDuration) {
      Alert.alert("提示", "请填写完整信息");
      return;
    }
    const finalImage = base64Image || childImage || 'https://bkimg.cdn.bcebos.com/pic/9d82d158ccbf6c81800a010dc568a63533fa838bea82?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080';
    if (!finalImage) {
      Alert.alert("提示", "请先上传头像");
      return;
    }

    const formData = {
      name,
      age,
      gender,
      courseDuration,
      reinforcements,
      '命名': naming,
      '语言结构': languageStructure,
      '对话': dialogue,
      selectedInitials,
      childImage: finalImage, // ✅ 这里不会丢失已存的 childImage
      imageStyle
    };

    try {
      setCurrentChildren(formData);
      // ✅ 调用 API，提交儿童信息
      const result = await changeChildrenInfo(formData);

      // ✅ 存储到 Zustand，更新本地状态


      // ✅ 提示成功并跳转
      Alert.alert("成功", "儿童信息已提交！");
      navigation.replace("ChildProfileScreen");
    } catch (error) {
      Alert.alert("错误", error);
    }
  };

  const isSubmitDisabled = !name || !age || !gender || !courseDuration;

  // =============== 按分类渲染强化物 ===============
  const renderReinforcementsByCategoryIndex = (categoryIndex, title) => {
    const items = reinforcements.filter((r) => r.categoryIndex === categoryIndex);

    return (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <View style={styles.reinforcementContainer}>
            {items.map((item) => (
                <View key={item.id} style={styles.reinforcementItem}>
                  <TextInput
                      placeholder="输入强化物"
                      value={item.value}
                      onChangeText={(val) => updateReinforcement(item.id, val)}
                      style={styles.reinforcementInput}
                  />
                  {/* -号按钮 (红) */}
                  <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeReinforcement(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>-</Text>
                  </TouchableOpacity>
                </View>
            ))}

            {/* +号按钮 (蓝)；与 - 按钮大小一致 */}
            {items.length < 3 && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addReinforcement(categoryIndex)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}
          </View>
        </View>
    );
  };

  return (
      <ScrollView
          style={styles.outerContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.container}>
          {/* 左列 */}
          <View style={styles.leftColumn}>
            {/* 1. 上传头像卡片 */}
            <View style={[styles.card]}>
              <ImagePicker childImage={childImage} setChildImage={setChildImage} setBase64Image={setBase64Image} />

            </View>

            {/* 2. 个人信息 */}
            <View style={[styles.card]}>
              <Text style={styles.cardHeader}>个人信息</Text>
              {/* 姓名 + 年龄 */}
              <View style={styles.row}>
                <TextInput
                    placeholder="姓名"
                    value={name}
                    onChangeText={setName}
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                />
                <TextInput
                    placeholder="年龄"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={[styles.input, { flex: 1 }]}
                />
              </View>
              {/* 性别 + 课程周期 */}
              <View style={[styles.row, { marginTop: 10 }]}>
                <Text style={[styles.label, { marginRight: 5 }]}>性别:</Text>
                <View style={styles.radioGroup}>
                  <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setGender('male')}
                  >
                    <View
                        style={[
                          styles.radioCircle,
                          gender === 'male' && { borderColor: '#2980b9' },
                        ]}
                    >
                      {gender === 'male' && (
                          <View style={[styles.radioSelected, { backgroundColor: '#2980b9' }]} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>男</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={styles.radioOption}
                      onPress={() => setGender('female')}
                  >
                    <View
                        style={[
                          styles.radioCircle,
                          gender === 'female' && { borderColor: '#2980b9' },
                        ]}
                    >
                      {gender === 'female' && (
                          <View style={[styles.radioSelected, { backgroundColor: '#2980b9' }]} />
                      )}
                    </View>
                    <Text style={styles.radioLabel}>女</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                    placeholder="课程周期(周）"
                    value={courseDuration}
                    onChangeText={setCourseDuration}
                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                />

              </View>
            </View>
            <View style={styles.card}>
              <Text style={[styles.label, { marginRight: 5 }]}>图片风格:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setImageStyle('realistic')}
                >
                  <View
                      style={[
                        styles.radioCircle,
                        imageStyle === 'realistic' && { borderColor: '#2980b9' },
                      ]}
                  >
                    {imageStyle === 'realistic' && (
                        <View
                            style={[styles.radioSelected, { backgroundColor: '#2980b9' }]}
                        />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>写实风格</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setImageStyle('cartoon')}
                >
                  <View
                      style={[
                        styles.radioCircle,
                        imageStyle === 'cartoon' && { borderColor: '#2980b9' },
                      ]}
                  >
                    {imageStyle === 'cartoon' && (
                        <View
                            style={[styles.radioSelected, { backgroundColor: '#2980b9' }]}
                        />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>卡通风格</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* 3. 强化物偏好 */}
            <View style={[styles.card]}>
              <Text style={styles.cardHeader}>强化物偏好</Text>
              {renderReinforcementsByCategoryIndex(0, '实物类')}
              {renderReinforcementsByCategoryIndex(1, '食物类')}
              {renderReinforcementsByCategoryIndex(2, '活动类')}
              {renderReinforcementsByCategoryIndex(3, '感官类')}
              {renderReinforcementsByCategoryIndex(4, '社交类')}
            </View>
          </View>

          {/* 右列 */}
          <View style={styles.rightColumn}>
            {/* 里程碑记录 */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>里程碑记录</Text>
              {/* 示例：你也可以在这里放命名、语言结构、对话等输入框 */}
              <Text style={[styles.label, { marginTop: 8 }]}>命名</Text>
              <TextInput
                  placeholder="请输入数值"
                  value={naming}
                  onChangeText={setNaming}
                  style={[styles.input, { width: '60%' }]}
                  keyboardType="numeric"
              />
              <Text style={[styles.label, { marginTop: 8 }]}>语言结构</Text>
              <TextInput
                  placeholder="请输入数值"
                  value={languageStructure}
                  onChangeText={setLanguageStructure}
                  style={[styles.input, { width: '60%' }]}
                  keyboardType="numeric"
              />
              <Text style={[styles.label, { marginTop: 8 }]}>对话</Text>
              <TextInput
                  placeholder="请输入数值"
                  value={dialogue}
                  onChangeText={setDialogue}
                  style={[styles.input, { width: '60%' }]}
                  keyboardType="numeric"
              />
            </View>

            {/* 拼音组件 */}
            <View style={styles.card}>
              <Text style={styles.cardHeader}>已经掌握的声母</Text>
              <PinyinSelector
                  selectedInitials={selectedInitials}
                  onSelectedInitialsChange={setSelectedInitials}
                  maxCount={3}
              />
            </View>
          </View>
        </View>

        {/* 提交按钮 (随内容滚动) */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
              style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
              onPress={!isSubmitDisabled ? handleSubmit : null}
          >
            <Text style={styles.submitText}>提 交</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

export default CreateChildren;

// ========== 样式表 ==========

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#DBF6FF', // 页面底色
    paddingHorizontal: 20,
    paddingTop: 20,   // 上方留血线
  },
  container: {
    flexDirection: 'row',
    // 不使用 justifyContent: 'space-between'，让列宽固定
  },
  leftColumn: {
    flex: 0.5,
    marginRight: 10,
  },
  rightColumn: {
    flex: 0.5,
    marginLeft: 10,
  },

  // 各卡片背景统一用 #fff
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C5B83',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 6,
  },

  // 性别单选
  radioGroup: {
    flexDirection: 'row',
    marginLeft: 10,
    flex: 1,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },

  // 强化物分类标题
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  reinforcementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // 输入框 + 删除按钮
  reinforcementItem: {
    width: 140, // 输入框和 - 按钮一起的宽度
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  reinforcementInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 36,
    paddingHorizontal: 8,
    marginRight: 4,
  },
  // “+” 按钮 (蓝色)，与 “-” 保持相同大小
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2980b9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  // “-” 按钮 (红色)，大小与 + 相同
  deleteButton: {
    width: 40,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },

  // 上传头像
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

  // 提交按钮
  submitContainer: {
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#2980b9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
