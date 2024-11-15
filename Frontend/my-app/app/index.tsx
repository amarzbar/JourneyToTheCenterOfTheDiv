import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("");

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Format time as "HH:MM:SS"
      const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
      setCurrentTime(formattedTime);

      // Update the greeting based on the current hour
      let newGreeting = "";
      if (hours >= 5 && hours < 12) {
        newGreeting = "Good morning!";
      } else if (hours >= 12 && hours < 18) {
        newGreeting = "Good afternoon!";
      } else if (hours >= 18 && hours < 24) {
        newGreeting = "Good evening!";
      } else {
        newGreeting = "Good night!"; // Late night greeting
      }
      setGreeting(newGreeting + " It is" );
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",  // Aligns content to the top
        alignItems: "flex-start",      // Left-aligns content
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {greeting} {currentTime}
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 10 }}>Morning Schedule</Text>
      <Text style={{ fontSize: 18 }}>Departure | Departing at</Text>
      <Text style={{ fontSize: 18 }}>Aldershot | 05:00</Text>
      <Text style={{ fontSize: 18 }}>Destination | Arrival</Text>
      <Text style={{ fontSize: 18 }}>Union | 8:30</Text>

      <Text style={{ fontSize: 20, marginVertical: 20 }}>Evening Schedule</Text>
      <Text style={{ fontSize: 18 }}>Departure | Departing at</Text>
      <Text style={{ fontSize: 18 }}>Union | 19:45</Text>
      <Text style={{ fontSize: 18 }}>Destination | Arrival</Text>
      <Text style={{ fontSize: 18 }}>Aldershot | 22:31</Text>

      <Text style={{ fontSize: 20, marginVertical: 20 }}>Alarm Notifications</Text>
      <Text style={{ fontSize: 18 }}>
        Alarm: 06:20, 22:21 (10 minutes prior to arrival)
      </Text>
    </View>
  );
}
