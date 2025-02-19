import React from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";
import AppText from "../components/AppText";
import { colors } from "../config/theme";
import LottieView from "lottie-react-native";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        {progress < 1 ? (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText 
              variant="headline" 
              weight="semibold" 
              style={styles.text}
            >
              Uploading... {Math.round(progress * 100)}%
            </AppText>
          </View>
        ) : (
          <View style={styles.doneContainer}>
            <LottieView
              autoPlay
              loop={false}
              onAnimationFinish={onDone}
              source={require("../assets/animations/done.json")}
              style={styles.animation}
            />
            <AppText 
              variant="title2" 
              weight="semibold" 
              style={styles.doneText}
            >
              Listing Posted!
            </AppText>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  progressContainer: {
    alignItems: "center",
    padding: 20,
  },
  doneContainer: {
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 20,
    color: colors.text,
  },
  doneText: {
    marginTop: 20,
    color: colors.success,
  },
});

export default UploadScreen;
