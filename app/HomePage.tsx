import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyVocabVault</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={() => router.push("/login")} color="#4CAF50" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Create Account" onPress={() => router.push("/createAccount")} color="#2196F3" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333",
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 10,
  },
});


