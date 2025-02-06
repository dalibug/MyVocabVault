import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import LandingScreen from "../screens/LandingPage"; 
import { useRouter } from "expo-router";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

// Mock API fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ shortdef: ["A test definition"] }]),
  })
) as jest.Mock;

describe("LandingScreen", () => {
  it("renders correctly", async () => {
    render(<LandingScreen />);
    expect(screen.getByText("Daily Vocabulary Word")).toBeTruthy();
  });

  it("displays loading indicator initially", async () => {
    render(<LandingScreen />);
    
    // Wrap in waitFor to ensure it properly waits
    await waitFor(() => {
      expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    });
  });

  it("fetches and displays the daily word", async () => {
    render(<LandingScreen />);

    // Wrap state updates in waitFor
    await waitFor(() => {
      expect(screen.getByText(/A test definition/)).toBeTruthy();
    });
  });

  it("handles API fetch errors gracefully", async () => {
    global.fetch = jest.fn(() => Promise.reject("API is down"));

    render(<LandingScreen />);

    // Wrap state updates in waitFor
    await waitFor(() => {
      expect(screen.getByText("No word available")).toBeTruthy();
    });
  });

  it("navigates to home page on logout", async () => {
    const { getByText } = render(<LandingScreen />);
    const logoutButton = getByText("Log Out");

    fireEvent.press(logoutButton);

    // Wrap navigation call in waitFor
    await waitFor(() => {
      expect(useRouter().replace).toHaveBeenCalledWith("/");
    });
  });
});
