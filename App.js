import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Alert, Button } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={containerStyle}>
      <Button
        color="green"
        title="Prekem"
        onPress={() =>
          Alert.prompt("Pyetje?", "What do you do for living", (text) =>
            console.log(text)
          )
        }
      />
    </SafeAreaView>
  );
}

const containerStyle = { backgroundColor: "blue " };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
