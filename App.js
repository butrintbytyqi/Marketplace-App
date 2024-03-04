import React, { useEffect, useState } from "react";
import LoginScreen from "./app/screens/LoginScreen";
import ListingEditScreen from "./app/screens/ListingEditScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import Screen from "./app/components/Screen";
import * as ImagePicker from "expo-image-picker";
import { Button, Image } from "react-native";
import ImageInput from "./app/components/ImageInput";
// import * as Permissions from "expo-permissions";

export default function App() {
  const [imageAsset, setImageAsset] = useState();

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("You need to enable premission to access the library");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        setImageAsset(result);
      }
    } catch (error) {
      console.log("Error reading an Image", error);
    }
  };

  return (
    <Screen>
      <ImageInput
        imageAsset={imageAsset}
        onChangeImage={(uri) => setImageAsset(uri)}
      />
    </Screen>
  );
}
