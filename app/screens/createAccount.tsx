import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

export default function CreateAccount() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // add security question and answer
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const handleSignUp = async () => {
    try {
      if (!email || !password || !securityQuestion || !securityAnswer) {
        Alert.alert("Error", "All fields are required.");
        return;
      }

      // check if the account has been registered
      const existingUser = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser) {
        Alert.alert("Error", "This email is already registered.");
        return;
      }

      // user info storage with security question and answer
      await db.runAsync(
        "INSERT INTO users (email, password, securityQuestion, securityAnswer) VALUES (?, ?, ?, ?)",
        [email, password, securityQuestion, securityAnswer]
      );
      
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
      {/* security question input */}
      <TextInput
        style={styles.input}
        placeholder="Enter a Security Question"
        value={securityQuestion}
        onChangeText={setSecurityQuestion}
      />
      {/* security answer input */}
      <TextInput
        style={styles.input}
        placeholder="Answer to the Security Question"
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
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