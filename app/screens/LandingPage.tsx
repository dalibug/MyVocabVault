import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from "react-native";
import wordList from "../../assets/advanced_words.json";
import { useNavigation } from "@react-navigation/native"; // For navigation

const LandingScreen = ({ route }) => {
  // State variables to store daily word, definition, and loading state
  const [dailyWord, setDailyWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation(); // For navigating through pages
  const { userID } = route.params;

  // Fetch a new daily word when the screen loads
  useEffect(() => {
    fetchDailyWord();
  }, []);

  const fetchDailyWord = async () => {
    try {
      // Select a random word from the word list
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      const API_KEY = "9c3b1721-9b03-4686-954c-91e9137bf51a";
      const API_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${randomWord}?key=${API_KEY}`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch definition for ${randomWord}`);
      }

      // Extract definition from API response
      const data = await response.json();
      const fetchedDefinition = data[0]?.shortdef?.[0] || "Definition not available.";

      // Update state with the fetched word and definition
      setDailyWord(randomWord);
      setDefinition(fetchedDefinition);
    } catch (error) {
      console.error("Error fetching daily word:", error);
      setDailyWord("No word available");
      setDefinition("Definition not available.");
    } finally {
      setLoading(false);
    }
  };

  // Log out function - navigates to Home Page
  const handleLogout = () => {
    navigation.navigate("HomePage"); // Redirect to the Home Page
  };

  const handleVocabLists = () => {
    
    navigation.navigate("VocabListPage", {userID: userID});
  }

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.vocabListButton} onPress={handleVocabLists}>
        <Text style={styles.vocabListText}>View Vocab Lists</Text>
      </TouchableOpacity>

      {/* Daily word section */}
      <Text style={styles.sectionTitle}>Daily Vocabulary Word</Text>
      {loading ? (
        // Show loading indicator while fetching data
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          {/* Display fetched word and definition */}
          <Text style={styles.dailyWord}>{dailyWord || "No word available"}</Text>
          <Text style={styles.definition}>
            {definition || "Definition not available."}
          </Text>
        </>
      )}
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
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  vocabListButton: { // style for button background is temporary
    position: "absolute",
    bottom: 250,
    backgroundColor: "#0000FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  vocabListText: { // style for button text is temporary
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  definition: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
});

export default LandingScreen;