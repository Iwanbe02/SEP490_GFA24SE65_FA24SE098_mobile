import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BookingHistoryScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { bookings: routeBookings } = route.params || {};

  useEffect(() => {
    console.log("Route bookings:", routeBookings);

    if (routeBookings) {
      // Kiểm tra xem routeBookings có thuộc tính data hay không
      if (
        routeBookings.data &&
        Array.isArray(routeBookings.data) &&
        routeBookings.data.length > 0
      ) {
        setBookings(routeBookings.data); // Trích xuất mảng từ routeBookings.data
      } else {
        Alert.alert("No bookings found", "There are no bookings available.");
        setBookings([]); // Đặt bookings là mảng rỗng nếu không có dữ liệu hợp lệ
      }
    } else {
      Alert.alert("Error", "Invalid bookings data.");
      setBookings([]); // Đặt mảng rỗng nếu routeBookings không hợp lệ
    }
    setLoading(false);
  }, [routeBookings]);

  const renderBooking = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.houseName}>House: {item.houseName}</Text>
        <View style={styles.subtitle}>
          <Text>Visit Day: {item.visitday}</Text>
          <Text>Start Time: {item.slotStartTime}</Text>
          <Text>End Time: {item.slotEndTime}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.noBookingsText}>Loading...</Text>
      ) : bookings.length === 0 ? (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
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
  houseName: {
    fontWeight: "bold",
    color: "#007bff",
    fontSize: 16,
  },
  subtitle: {
    marginTop: 10,
  },
  noBookingsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
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

export default BookingHistoryScreen;
