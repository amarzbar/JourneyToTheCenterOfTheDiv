import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { Picker as RNPicker } from '@react-native-picker/picker'; // Import Picker
import { stationsByLine } from './stations.js'; // Import the stations dictionary
import { getTrainServices } from './trains.js';

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
      } else if (hours >= 12 && hours < 16) {
        newGreeting = "Good afternoon!";
      } else if (hours >= 16 && hours < 20) {
        newGreeting = "Good evening!";
      } else {
        newGreeting = "Good night!"; // Late night greeting
      }
      setGreeting(newGreeting + " It is");
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Helper function to map station name to station code
  const getStationCode = (stationName) => {
    // Directly return the code for "Union" station
    if (stationName === "Union") {
      return "UN";
    }
  
    // Otherwise, look up the station in the stationsByLine dictionary
    for (const line in stationsByLine) {
      const station = stationsByLine[line].find(station => station.stationName === stationName);
      if (station) return station.stationCode; // Return the station code
    }
  
    return null; // Return null if no matching station is found
  };

  // Function to fetch and update train services for morning
  const getMorningTrainServices = async () => {
    const date = "2024-11-15"; // Hardcoded date (could be dynamic)
    const departureCode = getStationCode(morningDeparture); // Convert name to code
    const destinationCode = getStationCode(morningDestination); // Convert name to code
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      setMorningTrainServices(services);
    } else {
      console.error("Invalid stations selected.");
      setMorningTrainServices([]); // Set empty array if no valid stations
    }
  };

  // Function to fetch and update train services for evening
  const getEveningTrainServices = async () => {
    const date = "2024-11-15"; // Hardcoded date (could be dynamic)
    const departureCode = getStationCode(eveningDeparture); // Convert name to code
    const destinationCode = getStationCode(eveningDestination); // Convert name to code
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      setEveningTrainServices(services);
    } else {
      console.error("Invalid stations selected.");
      setEveningTrainServices([]); // Set empty array if no valid stations
    }
  };

  // Function to handle the search button press
  const handleSearch = () => {
    getMorningTrainServices();
    getEveningTrainServices();
  };

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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>Morning Schedule</Text>

        {/* Morning Train Service Dropdown */}
        {morningTrainServices && morningTrainServices.length > 0 ? (
          <RNPicker
            style={{ height: 50, width: 200, marginLeft: 10 }}
            onValueChange={(selectedService) => console.log(selectedService)} // Handle selection if needed
          >
            {morningTrainServices.map((service, index) => (
              <RNPicker.Item
                key={index}
                label={`${service.departure_time} - ${service.arrival_time} (${service.line_display})`}
                value={service} // You can store the full service object if you need to use it
              />
            ))}
          </RNPicker>
        ) : (
          <Text> No morning trains available.</Text>
        )}
      </View>

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

      {/* Evening Schedule */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 20 }}>Evening Schedule</Text>

        {/* Evening Train Service Dropdown */}
        {eveningTrainServices && eveningTrainServices.length > 0 ? (
          <RNPicker
            style={{ height: 50, width: 200, marginLeft: 10 }}
            onValueChange={(selectedService) => console.log(selectedService)} // Handle selection if needed
          >
            {eveningTrainServices.map((service, index) => (
              <RNPicker.Item
                key={index}
                label={`${service.departure_time} - ${service.arrival_time} (${service.line_display})`}
                value={service} // You can store the full service object if you need to use it
              />
            ))}
          </RNPicker>
        ) : (
          <Text> No evening trains available.</Text>
        )}
      </View>

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

      {/* Search Button */}
      <Button title="Search for Train Services" onPress={handleSearch} />
    </View>
  );
}
