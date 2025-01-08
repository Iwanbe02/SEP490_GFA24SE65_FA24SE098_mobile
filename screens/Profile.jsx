import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        try {
          // Fetch user info
          const userResponse = await fetch(
            `https://soschildrenvillage.azurewebsites.net/api/UserAccount/GetUserById/${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const userData = await userResponse.json();

          // Fetch donations info
          const donationsResponse = await fetch(
            `https://soschildrenvillage.azurewebsites.net/api/Donation/GetDonationByUserId/${userId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const donationsData = await donationsResponse.json();

          // Set the data in state
          setUserInfo(userData);
          if (donationsData.hasOwnProperty("$values")) {
            setDonations(donationsData["$values"]);
          } else {
            Alert.alert("Error", "No donations found.");
          }
        } catch (error) {
          console.error("Error loading user info and donations", error);
        }
      } else {
        console.log("User is not logged in");
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const totalDonations = donations.reduce(
    (sum, donation) => sum + donation.amount,
    0
  );

  const handleBookingHistory = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      try {
        const bookingResponse = await fetch(
          `https://soschildrenvillage.azurewebsites.net/api/Booking/GetBookingsWithSlotsByUserAccountId?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const bookingHistory = await bookingResponse.json();
        navigation.navigate("BookingHistory", { bookings: bookingHistory });
      } catch (error) {
        console.error("Error fetching booking history", error);
      }
    }
  };

  const handleTotalDonations = () => {
    Alert.alert(
      "Total Donations",
      `Total Donations: $${totalDonations.toFixed(2)}`
    );
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />
          <Text style={styles.title}>Name: {userInfo.userName}</Text>
          <Text>Email: {userInfo.userEmail}</Text>
          <Text>Phone: {userInfo.phone}</Text>
          <Text>Address: {userInfo.address}</Text>
          <Text>DOB: {userInfo.dob}</Text>
          <Text>Gender: {userInfo.gender}</Text>
          <Text>Country: {userInfo.country}</Text>

          <View style={styles.buttonContainer}>
            <Button title="Total Donate" onPress={handleTotalDonations} />
            <Button
              title="My Donations"
              onPress={() => navigation.navigate("Donations", { donations })}
            />
            <Button title="Booking History" onPress={handleBookingHistory} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ProfileScreen;
