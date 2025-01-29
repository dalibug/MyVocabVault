import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Index Page" }} />
      <Stack.Screen name="VocabListPage" options={{ title: "Vocab Lists Page" }} />
    </Stack>
  );
}
