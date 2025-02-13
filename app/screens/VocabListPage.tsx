import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";

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
  const { userID, vocabHistoryID } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const db = useSQLiteContext();

  useEffect(() => {
    if (db) {
      const unsubscribe = navigation.addListener("focus", () => {
        const loadVocabLists = async () => {
          try {
            console.log("Fetching vocab lists for userID:", userID);

            const results = await db.getAllAsync("SELECT * FROM vocabLists WHERE userID = ? AND listID != ?", [userID, vocabHistoryID.listID]);
            setVocabLists(results);
          } catch (error) {
            console.error("Error loading vocab lists:", error);
          } finally {
            setLoading(false);
          }
        };
        loadVocabLists();
      })
      return unsubscribe;
    }
  }, [db, userID, navigation]);

  useEffect(() => {
    if (db) {
      const loadHistory = async () => {
        try {
          console.log("Fetching vocab history...");
          const history = await db.getAllAsync("SELECT * FROM wordInList WHERE userID = ? AND listID = ?", [userID, vocabHistoryID]);
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
          navigation.navigate("WordListPage", { userID, listID: item.listID });
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
            keyExtractor={(item) => item.wordID.toString()}
          />
        )}

        {/* Vocab Lists Section */}
        <Text style={styles.sectionTitle}>Your Vocab Lists</Text>
        {loading ? (
          <Text>Loading Vocab Lists...</Text>
        ) : vocabLists.length === 0 ? (
          <Text style={styles.noHistoryText}>No Created Vocab Lists Found</Text>
        ) : (
          <FlatList
            data={vocabLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.listID.toString()}
          />
        )}

        {/* Floating Button to Add a New List */}
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate("Modal", { userID })} accessibilityLabel="Create New List">
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
