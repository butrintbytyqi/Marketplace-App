import { View } from "react-native";
import AppButton from "./app/components/AppButton";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppButton title="Login" />
    </View>
  );
}
