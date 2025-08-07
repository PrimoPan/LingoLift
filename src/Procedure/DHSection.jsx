import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const GoalSection = ({ title, code, description, onPress }) => {
    const [isSelected, setIsSelected] = useState(false); // State to manage selection
    const [editableDescription, setEditableDescription] = useState(description); // State for editable description

    // Toggle selection on press
    const handlePress = () => {
        setIsSelected(!isSelected);
        if (onPress) {
            onPress(editableDescription);
        }
    };
    const handleDescriptionChange = (newDescription) => {
        setEditableDescription(newDescription);
        if (title === '自定义目标' && onPress) {
            // Update immediately when editing a custom goal
            onPress(newDescription);
        }
    };

    const isEditable = title === '自定义目标';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handlePress} style={styles.contentContainer}>
                <View
                    style={[
                        styles.codeContainer,
                        isSelected && styles.selectedCodeContainer, // Apply highlighter style if selected
                    ]}
                >
                    <Text style={styles.code}>{code}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    {isSelected && isEditable ? (
                        <TextInput
                            style={styles.description}
                            value={editableDescription}
                            onChangeText={handleDescriptionChange}
                            multiline
                            autoFocus
                        />
                    ) : (
                        <Text style={styles.description}>{editableDescription}</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '30%',
    },
    title: {
        color: 'rgba(28, 91, 131, 0.5)',
        fontSize: 16,
        fontFamily: 'PingFang SC, sans-serif',
        fontWeight: '400',
    },
    contentContainer: {
        borderRadius: 20,
        marginTop: 10,
        height: 83,
        backgroundColor: 'rgba(28, 91, 131, 0.1)',
        flexDirection: 'row',
    },
    codeContainer: {
        backgroundColor: 'rgba(28, 91, 131, 0.1)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 0,
        padding: 16,
        width: 83,
        height: 83,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedCodeContainer: {
        backgroundColor: '#0ED89E', // Brighter, more noticeable highlight color
    },
    code: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 18,
        fontWeight: '500',
    },
    descriptionContainer: {
        flex: 1,
        justifyContent: 'center', // Center text vertically
        paddingLeft: 12,
    },
    description: {
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 15,
        fontWeight: '400',
        textAlignVertical: 'center', // Ensure text is vertically centered in TextInput
        marginTop: 12,
    },
});

export default GoalSection;
