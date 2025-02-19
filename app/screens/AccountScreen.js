import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import Text from "../components/Text";
import { colors, spacing, shadows, borderRadius } from "../config/theme";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";

const menuItems = [
  {
    title: "My Listings",
    icon: "format-list-bulleted",
    targetScreen: routes.MY_LISTINGS,
  },
  {
    title: "My Messages",
    icon: "email",
    targetScreen: "Messages",
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  const MenuItem = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text variant="body" weight="medium">{title}</Text>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={24} 
          color={colors.text.tertiary} 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.screen}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image 
            source={require("../assets/meCircle.png")} 
            style={styles.avatar}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text variant="headline" weight="semibold">{user.name}</Text>
          <Text 
            variant="subhead" 
            style={styles.email}
          >
            {user.email}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            onPress={() => navigation.navigate(item.targetScreen)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
        <MaterialCommunityIcons 
          name="logout" 
          size={24} 
          color={colors.danger} 
        />
        <Text 
          variant="body" 
          weight="medium" 
          style={styles.logoutText}
        >
          Log Out
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.m,
    backgroundColor: colors.white,
    marginBottom: spacing.m,
    ...shadows.small,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginRight: spacing.m,
    backgroundColor: colors.background,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
  },
  email: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    marginHorizontal: spacing.m,
    ...shadows.small,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.m,
  },
  menuContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    marginHorizontal: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    ...shadows.small,
  },
  logoutText: {
    color: colors.danger,
    marginLeft: spacing.s,
  },
});

export default AccountScreen;
