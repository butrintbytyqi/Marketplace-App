import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
  Platform,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ListItem from "../components/lists/ListItem";
import ImageSwiper from "../components/ImageSwiper";
import Button from "../components/Button";

const { width } = Dimensions.get("window");
dayjs.extend(relativeTime);

function ListingDetailsScreen({ route, navigation }) {
  const listing = route.params;
  const [liked, setLiked] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${listing.title} on DoneWithIt!`,
        url: listing.images[0].url,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.imageContainer}>
          <ImageSwiper 
            images={listing.images} 
            height={width * 0.8}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color={colors.white}
            />
          </TouchableOpacity>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setLiked(!liked)}
            >
              <MaterialCommunityIcons 
                name={liked ? "heart" : "heart-outline"} 
                size={24} 
                color={liked ? colors.danger : colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleShare}
            >
              <MaterialCommunityIcons 
                name="share-variant" 
                size={24} 
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View>
              <AppText style={styles.category}>{listing.categoryId || "Other"}</AppText>
              <AppText style={styles.title} numberOfLines={2}>{listing.title}</AppText>
            </View>
            <AppText style={styles.price}>${listing.price}</AppText>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color={colors.medium} />
              <AppText style={styles.detailText}>2.5 km away</AppText>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={colors.medium} />
              <AppText style={styles.detailText}>
                {dayjs(listing.createdAt).fromNow()}
              </AppText>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="eye-outline" size={20} color={colors.medium} />
              <AppText style={styles.detailText}>123 views</AppText>
            </View>
          </View>

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Description</AppText>
            <AppText style={styles.description}>{listing.description || "No description provided."}</AppText>
          </View>

          <View style={styles.section}>
            <AppText style={styles.sectionTitle}>Seller</AppText>
            <View style={styles.sellerCard}>
              <ListItem
                image={require("../assets/meCircle.png")}
                title="Butrint Bytyqi"
                subTitle="5 listings · 4.8 ★"
                IconComponent={
                  <MaterialCommunityIcons 
                    name="check-decagram" 
                    size={24} 
                    color={colors.primary}
                  />
                }
              />
              <View style={styles.sellerStats}>
                <View style={styles.stat}>
                  <AppText style={styles.statNumber}>98%</AppText>
                  <AppText style={styles.statLabel}>Response Rate</AppText>
                </View>
                <View style={styles.stat}>
                  <AppText style={styles.statNumber}>~2 hrs</AppText>
                  <AppText style={styles.statLabel}>Response Time</AppText>
                </View>
                <View style={styles.stat}>
                  <AppText style={styles.statNumber}>2 yrs</AppText>
                  <AppText style={styles.statLabel}>Selling</AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton}>
          <MaterialCommunityIcons name="message-outline" size={24} color={colors.medium} />
          <AppText style={styles.messageText}>Message</AppText>
        </TouchableOpacity>
        <Button 
          title="Make an Offer" 
          onPress={() => console.log("Make offer")}
          style={styles.offerButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    position: "relative",
    backgroundColor: colors.black,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 10,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtons: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 10,
    right: 15,
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  category: {
    fontSize: 14,
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    maxWidth: width * 0.65,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.light,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.medium,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.medium,
  },
  sellerCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: colors.dark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sellerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: colors.light,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.dark,
  },
  statLabel: {
    fontSize: 12,
    color: colors.medium,
    marginTop: 2,
  },
  footer: {
    padding: 15,
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.medium,
    borderRadius: 8,
    padding: 12,
  },
  messageText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: colors.medium,
  },
  offerButton: {
    flex: 2,
  },
});

export default ListingDetailsScreen;
