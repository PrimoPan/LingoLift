import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import useStore from '../../src/store/store';
const MilestoneItem = ({ title, englishTitle, progress, backgroundColor }) => (
    <View style={styles.milestoneItem}>
      {/* Left side title */}
      <View style={[styles.milestoneTitle, { backgroundColor }]}>
        <Text style={styles.milestoneTitleText}>{englishTitle}</Text>
        <Text style={styles.milestoneTitleText}>{title}</Text>
      </View>

      {/* Right side progress container with white background */}
      <View style={styles.progressContainer}>
        {progress.month && (
            <Text style={styles.progressMonth}>{progress.month}</Text>
        )}
        <View style={styles.progressBars}>
          {progress.bars.map((filled, index) => (
              <View
                  key={index}
                  style={[
                    styles.progressBar,
                    filled
                        ? { backgroundColor } // Apply backgroundColor to filled bars
                        : styles.emptyBar,
                  ]}
              />
          ))}
        </View>
      </View>
    </View>
);

const LanguageMilestones = () => {
  const { currentChildren } = useStore();
  const { selectedInitials, 命名, 对话, 语言结构 } = currentChildren;

  const milestones = [
    {
      title: '构音',
      englishTitle: 'Articulation',
      progress: {
        month: `${selectedInitials.length}/21`,
        bars: Array.from({ length: 5 }, (_, i) =>
            i < Math.floor((selectedInitials.length / 21) * 5)
        )
      },
      backgroundColor: '#44DCF8'
    },
    {
      title: '命名',
      englishTitle: 'Tact',
      progress: {
        month: `${命名}-M`,
        bars: Array.from({ length: 5 }, (_, i) =>
            i < Math.min(Math.floor(命名 / 3), 5)
        )
      },
      backgroundColor: '#FCC40B'
    },
    {
      title: '语言结构',
      englishTitle: 'Linguistic Structure',
      progress: {
        month: `${语言结构}-M`,
        bars: Array.from({ length: 5 }, (_, i) =>
            i < Math.min(Math.floor(语言结构 / 3), 5)
        )
      },
      backgroundColor: '#FF7A69'
    },
    {
      title: '对话',
      englishTitle: 'Intraverbal',
      progress: {
        month: `${对话}-M`,
        bars: Array.from({ length: 5 }, (_, i) =>
            i < Math.min(Math.floor(对话 / 3), 5)
        )
      },
      backgroundColor: '#0ED89E'
    }
  ];

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
              source={{
                uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/cecd8f2bc5d9f8f7ecc17936c57a59b7d1bc1ee108e0517afb964889f4d5f5a9?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
              }}
              style={styles.headerIcon}
              resizeMode="contain"
          />
          <Text style={styles.headerTitle}>语言发展里程碑</Text>
        </View>
        {milestones.map((milestone, index) => (
            <MilestoneItem key={index} {...milestone} />
        ))}
        <Image
            source={{
              uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e26153b021fd76292320eaec8d39e93bd7b74ebe4d823637d2b2646c73f52bec?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
            }}
            style={styles.footerImage}
            resizeMode="contain"
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderRadius: 45,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 53,
    height: 53,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1C5B83',
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  milestoneTitle: {
    borderRadius: 20,
    padding: 10,
    width: 117,
    height: 117,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneTitleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Keep the background of the progress container white
    borderRadius: 20, // Make the progress container also rounded
    padding: 10, // Add some padding for better layout
    marginLeft: 10, // To separate the left and right sections
    flex: 1, // Make it take up remaining space
  },
  progressMonth: {
    color: '#1C5B83',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 10,
  },
  progressBars: {
    flexDirection: 'row',
    flex: 1, // Ensure bars take up remaining space
  },
  progressBar: {
    width: 28,
    height: 11,
    borderRadius: 11,
    marginHorizontal: 3,
  },
  filledBar: {
    // This is now controlled dynamically by backgroundColor from the props
  },
  emptyBar: {
    backgroundColor: '#E0E0E0',
  },
  footerImage: {
    width: 176,
    height: 57,
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default LanguageMilestones;
