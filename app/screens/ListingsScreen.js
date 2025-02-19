import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, RefreshControl } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Card from "../components/Card";
import Screen from "../components/Screen";
import Text from "../components/Text";
import Button from "../components/Button";
import ActivityIndicator from "../components/ActivityIndicator";
import { colors, spacing } from "../config/theme";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";

dayjs.extend(relativeTime);

function ListingsScreen({ navigation }) {
  const getListingsApi = useApi(listingsApi.getListings);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    await getListingsApi.request();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadListings();
    setRefreshing(false);
  };

  const getDistance = (location) => {
    // This would normally calculate actual distance
    // For now returning mock data
    const distances = ["0.5 km", "1.2 km", "3.4 km", "5 km", "10+ km"];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  return (
    <Screen style={styles.screen}>
      {getListingsApi.error && (
        <View style={styles.errorContainer}>
          <Text 
            variant="headline" 
            weight="semibold" 
            style={styles.errorText}
          >
            Couldn't retrieve the listings
          </Text>
          <Button 
            title="Retry" 
            onPress={loadListings}
            variant="outlined"
            style={styles.retryButton}
          />
        </View>
      )}
      <ActivityIndicator visible={getListingsApi.loading} />
      <FlatList
        data={getListingsApi.data}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={"$" + item.price}
            imageUrl={item.images[0] ? item.images[0].url : null}
            onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
            category={item.categoryId ? item.categoryId.toString() : "Other"}
            distance={getDistance(item.location)}
            postedTime={dayjs(item.createdAt).fromNow()}
            condition={item.condition || "Used"}
          />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    paddingTop: spacing.s,
  },
  errorContainer: {
    padding: spacing.m,
    alignItems: "center",
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.m,
  },
  retryButton: {
    width: "50%",
  },
});

export default ListingsScreen;
