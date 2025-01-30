import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LandingScreen = () => {
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dailyWord, setDailyWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user email from AsyncStorage (or API if needed)
    const fetchUserData = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch daily vocabulary word from API
    const fetchDailyWord = async () => {
      try {
        const response = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/random");
        const data = await response.json();

        if (data && data.length > 0) {
          setDailyWord(data[0].word);
          await saveToHistoryList(data[0].word);
        }
      } catch (error) {
        console.error("Error fetching word:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyWord();
  }, []);

  // Save daily word to history
  const saveToHistoryList = async (word: string) => {
    try {
      const existingHistory = await AsyncStorage.getItem("historyList");
      const historyList = existingHistory ? JSON.parse(existingHistory) : [];
      historyList.unshift(word); // Add new word to the top of the list
      await AsyncStorage.setItem("historyList", JSON.stringify(historyList));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  // Logout function (clears stored user data)
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userEmail");
    navigation.navigate("Login"); // Redirect to login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {userEmail || "User"}!</Text>

      <Text style={styles.sectionTitle}>Daily Vocabulary Word</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Text style={styles.dailyWord}>{dailyWord || "No word available"}</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  dailyWord: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LandingScreen;
