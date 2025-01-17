import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";

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
          const villagesWithImages = await Promise.all(
            responseBody["$values"].map(async (village) => {
              console.log("Fetching details for village ID:", village.id);
              const villageDetailResponse = await fetch(
                `https://soschildrenvillage.azurewebsites.net/api/Village/GetVillageByIdWithImg?id=${village.id}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (villageDetailResponse.ok) {
                const villageDetail = await villageDetailResponse.json();
                return { ...village, ...villageDetail[0] };
              } else {
                console.warn(`Village details not found for ID: ${village.id}`);
                return village;
              }
            })
          );

          setVillages(villagesWithImages);
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
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <Image
            source={{ uri: item.imageUrls[0] }}
            style={styles.villageImage}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.noImageText}>No Image Available</Text>
        )}

        <Text style={styles.villageName}>{item.villageName}</Text>
        <Text style={styles.location}>Location: {item.location}</Text>
        <Text style={styles.description}>Description: {item.description}</Text>
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
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingBottom: 60,
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
  villageImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  noImageText: {
    textAlign: "center",
    color: "gray",
    marginBottom: 10,
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

export default VillageListScreen;
