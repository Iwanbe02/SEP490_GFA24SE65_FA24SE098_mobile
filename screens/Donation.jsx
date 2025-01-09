import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DonationsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { donations } = route.params || {}; // Nhận donations từ props

  // Kiểm tra donations có phải là một mảng hợp lệ không
  if (!Array.isArray(donations)) {
    Alert.alert("Error", "Invalid donations data.");
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          There was an issue loading donations.
        </Text>
      </View>
    );
  }

  const renderDonation = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.donationType}>{item.donationType}</Text>
        <View style={styles.subtitle}>
          <Text>Amount: ${item.amount}</Text>
          <Text>Date: {item.dateTime}</Text>
          <Text>Description: {item.description}</Text>
        </View>
        <View style={styles.status}>
          <Text
            style={[
              styles.statusText,
              { color: item.status === "Completed" ? "green" : "orange" },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {donations.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={donations}
          renderItem={renderDonation}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <MaterialCommunityIcons name="home" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <MaterialCommunityIcons name="account" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    paddingBottom: 60,
  },
  appBar: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
  },
  appBarTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 16,
    padding: 15,
    elevation: 5,
  },
  donationType: {
    fontWeight: "bold",
    color: "#007bff",
    fontSize: 16,
  },
  subtitle: {
    marginTop: 10,
  },
  status: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  statusText: {
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "red",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    padding: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default DonationsScreen;
