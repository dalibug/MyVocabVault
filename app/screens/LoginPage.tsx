import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";


const LoginPage = ({ route }) => {

  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email]);

      if (!userData) {
        Alert.alert("Login Failed", "User not found.");
        return;
      }

      const validUser = await db.getFirstAsync('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      if (validUser) {
        // await AsyncStorage.setItem("currentUser", email);
        // Alert.alert("Login Successful", "Redirecting to Test Page...");
        // navigation.navigate("TestLandingPage", {user: email});  // Jump to TestLandingPage
        navigation.navigate("LandingPage", {user: email});
      } else {
        Alert.alert("Login Failed", "Incorrect password.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Log In" onPress={handleLogin} color="#FF5733" />
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default LoginPage;