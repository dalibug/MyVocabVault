import React from "react";
import { Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import HomePage from "./screens/HomePage";
import LoginPage from "./screens/login";
import LandingPage from "./screens/LandingPage";
import VocabListPage from "./screens/VocabListPage";
import CreateAccount from "./screens/createAccount";
import TestLandingPage from "./screens/TestLandingPage";
import Modal from "./modal";

// initialize the database
const initDB = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        email TEXT unique NOT NULL, 
        password TEXT NOT NULL
      );
    `);

    // Use getFirstAsync and handle the case where no rows are returned
    const userCountResult = await db.getFirstAsync("SELECT COUNT(*) AS userCount FROM users");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vocabLists (
        listID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        userID INTEGER NOT NULL,
        listName TEXT NOT NULL,
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE -- Important!
      );
    `);

    // Check if a result was returned and if the count is 0
    if (userCountResult && userCountResult.userCount === 0) {  // Safer check
      await db.execAsync(`INSERT INTO users (email, password) VALUES ("testuser", "123");`);
      await db.execAsync(`INSERT INTO users (email, password) VALUES ("email", "password");`);

      await db.execAsync(`INSERT INTO vocabLists (userID, listName) VALUES ("1", "Vocab Word History");`);
      await db.execAsync(`INSERT INTO vocabLists (userID, listName) VALUES ("1", "Created List for testuser");`);

      await db.execAsync(`INSERT INTO vocabLists (userID, listName) VALUES ("2", "Vocab Word History");`);
      await db.execAsync(`INSERT INTO vocabLists (userID, listName) VALUES ("2", "Created List for email user");`);
    }

  } catch (error) {
    console.error("Error initializing database:", error);
    Alert.alert("Error", "Database initialization failed. Please try again later.");
  }
};

const Stack = createNativeStackNavigator();

export default function index() {
  return (
    <SQLiteProvider databaseName="vocabVault.db" onInit={initDB}>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage}
          options={{ headerShown: false }} />

        <Stack.Screen name="CreateAccountPage" component={CreateAccount}
          options={{ title: "Create an Account" }} />

        <Stack.Screen name="LoginPage" component={LoginPage}
          options={{ title: "Log In" }} />

        <Stack.Screen name="LandingPage" component={LandingPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="TestLandingPage" component={TestLandingPage}
          options={{ headerShown: false }} />

        <Stack.Screen name="VocabListPage" component={VocabListPage}
          options={{ title: "Vocab Lists" }} />

        <Stack.Screen name="Modal" component={Modal}
          options={{ presentation: "testing modal" }} />

      </Stack.Navigator>
    </SQLiteProvider>
  );
};