import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getChildrenList, getChildDetails } from '../services/api'; // ✅ 导入API
import useStore from '../store/store';

const ChildrenList = () => {
    const navigation = useNavigation();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setCurrentChildren } = useStore();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            setLoading(true);
            const response = await getChildrenList();
            setChildren(response.data);
        } catch (error) {
            console.error("❌ 获取儿童列表失败:", error);
            Alert.alert("错误", "无法获取儿童列表");
        } finally {
            setLoading(false);
        }
    };

    // **点击儿童，获取最新信息并跳转**
    const handleSelectChild = async (childName) => {
        try {
            const response = await getChildDetails(childName); // 从服务器获取详细信息
            setCurrentChildren(response.data); // ✅ 更新 Zustand 的 currentChildren
            navigation.navigate("CreateChildren"); // ✅ 跳转到 CreateChildren 组件
        } catch (error) {
            console.error("❌ 获取儿童详情失败:", error);
            Alert.alert("错误", "无法加载儿童信息");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.childCard}
            onPress={() => handleSelectChild(item.name)}
        >
            <Image
                source={item.childImage ? { uri: item.childImage } : ' ' }
                style={styles.childImage}
            />
            <View style={styles.childInfo}>
                <Text style={styles.childName}>{item.name}</Text>
                <Text style={styles.childText}>年龄: {item.age} 岁</Text>
                <Text style={styles.childText}>性别: {item.gender === 'male' ? '男孩' : '女孩'}</Text>
                <Text style={styles.childText}>课程周期: {item.courseDuration} 个月</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>儿童列表</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#1C5B83" />
            ) : (
                <FlatList
                    data={children}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}

            {/* ✅ 新建儿童按钮 - 固定到底部 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => {
                        setCurrentChildren({}); // ✅ 清空 currentChildren，进入新建模式
                        navigation.navigate("CreateChildren");
                    }}
                >
                    <Text style={styles.createButtonText}>创建儿童信息</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C5B83',
        textAlign: 'center',
        marginBottom: 20,
    },
    list: {
        paddingBottom: 100, // ✅ 确保按钮不会被遮挡
    },
    childCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    childImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        backgroundColor: '#ddd',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C5B83',
        marginBottom: 5,
    },
    childText: {
        fontSize: 14,
        color: '#333',
    },
    /* ✅ 按钮样式 */
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: '#1C5B83',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 25,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ChildrenList;
