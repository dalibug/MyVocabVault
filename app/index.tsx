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
import ForgotPassword from "./screens/ForgotPassword";
import VerifySecurityAnswer from "./screens/VerifySecurityAnswer";
import ResetPassword from "./screens/ResetPassword";

const initDB = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        userID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        email TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        securityQuestion TEXT NOT NULL,
        securityAnswer TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error("Error initializing database:", error);
    Alert.alert("Error", "Database initialization failed. Please try again later.");
  }
};

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <SQLiteProvider databaseName="vocabVault.db" onInit={initDB}>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccountPage" component={CreateAccount} options={{ title: "Create an Account" }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ title: "Log In" }} />
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="TestLandingPage" component={TestLandingPage} options={{ headerShown: false }} />
        <Stack.Screen name="VocabListPage" component={VocabListPage} options={{ title: "Vocab Lists" }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "Forgot Password" }} />
        <Stack.Screen name="VerifySecurityAnswer" component={VerifySecurityAnswer} options={{ title: "Security Question" }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ title: "Reset Password" }} />
      </Stack.Navigator>
    </SQLiteProvider>
  );
}

