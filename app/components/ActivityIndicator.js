import React from "react";
import LottieView from "lottie-react-native";

function ActivityIndicator({ visible = false }) {
  if (!visible) return null;

  return (
    <LottieView
      style={{ flex: 1, marginTop: "50%" }}
      autoPlay
      loop
      source={require("../assets/animations/lottieLoader.json")}
    />
  );
}

export default ActivityIndicator;
