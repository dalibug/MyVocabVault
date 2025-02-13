import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import wordList from "../../assets/advanced_words.json";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

const LandingScreen = ({ route }) => {
  const [dailyWord, setDailyWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const { userID } = route.params;
  const [db, setDB] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const dbInstance = await SQLite.openDatabaseAsync("vocabVault.db");
        setDB(dbInstance);
        console.log("Database opened successfully");

        // Ensure the vocabHistory table exists
        await dbInstance.runAsync(
          `CREATE TABLE IF NOT EXISTS vocabHistory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL UNIQUE, 
            definition TEXT NOT NULL,
            userID TEXT NOT NULL
          );`
        );
      } catch (error) {
        console.error("Error opening database:", error);
      }
    })();
  }, []);

  useEffect(() => {
    fetchDailyWord();
  }, []);

  // Fetch a new daily word
  const fetchDailyWord = async () => {
    setLoading(true);
    try {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      const API_KEY = "9c3b1721-9b03-4686-954c-91e9137bf51a";
      const API_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${randomWord}?key=${API_KEY}`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch definition for ${randomWord}`);
      }

      const data = await response.json();
      const fetchedDefinition = data[0]?.shortdef?.[0] || "Definition not available.";

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

  // Save word to vocab history, preventing duplicates
  const saveWordToHistory = async () => {
    if (db && dailyWord && definition) {
      try {
        // Check if the word is already in the database
        const existingWord = await db.getFirstAsync(
          "SELECT * FROM vocabHistory WHERE word = ? AND userID = ?",
          [dailyWord, userID]
        );

        if (existingWord) {
          console.log(`⚠️ Word '${dailyWord}' already exists in history.`);
          alert("This word is already in your history!");
          return;
        }

        // Insert word if it doesn't already exist
        await db.runAsync(
          "INSERT INTO vocabHistory (word, definition, userID) VALUES (?, ?, ?)",
          [dailyWord, definition, userID]
        );

        console.log(`✅ Saved '${dailyWord}' to vocabHistory`);
        alert("Word saved to history!");
      } catch (error) {
        console.error("🚨 Error saving word:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("HomePage")}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.vocabListButton}
        onPress={() => navigation.navigate("VocabListPage", { userID })}
      >
        <Text style={styles.vocabListText}>View Vocab Lists</Text>
      </TouchableOpacity>

      {/* Daily word section */}
      <Text style={styles.sectionTitle}>Daily Vocabulary Word</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <Text style={styles.dailyWord}>{dailyWord || "No word available"}</Text>
          <Text style={styles.definition}>{definition || "Definition not available."}</Text>
        </>
      )}

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchDailyWord}>
        <Text style={styles.refreshButtonText}>🔄 Refresh Word</Text>
      </TouchableOpacity>

      {/* Save Word to History Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveWordToHistory}>
        <Text style={styles.saveButtonText}>✅ Save Word to History</Text>
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
  vocabListButton: {
    position: "absolute",
    bottom: 250,
    backgroundColor: "#0000FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  vocabListText: {
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
  refreshButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  refreshButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LandingScreen;
