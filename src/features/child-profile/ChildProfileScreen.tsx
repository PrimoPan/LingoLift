import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import PersonalInfo from './PersonalInfo';
import Preferences from './Preferences';
import LanguageMilestones from './LanguageMilestones';
import useStore from '../../store/store';
import ModalSelect from '../../ModelSelect/ModelSelect';
import { useNavigation } from '@react-navigation/native';

type CardItem = {
  id: string;
  component: React.ReactElement;
};

const ChildProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<any>();
  const setCurrentChildren = useStore((state) => state.setCurrentChildren);

  const handleGoToMainMenu = () => {
    setCurrentChildren({});
    navigation.navigate('ChildrenList');
  };

  const cards: CardItem[] = [
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
                item.id === '2' ? styles.preferencesCard : item.id === '3' ? styles.milestonesCard : null,
              ]}
            >
              {item.component}
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
        />

        <View>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>去备课</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGoToMainMenu}>
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
    minHeight: 180,
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
