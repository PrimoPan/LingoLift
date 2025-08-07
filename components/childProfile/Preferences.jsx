import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import useStore from '../../src/store/store';
import { generateImage } from "../../src/utils/api";
import { cacheImage } from "../../src/utils/imageCache";
import RNFetchBlob from 'rn-fetch-blob';
import { changeChildrenInfo } from "../../src/services/api";

const Preferences = () => {
  const { currentChildren } = useStore();
  const { reinforcements = [], imageStyle } = currentChildren || {};
  const [loadingMap, setLoadingMap] = useState({});
  const [localExistsMap, setLocalExistsMap] = useState({});

  // 处理图片生成
  const handleGenerateImages = async () => {
    try {
      // 找出没有 image 字段的条目需要生成图片
      const needGenerate = reinforcements.filter(item => !item.image);
      if (needGenerate.length === 0) return;

      // 设置加载状态
      setLoadingMap(prev => ({
        ...prev,
        ...needGenerate.reduce((acc, item) => {
          acc[item.id] = true;
          return acc;
        }, {})
      }));

      const generatePrompt = (itemValue, style) => {
        return `[教学专用]${style === 'realistic' ? '写实' : '卡通'}，图片主体为${itemValue}，
        用于自闭症儿童认知训练，要求：
        1. 空白纯色背景
        2. 无人物出现（必要情况需中国面孔）
        3. 线条简洁明确
        4. 色彩对比度高
        5. 避免复杂纹理
        6. 主体占画面70%以上
        7. 无文字/装饰元素`;
      };

      // =========== 这里改成顺序处理 ============
      const updated = [];
      for (const item of needGenerate) {
        try {
          const prompt = generatePrompt(item.value, imageStyle);
          const remoteUrl = await generateImage(prompt);

          if (remoteUrl === '0') {
            // 如果后端返回'0'或异常，可自行定义怎么处理
            updated.push(item);
            continue;
          }

          let localUri;
          try {
            localUri = await cacheImage(remoteUrl);
          } catch (e) {
            console.warn('Caching failed:', e);
            localUri = remoteUrl; // 回退到远端地址
          }

          updated.push({
            ...item,
            image: {
              uri: localUri,
              remote: remoteUrl,
            }
          });
        } catch (error) {
          console.error('生成失败:', item.value, error);
          updated.push(item);
        }
      }

      // 合并更新到 reinforcements
      const mergedMap = new Map(updated.map(item => [item.id, item]));
      const merged = reinforcements.map(originalItem =>
          mergedMap.get(originalItem.id) || originalItem
      );

      // 更新到 Zustand
      useStore.getState().setCurrentChildren({
        ...currentChildren,
        reinforcements: merged.filter(Boolean).map(i => ({
          ...i,
          image: i.image
              ? { uri: i.image.uri, remote: i.image.remote }
              : undefined
        }))
      });

      // 上传给后端时只带 remote，不带本地uri
      const childrenForUpload = {
        ...currentChildren,
        reinforcements: merged.map(i => ({
          ...i,
          // 这里只传给后端 remote 就可以了，本地 uri 留在客户端用
          image: i.image ? { remote: i.image.remote } : undefined
        }))
      };
      await changeChildrenInfo(childrenForUpload);

    } catch (error) {
      console.error('批量生成失败:', error);
    } finally {
      setLoadingMap({});
    }
  };


  // 当 reinforcements 或 imageStyle 变化时，自动生成图片
  useEffect(() => {
    if (reinforcements?.length > 0) {
      handleGenerateImages();
    }
  }, [reinforcements, imageStyle]);

  // 检查本地文件是否存在
  useEffect(() => {
    const checkLocalFiles = async () => {
      const newLocalExistsMap = {};
      for (const item of reinforcements) {
        // 如果有本地 uri，就检查一下
        const localUri = item.image?.uri;
        if (localUri && localUri.startsWith('file://')) {
          // 去掉 "file://" 后再给 fs.exists
          const pathWithoutPrefix = localUri.replace('file://', '');
          const exists = await RNFetchBlob.fs.exists(pathWithoutPrefix);
          newLocalExistsMap[item.id] = exists;
        } else {
          // 如果没有本地文件或者不是 file:// 开头，就标记 false
          newLocalExistsMap[item.id] = false;
        }
      }
      setLocalExistsMap(newLocalExistsMap);
    };

    checkLocalFiles();
  }, [reinforcements]);

  // 渲染单个强化物项
  const renderItem = ({ item }) => {
    const isLoading = loadingMap[item.id];
    const localExists = localExistsMap[item.id];

    return (
        <View style={styles.preferenceItem}>
          {isLoading ? (
              <View style={[styles.preferenceImage, styles.loadingPlaceholder]}>
                <ActivityIndicator color="#1C5B83" />
              </View>
          ) : (
              <>
                {localExists ? (
                    // 如果本地文件存在，则显示本地图片
                    <Image
                        source={{ uri: item.image?.uri }}
                        style={styles.preferenceImage}
                        resizeMode="contain"
                        onError={(error) => {
                          console.error('Image loading error (local):', error.nativeEvent.error);
                        }}
                    />
                ) : (
                    // 否则还是用远端地址
                    <Image
                        source={{ uri: item.image?.remote }}
                        style={styles.preferenceImage}
                        resizeMode="contain"
                        onError={(error) => {
                          console.error('Image loading error (remote):', error.nativeEvent.error);
                        }}
                    />
                )}
              </>
          )}
          <Text style={styles.preferenceName}>{item.value}</Text>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>强化物偏好</Text>
          <View style={styles.categories}>
            <Image
                source={{
                  uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ad43c22268b62846ee7aeb797a0018af60acc0b70c49dee5711449ac589a2061?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
                }}
                style={styles.categoryImage}
                resizeMode="contain"
            />
          </View>
        </View>
        <FlatList
            data={reinforcements}
            renderItem={renderItem}
            keyExtractor={item => (item?.id ? item.id.toString() : Math.random().toString())}
            numColumns={3}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={<Text style={styles.emptyText}>暂无强化物数据</Text>}
        />
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
  loadingPlaceholder: {
    backgroundColor: '#e1e9f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C5B83',
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 27,
  },
  row: {
    justifyContent: 'space-between',
  },
  preferenceItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  preferenceImage: {
    width: 123,
    height: 123,
    marginBottom: 6,
  },
  preferenceName: {
    fontSize: 15,
    color: '#257693',
    textAlign: 'center',
  },
});

export default Preferences;
