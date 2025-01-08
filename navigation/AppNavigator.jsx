import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import VillageListScreen from "../screens/VillageList";
import HouseListScreen from "../screens/HouseList";
import BookingHistoryScreen from "../screens/BookingHistory";
import DonationsScreen from "../screens/Donation";
import ProfileScreen from "../screens/Profile";
// import SignUpScreen from "../screens/SignUpScreen"; // Nếu cần thêm màn hình đăng ký

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      {/* Màn hình Login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      {/* Màn hình Home */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen name="VillageListScreen" component={VillageListScreen} />
      <Stack.Screen name="HouseListScreen" component={HouseListScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="Donations" component={DonationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
