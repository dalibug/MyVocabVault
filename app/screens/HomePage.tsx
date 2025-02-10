import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";


export default function HomePage() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyVocabVault</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={() => navigation.navigate("LoginPage")} color="#4CAF50" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Create Account" onPress={() => navigation.navigate("CreateAccountPage")} color="#2196F3" />
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


