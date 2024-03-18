import React from "react";
import Screen from "./app/components/Screen";
import { Button, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const Link = () => {
  const navigation = useNavigation();

  return (
    <Button
      title="Click"
      onPress={() => navigation.navigate("TweetDetails", { id: 1 })}
    />
  );
};

const Tweets = () => (
  <Screen>
    <Text>Tweets</Text>
    <Link />
  </Screen>
);

const TweetDetails = ({ route }) => (
  <Screen>
    <Text>Tweet Details {route.params.id}</Text>
  </Screen>
);

const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator initialRouteName="Tweets">
    <Stack.Screen name="TweetDetails" component={TweetDetails} />
    <Stack.Screen name="Tweets" component={Tweets} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
