import React, { useState } from "react";
import { View, FlatList, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

type ItemData = {
  id: string;
  listName: string;
};

const initialList: ItemData[] = [
  { id: "0", listName: "Vocab History" },
  { id: "1", listName: "My List #1" },
  { id: "2", listName: "My List #2" },
  { id: "3", listName: "My List #3" },
  { id: "4", listName: "My List #4" },
  { id: "5", listName: "My List #5" },
  { id: "6", listName: "My List #6" },
  { id: "7", listName: "My List #7" },
  { id: "8", listName: "My List #8" },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
    <Text style={[styles.listName, { color: textColor }]}>{item.listName}</Text>
  </TouchableOpacity>
);

const vocabListPage = () => {
  const [exampleState, setExampleState] = useState(initialList);
  const [idx, incr] = useState(9);
  const [selectedId, setSelectedId] = useState<string>();

  const addList = () => {

    var newArray = [...exampleState, { id: idx.toString(), listName: "My List #" + (idx) }];
    incr(idx + 1);
    setExampleState(newArray);
  };

  const FloatButton = ({ onPress }: { onPress: () => void }) => {
    return (
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onPress}
      >
        <Text style={styles.floatingButtonSign}>+</Text>
      </TouchableOpacity>
    );
  }

  const renderItem = ({ item }: { item: ItemData }) => {
    // renders the change of color for the buttons when it is pressed
    // first color is when the button is pressed, else the button will appear as the second color
    const backgroundColor = item.id === selectedId ? "#aed6f1" : "#5dade2";
    const color = item.id === selectedId ? "black" : "white";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          alert("*In Progress*\nButton to view selected list was pressed");
        }}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={exampleState}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
        />
        <FloatButton onPress={addList} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
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

export default vocabListPage;
