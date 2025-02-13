import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";

const WordListPage = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [wordList, setWordList] = useState([]);
  const { userID, listID } = route.params;
  const db = useSQLiteContext();

  useEffect(() => {
    if (db) {
      const loadWordList = async () => {
        try {
          const vocabWords = await db.getAllAsync("SELECT * FROM wordInList WHERE userID = ? AND listID = ?", [userID, listID]);
          setWordList(vocabWords);
        } catch (error) {
          console.error("Error loading vocab history:", error);
        } finally {
          setLoading(false);
        }
      };
      loadWordList();
    }
  }, [db, userID]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Word List Section */}
        <Text style={styles.sectionTitle}>Word List</Text>
        {wordList.length === 0 ? (
          <Text style={styles.noWordsText}>No words added yet</Text>
        ) : (
          <FlatList
            data={wordList}
            renderItem={({ item }) => (
              <View style={styles.wordItem}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.definition}>{item.definition}</Text>
              </View>
            )}
            keyExtractor={(item) => item.wordID.toString()}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  noWordsText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
  wordItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  definition: {
    fontSize: 16,
    fontStyle: "italic",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 5,
  },
});

export default WordListPage;
