import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Index Page" }} />
      <Stack.Screen name="vocabListPage" options={{ title: "Vocab Lists Page" }} />
    </Stack>
  );
}
