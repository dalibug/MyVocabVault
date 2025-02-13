import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

export default function ForgotPassword() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const handleNext = async () => {
    const user = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      Alert.alert("Error", "No account found with this email.");
      return;
    }

    navigation.navigate("VerifySecurityAnswer", { email });
  };

  return (
    <View>
      <Text>Enter your email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
}
