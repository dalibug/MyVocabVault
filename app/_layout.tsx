import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home Page" }} />
      <Stack.Screen name="HomePage" options={{ title: "Home Page Content" }} />
    </Stack>
  );
}

