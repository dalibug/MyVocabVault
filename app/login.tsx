import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is a test page, button navigation successful</Text>
      <Button title="Go Back" onPress={() => router.replace("/")} color="#FF5733" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});

