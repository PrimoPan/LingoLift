import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import useStore from '../../src/store/store';
import { useNavigation } from '@react-navigation/native';

const PersonalInfo = () => {
  const { name, gender, age, courseDuration, childImage } = useStore(state => state.currentChildren);
  const navigation = useNavigation();

  const handleEdit = () => {
    navigation.navigate('CreateChildren');
  };
  const handleViewHistory = () => {
    navigation.navigate("ChildHistory", { childName: name });
  };


  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Image
                source={{
                  uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/425f7d80c5d79dbf7a6422e839d7e43bf21d9b982b6eedb3a60ff72a4af109fd?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
                }}
                style={styles.titleIcon}
                resizeMode="contain"
            />
            <Text style={styles.title}>个人档案</Text>
          </View>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.editButton}>编辑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Image
              source={{
                uri: childImage?.trim() ? childImage : 'https://cdn.builder.io/api/v1/image/assets/TEMP/550e2eca923e4e9b0603a7508d1ead03c0c067db022fdb18b6140e1b3fb56ee8?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
              }}
              style={styles.profileImage}
              resizeMode="contain"
          />

          <View style={styles.details}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.info}>年龄 : {age} 岁</Text>
            <Text style={styles.info}>性别 : {gender === 'male' ? '男孩' : '女孩'}</Text>
          </View>

          <View style={styles.courseInfo}>
            <Text style={styles.info}>课程周期 ：{courseDuration} 个月</Text>
            <TouchableOpacity style={styles.viewRecordButton} onPress={handleViewHistory}>
              <Image
                  source={{
                    uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/119f2313bdff274e959a567224937a011560f7cbadaaf19a31b7135e1a159ea6?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
                  }}
                  style={styles.viewRecordIcon}
                  resizeMode="contain"
              />
              <Text style={styles.viewRecordText}
              >查看课程记录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    width: 37,
    height: 37,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1C5B83',
  },
  editButton: {
    fontSize: 15,
    color: '#1C5B83',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 119,
    height: 119,
    borderRadius: 10, // ✅ 圆角优化
    backgroundColor: '#E0E0E0', // ✅ 备用背景颜色，防止图片加载失败时显示空白
  },
  details: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: '600',
    color: '#1C5B83',
    marginBottom: 10,
  },
  info: {
    fontSize: 13,
    color: '#1C5B83',
    marginBottom: 5,
  },
  courseInfo: {
    justifyContent: 'flex-end',
  },
  viewRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 5,
    marginTop: 10,
  },
  viewRecordIcon: {
    width: 21,
    height: 21,
    marginRight: 5,
  },
  viewRecordText: {
    fontSize: 13,
    color: '#000000',
  },
});

export default PersonalInfo;
