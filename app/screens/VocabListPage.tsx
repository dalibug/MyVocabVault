import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite"; // Import SQLite

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.listName, { color: textColor }]}>{item.listName || item.word}</Text>
  </TouchableOpacity>
);

const VocabListPage = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [vocabLists, setVocabLists] = useState([]);
  const [vocabHistory, setVocabHistory] = useState([]); // Stores history list
  const { userID } = route.params;
  const [db, setDB] = useState<SQLite.SQLiteDatabase | null>(null);
  const [selectedId, setSelectedId] = useState(null);

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
        console.log("vocabHistory table is ready");
      } catch (error) {
        console.error("Error opening database:", error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (db) {
      const loadVocabLists = async () => {
        try {
          console.log("Fetching vocab lists for userID:", userID);
          const results = await db.getAllAsync("SELECT * FROM vocabLists WHERE userID = ?", [userID]);
          setVocabLists(results);
        } catch (error) {
          console.error("Error loading vocab lists:", error);
        } finally {
          setLoading(false);
        }
      };
      loadVocabLists();
    }
  }, [db, userID]);

  useEffect(() => {
    if (db) {
      const loadHistory = async () => {
        try {
          console.log("Fetching vocab history...");
          const history = await db.getAllAsync("SELECT * FROM vocabHistory WHERE userID = ?", [userID]);
          setVocabHistory(history);
        } catch (error) {
          console.error("Error loading vocab history:", error);
        }
      };
      loadHistory();
    }
  }, [db, userID]);

  const renderItem = ({ item }) => {
    const backgroundColor = item.listID === selectedId ? "#aed6f1" : "#5dade2";
    const color = item.listID === selectedId ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.listID);
          alert("Feature in progress: Viewing vocab list");
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Vocab Word History Section */}
        <Text style={styles.sectionTitle}>Vocab Word History</Text>
        {vocabHistory.length === 0 ? (
          <Text style={styles.noHistoryText}>No words added yet</Text>
        ) : (
          <FlatList
            data={vocabHistory}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.definition}>{item.definition}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        {/* Vocab Lists Section */}
        <Text style={styles.sectionTitle}>Your Vocab Lists</Text>
        {loading ? (
          <Text>Loading Vocab Lists...</Text>
        ) : vocabLists.length === 0 ? (
          <Text>No Vocab Lists Found</Text>
        ) : (
          <FlatList
            data={vocabLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.listID.toString()}
          />
        )}

        {/* Floating Button to Add a New List */}
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("modal")}>
          <Text style={styles.floatingButtonSign}>+</Text>
        </TouchableOpacity>
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
  noHistoryText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
  historyItem: {
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
  listName: {
    fontSize: 32,
    fontWeight: "bold",
  },
  floatingButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 70,
    backgroundColor: "#ff8540",
    borderRadius: 100,
  },
  floatingButtonSign: {
    fontSize: 40,
    color: "white",
  },
});

export default VocabListPage;
