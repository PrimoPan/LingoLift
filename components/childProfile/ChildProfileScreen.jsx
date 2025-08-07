import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    Text,
} from 'react-native';
import Header from './Header';
import PersonalInfo from './PersonalInfo';
import Preferences from './Preferences';
import LanguageMilestones from './LanguageMilestones';
import useStore from '../../src/store/store';
import ModalSelect from '../../src/ModelSelect/ModelSelect'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // ✅ 引入导航
const ChildProfileScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const initialStoreValue = useStore.getState().currentChildren || {};
    const setCurrentChildren = useStore((state) => state.setCurrentChildren);
    console.log(initialStoreValue);
    const handleGoToMainMenu = () => {
        setCurrentChildren({}); // ✅ 清空儿童信息
        navigation.navigate('ChildrenList'); // ✅ 返回主菜单页面
    };
    // Define the cards data
    const cards = [
        { id: '1', component: <PersonalInfo /> },
        { id: '2', component: <Preferences /> },
        { id: '3', component: <LanguageMilestones /> },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainContainer}>
                <FlatList
                    style={styles.container}
                    data={cards}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.card,
                                item.id === '2'
                                    ? styles.preferencesCard
                                    : item.id === '3'
                                        ? styles.milestonesCard
                                        : null,
                            ]}
                        >
                            {item.component}
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.contentContainer}
                />

                {/* "去备课" button at the bottom */}
                <View style={styles.buttonsRow}>
                    {/* 去备课 */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>去备课</Text>
                    </TouchableOpacity>

                    {/* 回到主菜单 */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleGoToMainMenu} // ✅ 调用清空 & 返回方法
                    >
                        <Text style={styles.buttonText}>回到主菜单</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalSelect visible={modalVisible} onClose={() => setModalVisible(false)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    preferencesCard: {
        minHeight: 180, // Ensure the card has a minimum height
    },
    milestonesCard: {
        minHeight: 300,
    },
    button: {
        backgroundColor: '#39B8FF',
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
});

export default ChildProfileScreen;
