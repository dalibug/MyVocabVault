import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite"; // Import SQLite

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.listName, { color: textColor }]}>{item.listName}</Text>
  </TouchableOpacity>
);

const VocabListPage = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [vocabLists, setVocabLists] = useState([]);
  const { userID } = route.params;
  const [db, setDB] = useState<SQLite.SQLiteDatabase | null>(null);
  const [selectedId, setSelectedId] = useState(null); // Add selectedId state

  useEffect(() => {
    (async () => {
      try {
        const dbInstance = await SQLite.openDatabaseAsync("vocabVault.db");
        setDB(dbInstance);
        console.log("Database opened successfully"); // Log success
      } catch (error) {
        console.error("Error opening database:", error);
        // Handle database opening error, perhaps show an error message to the user
        setLoading(false); // Important: set loading to false in case of error
      }
    })();
  }, []); // Empty dependency array: this runs only once

  useEffect(() => {
    if (db) { // No need to check db here. This useEffect will only run if db exists.
      const loadVocabLists = async () => {
        try {
          console.log("Starting query for userID:", userID);
          const results = await db.getAllAsync("SELECT * FROM vocabLists WHERE userID = ?", [userID]);
          console.log("Query results:", results);
          setVocabLists(results);
          console.log("Setting vocabLists:", vocabLists);
        } catch (error) {
          console.error("Error loading vocab lists:", error);
        } finally {
          setLoading(false);
          console.log("Loading set to false");
        }
      };
      loadVocabLists();
    }
  }, [db, userID]); // This useEffect will run only when db value changes.

  const renderItem = ({ item }) => {
    const backgroundColor = item.listID === selectedId ? "#aed6f1" : "#5dade2"; // Use item.listID
    const color = item.listID === selectedId ? "black" : "white";

    return (
      <Item
        item={item} // Pass the entire item object
        onPress={() => {
          setSelectedId(item.listID); // Use item.listID
          alert("*In Progress*\nButton to view selected list was pressed");
          // Navigate to the detail view, passing the selected item
          // navigation.navigate("VocabListDetail", { vocabList: item }); // Example navigation
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const FloatButton = ({ onPress }) => (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Text style={styles.floatingButtonSign}>+</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <Text>Loading Vocab Lists...</Text> // Wrapped in <Text>
        ) : vocabLists.length === 0 ? (
          <Text>No Vocab Lists Found</Text> // Wrapped in <Text>
        ) : (
          <FlatList
            data={vocabLists}
            renderItem={renderItem}
            keyExtractor={(item) => item.listID.toString()}
          />
        )}
        <FloatButton onPress={() => navigation.navigate("modal")} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // marginHorizontal: 5,
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
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    height: 70,
    color: "white",
    fontSize: 60,
  },
});

export default VocabListPage;
