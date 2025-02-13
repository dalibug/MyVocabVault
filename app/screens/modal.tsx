import { Stack } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function Modal({ route }) {
  const [listName, setListName] = useState("");
  const navigation = useNavigation();
  // get the database context
  const db = useSQLiteContext();
  const { userID } = route.params;

  const handleListCreation = useCallback(async () => {
    try {
      const response = await db.runAsync("INSERT INTO vocabLists (userID, listName) VALUES (?, ?)",
        [userID, listName]
      );
      console.log("List created successfully");
      navigation.goBack();

    } catch (error) {
      console.error("Error saving item:", error);
    }
  }, [userID, listName, navigation, db]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          gap: 20,
          marginVertical: 20,
        }}
      >
        <TextInput
          placeholder="Enter Vocab List Name"
          value={listName}
          onChangeText={((text) => setListName(text))}
          style={styles.textInput}
        />
      </View>
      <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.button, { backgroundColor: "red" }]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleListCreation}
          style={[styles.button, { backgroundColor: "blue" }]}
        >
          <Text style={styles.buttonText}>{"Create List"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    width: 300,
    borderRadius: 5,
    borderColor: "slategray",
  },
  button: {
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});