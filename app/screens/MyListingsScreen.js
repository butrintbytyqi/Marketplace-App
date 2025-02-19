import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from "../components/Screen";
import Card from "../components/Card";
import Text from "../components/Text";
import Button from "../components/Button";
import ActivityIndicator from "../components/ActivityIndicator";
import SuccessAnimation from "../components/SuccessAnimation";
import { colors, spacing, shadows } from "../config/theme";
import listingsApi from "../api/listings";
import useApi from "../hooks/useApi";
import routes from "../navigation/routes";

function MyListingsScreen({ navigation }) {
  const getListingsApi = useApi(listingsApi.getMyListings);
  const deleteListingApi = useApi(listingsApi.deleteListing);
  const [refreshing, setRefreshing] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successAnimation, setSuccessAnimation] = useState(null);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    await getListingsApi.request();
  };

  const showSuccess = (message, animation) => {
    setSuccessMessage(message);
    setSuccessAnimation(animation);
    setSuccessVisible(true);
  };

  const handleDelete = async (listing) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteListingApi.request(listing.id);
            if (result.ok) {
              showSuccess(
                "Listing deleted successfully!", 
                require("../../app/assets/animations/delete.json")
              );
              loadListings(); // Refresh the list
            } else {
              Alert.alert("Error", "Could not delete the listing");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (listing) => {
    navigation.navigate(routes.LISTING_EDIT, { 
      listing,
      onUpdateSuccess: () => {
        showSuccess(
          "Listing updated successfully!", 
          require("../../app/assets/animations/success.json")
        );
        loadListings(); // Refresh the list
      }
    });
  };

  const ListingActions = ({ listing }) => (
    <View style={styles.actions}>
      <TouchableOpacity 
        onPress={() => handleEdit(listing)}
        style={[styles.actionButton, styles.editButton]}
      >
        <MaterialCommunityIcons name="pencil" size={20} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => handleDelete(listing)}
        style={[styles.actionButton, styles.deleteButton]}
      >
        <MaterialCommunityIcons name="trash-can" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Screen style={styles.screen}>
      {getListingsApi.error && (
        <View style={styles.error}>
          <Text variant="body" style={styles.errorText}>
            Couldn't retrieve your listings
          </Text>
          <Button title="Retry" onPress={loadListings} />
        </View>
      )}
      <ActivityIndicator visible={getListingsApi.loading} />
      <FlatList
        data={getListingsApi.data}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listingContainer}>
            <Card
              title={item.title}
              subTitle={"$" + item.price}
              imageUrl={item.images[0]?.url}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
              style={styles.card}
            />
            <ListingActions listing={item} />
          </View>
        )}
        refreshing={refreshing}
        onRefresh={loadListings}
        contentContainerStyle={styles.list}
      />
      <SuccessAnimation
        visible={successVisible}
        onDone={() => setSuccessVisible(false)}
        message={successMessage}
        animation={successAnimation}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.m,
  },
  listingContainer: {
    marginBottom: spacing.m,
  },
  card: {
    marginBottom: 0,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: spacing.s,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...shadows.small,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.s,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  error: {
    padding: spacing.m,
    alignItems: "center",
  },
  errorText: {
    marginBottom: spacing.m,
    textAlign: "center",
    color: colors.danger,
  },
});

export default MyListingsScreen;
