import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post(
        "https://soschildrenvillage.azurewebsites.net/api/Login",
        { email, password }
      );

      console.log("API Response:", response.data);

      if (
        response.data?.statusCode === 200 &&
        response.data?.message === "Login successful"
      ) {
        Alert.alert("Login Successful", "You are now logged in!");

        const token = response.data?.data;
        const userId = response.data?.userId;
        const roleId = response.data?.roleId;

        console.log("Token:", token);
        console.log("UserId:", userId);
        console.log("RoleId:", roleId);

        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("roleId", roleId.toString());

        navigation.replace("Home");
      } else {
        Alert.alert(
          "Login Failed",
          response.data?.message || "Invalid credentials"
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Sign Up Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    color: "#3498db",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
