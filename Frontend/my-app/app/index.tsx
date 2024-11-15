import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { Picker as RNPicker } from '@react-native-picker/picker'; // Import Picker
import { stationsByLine } from './stations.js'; // Import the stations dictionary

// Fetch train services from the API
const fetchTrainServices = async (departure, destination, date) => {
  const url = `http://localhost:5000/api/train-services?departure=${departure}&destination=${destination}&date=${date}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data; // Return the parsed JSON
  } catch (error) {
    console.error("Error fetching train services:", error);
    return null; // Return null if there's an error
  }
};

export default function Index() {
  // State for current time and greeting
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

  // State for selected line and stations for both schedules
  const [selectedLine, setSelectedLine] = useState("Lakeshore West");
  const [morningDeparture, setMorningDeparture] = useState("Aldershot");
  const [morningDestination, setMorningDestination] = useState("Union");
  const [eveningDeparture, setEveningDeparture] = useState("Union");
  const [eveningDestination, setEveningDestination] = useState("Aldershot");

  // State to store the fetched train services
  const [morningTrainServices, setMorningTrainServices] = useState(null);
  const [eveningTrainServices, setEveningTrainServices] = useState(null);

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
      setGreeting(newGreeting + " It is");
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to fetch and update train services for morning
  const getMorningTrainServices = async () => {
    const date = "2024-11-04"; // Hardcoded date (could be dynamic)
    const services = await fetchTrainServices(morningDeparture, morningDestination, date);
    setMorningTrainServices(services);
  };

  // Function to fetch and update train services for evening
  const getEveningTrainServices = async () => {
    const date = "2024-11-04"; // Hardcoded date (could be dynamic)
    const services = await fetchTrainServices(eveningDeparture, eveningDestination, date);
    setEveningTrainServices(services);
  };

  // Trigger API call when any departure or destination is changed
  useEffect(() => {
    getMorningTrainServices();
  }, [morningDeparture, morningDestination]);

  useEffect(() => {
    getEveningTrainServices();
  }, [eveningDeparture, eveningDestination]);

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {greeting} {currentTime}
      </Text>

      {/* Line Selection Dropdown */}
      <Text style={{ fontSize: 20 }}>Select Line</Text>
      <RNPicker
        selectedValue={selectedLine}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setSelectedLine(itemValue)}
      >
        {Object.keys(stationsByLine).map((line) => (
          <RNPicker.Item key={line} label={line} value={line} />
        ))}
      </RNPicker>

      {/* Morning Schedule */}
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Morning Schedule</Text>
      
      {/* Departure dropdown for morning */}
      <Text style={{ fontSize: 18 }}>Departure Station</Text>
      <RNPicker
        selectedValue={morningDeparture}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setMorningDeparture(itemValue)}
      >
        {stationsByLine[selectedLine].map((station) => (
          <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
        ))}
      </RNPicker>

      {/* Destination dropdown for morning */}
      <Text style={{ fontSize: 18 }}>Destination Station</Text>
      <RNPicker
        selectedValue={morningDestination}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setMorningDestination(itemValue)}
      >
        {stationsByLine[selectedLine].map((station) => (
          <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
        ))}
      </RNPicker>

      {/* Display fetched morning train services */}
      <Text style={{ fontSize: 18 }}>Morning Train Services:</Text>
      {morningTrainServices ? (
        <View>
          {morningTrainServices.map((service, index) => (
            <Text key={index}>{service.departure_time} - {service.arrival_time} ({service.line_display})</Text>
          ))}
        </View>
      ) : (
        <Text>No morning trains available.</Text>
      )}

      {/* Evening Schedule */}
      <Text style={{ fontSize: 20, marginVertical: 20 }}>Evening Schedule</Text>
      
      {/* Departure dropdown for evening */}
      <Text style={{ fontSize: 18 }}>Departure Station</Text>
      <RNPicker
        selectedValue={eveningDeparture}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setEveningDeparture(itemValue)}
      >
        {stationsByLine[selectedLine].map((station) => (
          <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
        ))}
      </RNPicker>

      {/* Destination dropdown for evening */}
      <Text style={{ fontSize: 18 }}>Destination Station</Text>
      <RNPicker
        selectedValue={eveningDestination}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => setEveningDestination(itemValue)}
      >
        {stationsByLine[selectedLine].map((station) => (
          <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
        ))}
      </RNPicker>

      {/* Display fetched evening train services */}
      <Text style={{ fontSize: 18 }}>Evening Train Services:</Text>
      {eveningTrainServices ? (
        <View>
          {eveningTrainServices.map((service, index) => (
            <Text key={index}>{service.departure_time} - {service.arrival_time} ({service.line_display})</Text>
          ))}
        </View>
      ) : (
        <Text>No evening trains available.</Text>
      )}
    </View>
  );
}
