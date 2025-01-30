import { Stack, Slot } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen name="vocabListPage" options={{ title: "Vocab Lists Page" }} />
      <Slot />
    </Stack>
  );
}