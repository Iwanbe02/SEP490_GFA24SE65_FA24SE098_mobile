import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [events, setEvents] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchUserInfo();
    fetchEvents();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId === null) {
        console.log("User is not logged in");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.get(
        `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`
      );
      if (response.status === 200) {
        setUserName(response.data.userName);
      }
    } catch (e) {
      console.log("Error fetching user info:", e);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://soschildrenvillage.azurewebsites.net/api/Event"
      );
      if (response.status === 200) {
        setEvents(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Failed to load events:", error);
      setIsLoading(false);
    }
  };

  const renderSuggestedItem = (event) => (
    <View style={styles.suggestedCard} key={event.id}>
      {event.imageUrls && event.imageUrls.length > 0 && (
        <Image
          source={{ uri: event.imageUrls[0] }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.suggestedTitle}>{event.name}</Text>
      <Text style={styles.suggestedSubtitle}>
        {event.description || "No description available"}
      </Text>
    </View>
  );

  const renderHomeBody = () => (
    <ScrollView>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested for You</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestedList}
        >
          {events.map((event) => renderSuggestedItem(event))}
        </ScrollView>
      )}

      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/cover.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => navigation.navigate("VillageListScreen")}
      >
        <Text style={styles.bookingButtonText}>Booking Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userStatus}>Spread Goodness</Text>
        </View>
      </View>
      {renderHomeBody()}

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
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 60,
  },
  headerText: { marginLeft: 12 },
  userName: { color: "white", fontWeight: "bold", fontSize: 18 },
  userStatus: { color: "#e0e0e0", fontSize: 12 },
  headerActions: { flexDirection: "row", marginLeft: "auto" },
  icon: { marginLeft: 15 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeMoreText: { color: "#007AFF" },
  suggestedList: { paddingHorizontal: 10 },
  suggestedCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    padding: 10,
  },
  eventImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  suggestedTitle: { fontSize: 16, fontWeight: "bold" },
  suggestedSubtitle: { fontSize: 12, color: "#888" },
  bookingButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  bookingButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007AFF",
    padding: 10,
    paddingHorizontal: 20,
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 500,
    height: 200,
    resizeMode: "contain",
  },
});

export default HomePage;
