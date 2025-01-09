import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Thay thế bằng thư viện datetimepicker
import Icon from "react-native-vector-icons/FontAwesome"; // Import icon library
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HouseListScreen = ({ route }) => {
  const { villageId } = route.params;
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [houseId, setHouseId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // State for date picker visibility

  const navigation = useNavigation();

  useEffect(() => {
    fetchHouses();
  }, [villageId]);

  const fetchHouses = async () => {
    try {
      const response = await fetch(
        `https://soschildrenvillage.azurewebsites.net/api/Houses/GetHouseByVillageId/${villageId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const responseBody = await response.json();
        console.log("Fetched houses:", responseBody);
        setHouses(responseBody.filter((house) => house.id)); // Chỉ giữ các nhà hợp lệ (có id)
      } else {
        console.log("Failed to load houses. Status code: ", response.status);
      }
    } catch (e) {
      console.error("Error fetching houses: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async (houseId, visitDay, bookingSlotId) => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      console.log("User is not logged in");
      return;
    }

    try {
      const response = await fetch(
        "https://soschildrenvillage.azurewebsites.net/api/Booking/CreateBooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            houseId: houseId,
            visitday: visitDay,
            bookingSlotId: bookingSlotId,
            userAccountId: userId,
          }),
        }
      );

      if (response.status === 200) {
        showAlertDialog("Success", "Booking created successfully");
      } else {
        showAlertDialog(
          "Error",
          `Failed to create booking. Status code: ${response.status}`
        );
      }
    } catch (e) {
      showAlertDialog("Error", `Error creating booking: ${e}`);
    }
  };

  const showAlertDialog = (title, message) => {
    Alert.alert(title, message, [{ text: "OK" }]);
  };

  const handleBookingDialog = (houseId) => {
    setHouseId(houseId);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert("Error", "Please select both a date and a time slot.");
      return;
    }

    const visitDay = selectedDate.toISOString().split("T")[0];
    createBooking(houseId, visitDay, selectedSlot);
    setShowBookingDialog(false);
  };

  const slots = [
    { id: 1, startTime: "09:00", endTime: "10:00" },
    { id: 2, startTime: "10:00", endTime: "11:00" },
    { id: 3, startTime: "11:00", endTime: "12:00" },
    { id: 4, startTime: "13:00", endTime: "14:00" },
    { id: 5, startTime: "14:00", endTime: "15:00" },
    { id: 6, startTime: "15:00", endTime: "16:00" },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderHouse = ({ item }) => {
    if (!item.id) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.houseName}>{item.houseName || "Unknown Name"}</Text>
        <Text>House Number: {item.houseNumber || "N/A"}</Text>
        <Text>Location: {item.location || "N/A"}</Text>
        <Text>
          Description: {item.description || "No description available"}
        </Text>
        <Text>Members: {item.houseMember || "0"}</Text>
        <Text>Owner: {item.houseOwner || "Unknown"}</Text>
        <Button title="Book" onPress={() => handleBookingDialog(item.id)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Houses in Village</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={houses}
          renderItem={renderHouse}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text>No houses available</Text>}
        />
      )}

      {showBookingDialog && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showBookingDialog}
          onRequestClose={() => setShowBookingDialog(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Select Visit Day and Slot Time
              </Text>

              <View style={styles.datePickerContainer}>
                <Text style={styles.selectedDateLabel}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("vi-VN")
                    : "Chọn ngày"}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  minimumDate={today}
                />
              )}

              <Text>Select Slot Time</Text>
              <View style={styles.slotPicker}>
                {slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[
                      styles.slotButton,
                      slot.id === selectedSlot && styles.selectedSlot,
                    ]}
                    onPress={() => setSelectedSlot(slot.id)}
                  >
                    <Text>
                      {slot.startTime} - {slot.endTime}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowBookingDialog(false)}
                />
                <Button
                  title="Book"
                  onPress={handleConfirmBooking}
                  disabled={!selectedDate || !selectedSlot}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  houseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  slotPicker: {
    marginBottom: 10,
  },
  slotButton: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedSlot: {
    backgroundColor: "#007AFF",
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
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

export default HouseListScreen;
