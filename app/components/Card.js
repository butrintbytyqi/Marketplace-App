import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

function Card({ 
  title, 
  subTitle, 
  imageUrl, 
  onPress, 
  category = "Other",
  distance = null,
  postedTime = "Just now",
  condition = "New"
}) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.95}
    >
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUrl && (
            <>
              <Image 
                style={styles.image} 
                source={{ uri: imageUrl }} 
                resizeMode="cover"
              />
              <View style={styles.badge}>
                <AppText style={styles.badgeText}>{condition}</AppText>
              </View>
            </>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <AppText style={styles.category}>{category}</AppText>
            {distance && (
              <AppText style={styles.distance}>{distance} away</AppText>
            )}
          </View>
          <AppText style={styles.title} numberOfLines={1}>{title}</AppText>
          <AppText style={styles.subTitle} numberOfLines={2}>{subTitle}</AppText>
          <View style={styles.footer}>
            <AppText style={styles.time}>{postedTime}</AppText>
            <TouchableOpacity style={styles.saveButton}>
              <MaterialCommunityIcons 
                name="bookmark-outline" 
                size={20} 
                color={colors.medium} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: width * 0.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  detailsContainer: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  distance: {
    fontSize: 13,
    color: colors.medium,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.dark,
  },
  subTitle: {
    fontSize: 15,
    color: colors.medium,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  time: {
    fontSize: 13,
    color: colors.medium,
  },
  saveButton: {
    padding: 5,
  },
});

export default Card;
