import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Text from './Text';
import { colors, spacing, borderRadius, shadows } from '../config/theme';

const ImagePickerComponent = ({ 
  images = [], 
  onChangeImages,
  error,
  touched,
}) => {
  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert('You need to enable permission to access the library');
    }
  };

  const selectImage = async () => {
    try {
      await requestPermission();
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.canceled) {
        onChangeImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.log('Error reading an image', error);
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChangeImages(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageList}
      >
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemove(index)}
            >
              <MaterialCommunityIcons 
                name="close-circle" 
                size={20} 
                color={colors.danger} 
              />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[
            styles.addButton,
            error && touched && styles.errorButton
          ]} 
          onPress={selectImage}
        >
          <MaterialCommunityIcons 
            name="camera-plus" 
            size={40} 
            color={colors.text.secondary} 
          />
        </TouchableOpacity>
      </ScrollView>
      
      {error && touched && (
        <Text variant="caption1" style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  imageList: {
    paddingVertical: spacing.s,
  },
  imageContainer: {
    marginRight: spacing.s,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.m,
  },
  removeButton: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: colors.white,
    borderRadius: 12,
    ...shadows.small,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.m,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  errorButton: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.xs,
    marginLeft: spacing.s,
  },
});

export default ImagePickerComponent;
