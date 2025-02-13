import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

export default function CreateAccount() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Email and password cannot be empty.");
        return;
      }

      // check if the account has been registered
      const existingUser = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser) {
        Alert.alert("Error", "This email is already registered.");
        return;
      }

      // user info storage
      await db.runAsync("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);
      
      // Automatically creates vocab history list when account is created
      const result = await db.getFirstAsync("SELECT last_insert_rowid() AS lastID"); // Gets the latest userID
      const newUserID = result.lastID;
      await db.runAsync("INSERT INTO vocabLists (userID, listName) VALUES (?, ?)", [newUserID, "Vocab Word History"]);

      Alert.alert("Sign Up Successful", "You can now log in.");
      navigation.navigate("LoginPage"); // jump to login page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Sign Up Failed", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <Button title="Sign Up" onPress={handleSignUp} color="#3498db" />
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


