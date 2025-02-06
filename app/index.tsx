import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import HomePage from "./screens/HomePage";
import LoginPage from "./screens/LoginPage";
import LandingPage from "./screens/LandingPage";
import VocabListsPage from "./screens/VocabListsPage";
import CreateAccount from "./screens/CreateAccount";
import TestLandingPage from "./screens/TestLandingPage";

//initialize the database
const initializeDatabase = async(db) => {
  try {
      await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS users (
            userID INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT unique,
            password TEXT
          );
      `);
  } catch (error) {
      console.log("Error while initializing the database : ", error);
  }
};

const Stack = createNativeStackNavigator();

export default function index() {
  return (
    <SQLiteProvider databaseName='vocabVault.db' onInit={initializeDatabase}>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }}/>
        <Stack.Screen name="LoginPage" component={LoginPage}/>
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}/>
        <Stack.Screen name="TestLandingPage" component={TestLandingPage} options={{ headerShown: false }}/>
        <Stack.Screen name="VocabListsPage" component={VocabListsPage} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
      </Stack.Navigator>
    </SQLiteProvider>
  );
};