import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, Platform, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import Text from './Text';
import { colors, spacing, borderRadius, shadows } from '../config/theme';

const CategoryPicker = ({ 
  items, 
  selectedItem, 
  onSelectItem,
  error,
  touched,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const CategoryItem = ({ item, onPress, selected }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selected && styles.selectedCategoryItem
      ]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
        <MaterialCommunityIcons name={item.icon} size={20} color={colors.white} />
      </View>
      <Text 
        variant="body"
        weight={selected ? "semibold" : "regular"}
        style={[
          styles.categoryLabel,
          selected && styles.selectedCategoryLabel
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity 
        style={[
          styles.container,
          error && touched && styles.errorContainer
        ]} 
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.preview}>
          {selectedItem ? (
            <>
              <View style={[styles.iconContainer, { backgroundColor: selectedItem.backgroundColor }]}>
                <MaterialCommunityIcons 
                  name={selectedItem.icon} 
                  size={20} 
                  color={colors.white} 
                />
              </View>
              <Text variant="body" style={styles.selectedText}>
                {selectedItem.label}
              </Text>
            </>
          ) : (
            <Text variant="body" style={styles.placeholder}>
              Select Category
            </Text>
          )}
        </View>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={20} 
          color={colors.text.secondary} 
        />
      </TouchableOpacity>
      {error && touched && (
        <Text variant="caption1" style={styles.errorText}>
          {error}
        </Text>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="headline" weight="semibold">
                Select Category
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={24} 
                  color={colors.text.primary} 
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <CategoryItem
                  item={item}
                  selected={selectedItem?.value === item.value}
                  onPress={() => {
                    onSelectItem(item);
                    setModalVisible(false);
                  }}
                />
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    flexDirection: 'row',
    padding: spacing.s,
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.small,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    marginLeft: spacing.s,
    color: colors.text.primary,
  },
  placeholder: {
    color: colors.text.secondary,
  },
  errorContainer: {
    borderColor: colors.danger,
    borderWidth: 1,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.xs,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  closeButton: {
    padding: spacing.xs,
  },
  list: {
    padding: spacing.m,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    marginBottom: spacing.s,
    ...shadows.small,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary + '10',
  },
  categoryLabel: {
    marginLeft: spacing.s,
    color: colors.text.primary,
  },
  selectedCategoryLabel: {
    color: colors.primary,
  },
});

export default CategoryPicker;
