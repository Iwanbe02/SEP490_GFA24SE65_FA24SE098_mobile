import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For local storage
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper"; // For card component (optional, can use View)

const VillageListScreen = () => {
  const [villages, setVillages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        Alert.alert("User not logged in", "Please log in to view villages.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonatedVillageByUserId?userId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const responseBody = await response.json();
        if (responseBody.hasOwnProperty("$values")) {
          setVillages(responseBody["$values"]);
        } else {
          Alert.alert("Error", "No villages found.");
        }
      } else {
        Alert.alert("Error", "Failed to load villages.");
      }
    } catch (e) {
      console.error("Error fetching villages:", e);
      Alert.alert("Error", "An error occurred while fetching villages.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderVillage = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.villageName}>{item.villageName}</Text>
        <Text style={styles.location}>Location: {item.location}</Text>
        <Text style={styles.description}>Description: {item.description}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Button
          title="View Houses"
          onPress={() =>
            navigation.navigate("HouseListScreen", { villageId: item.id })
          }
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donated Villages</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={villages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderVillage}
          ListEmptyComponent={
            <Text style={styles.noVillagesText}>No villages found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "column",
  },
  villageName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  noVillagesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default VillageListScreen;