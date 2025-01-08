import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Icon library for settings, notifications, etc.

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Huynh Minh");
  const [imgPath, setImgPath] = useState(
    "https://example.com/default-avatar.png"
  );
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        setImgPath(response.data.images["$values"][0].urlPath);
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
      <Image
        source={{ uri: event.imageUrls[0] }}
        style={styles.suggestedImage}
      />
      <Text style={styles.suggestedTitle}>{event.name}</Text>
      <Text style={styles.suggestedSubtitle}>Some location</Text>
    </View>
  );

  const renderHomeBody = () => (
    <ScrollView>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested for You</Text>
        <TouchableOpacity>
          <Text style={styles.seeMoreText}>See More</Text>
        </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => navigation.navigate("VillageListScreen")}
      >
        <Text style={styles.bookingButtonText}>Booking Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSearchBody = () => (
    <View style={styles.center}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: imgPath }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userStatus}>Spread Goodness</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <MaterialCommunityIcons
              name="account"
              size={28}
              color="white"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {renderHomeBody()}
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
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
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
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  suggestedImage: { width: "100%", height: 120 },
  suggestedTitle: { fontSize: 16, fontWeight: "bold", margin: 10 },
  suggestedSubtitle: { fontSize: 12, color: "#888", marginHorizontal: 10 },
  bookingButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  bookingButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});

export default HomePage;
