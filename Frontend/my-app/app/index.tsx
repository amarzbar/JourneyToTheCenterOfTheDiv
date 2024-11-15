import React, { useState, useEffect } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { Picker as RNPicker } from '@react-native-picker/picker'; // Import Picker
import { stationsByLine } from './stations.js'; // Import the stations dictionary
import { getTrainServices } from './trains.js';

export default function Index() {
  // State for current time and greeting
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

  // State for selected line and stations for both schedules
  const [selectedLine, setSelectedLine] = useState("Lakeshore West");
  const [morningDeparture, setMorningDeparture] = useState("Aldershot"); // Default to Aldershot
  const [morningDestination, setMorningDestination] = useState("Union"); // Default to Union
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
    if (stationName === "Union") {
      return "UN";
    }
    for (const line in stationsByLine) {
      const station = stationsByLine[line].find(station => station.stationName === stationName);
      if (station) return station.stationCode;
    }
    return null;
  };

  // Function to fetch and update train services for morning
  const getMorningTrainServices = async () => {
    const date = "2024-11-15"; 
    const departureCode = getStationCode(morningDeparture); 
    const destinationCode = getStationCode(morningDestination); 
    console.log(`Fetching services from ${departureCode} to ${destinationCode} on ${date}`);
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      console.log("Morning Services:", services);
      setMorningTrainServices(services);
    } else {
      console.error("Invalid stations selected.");
      setMorningTrainServices([]);
    }
  };

  // Function to fetch and update train services for evening
  const getEveningTrainServices = async () => {
    const date = "2024-11-15"; 
    const departureCode = getStationCode(eveningDeparture); 
    const destinationCode = getStationCode(eveningDestination); 
    console.log(`Fetching services from ${departureCode} to ${destinationCode} on ${date}`);
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      console.log("Evening Services:", services);
      setEveningTrainServices(services);
    } else {
      console.error("Invalid stations selected.");
      setEveningTrainServices([]);
    }
  };

  // Function to handle the search button press
  const handleSearch = async () => {
    console.log("Search Button Pressed");
    // Log the selected stations
    console.log(`Selected stations for morning: ${morningDeparture} to ${morningDestination}`);
    console.log(`Selected stations for evening: ${eveningDeparture} to ${eveningDestination}`);
    // Make API calls with the updated state values
    await getMorningTrainServices();
    await getEveningTrainServices();
  };

  // Function to swap departure and destination stations
  const swapStations = (isMorning) => {
    if (isMorning) {
      // Use a temp variable to hold one of the values temporarily
      const temp = morningDeparture;
      setMorningDeparture(morningDestination);
      setMorningDestination(temp);
    } else {
      // Use a temp variable to hold one of the values temporarily
      const temp = eveningDeparture;
      setEveningDeparture(eveningDestination);
      setEveningDestination(temp);
    }
  };

  // Function to copy the reverse trip for the evening schedule
  const copyReverseEveningTrip = () => {
    setEveningDeparture(morningDestination);
    setEveningDestination(morningDeparture);
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
        style={{ height: 30, width: 200, marginBottom: 20 }} // Reduce height here
        onValueChange={(itemValue) => setSelectedLine(itemValue)}
      >
        {Object.keys(stationsByLine).map((line) => (
          <RNPicker.Item key={line} label={line} value={line} />
        ))}
      </RNPicker>

      {/* Morning Schedule */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 20 }}>Morning Schedule</Text>
        {morningTrainServices === null ? (
          <Text> Click search to fetch schedules</Text>
        ) : morningTrainServices.length > 0 ? (
          <RNPicker
            style={{ height: 30, width: 200, marginLeft: 10 }} // Reduce height here
            onValueChange={(selectedService) => console.log(selectedService)}
          >
            {morningTrainServices.map((service, index) => (
              <RNPicker.Item
                key={index}
                label={`${service.departure_time} - ${service.arrival_time} (${service.line_display})`}
                value={service} 
              />
            ))}
          </RNPicker>
        ) : (
          <Text>No morning trains available</Text>
        )}
      </View>

      {/* Departure and Destination for morning in a row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 18 }}>Departure Station</Text>
          <RNPicker
            selectedValue={morningDeparture}
            style={{ height: 30, width: 150 }} // Reduce height here
            onValueChange={(itemValue) => setMorningDeparture(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>

        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 18 }}>Destination Station</Text>
          <RNPicker
            selectedValue={morningDestination}
            style={{ height: 30, width: 150 }} // Reduce height here
            onValueChange={(itemValue) => setMorningDestination(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>
      </View>

      {/* Evening Schedule */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 20 }}>Evening Schedule</Text>
        {eveningTrainServices === null ? (
          <Text> Click search to fetch schedules</Text>
        ) : eveningTrainServices.length > 0 ? (
          <RNPicker
            style={{ height: 30, width: 200, marginLeft: 10 }} // Reduce height here
            onValueChange={(selectedService) => console.log(selectedService)}
          >
            {eveningTrainServices.map((service, index) => (
              <RNPicker.Item
                key={index}
                label={`${service.departure_time} - ${service.arrival_time} (${service.line_display})`}
                value={service} 
              />
            ))}
          </RNPicker>
        ) : (
          <Text>No evening trains available</Text>
        )}
      </View>

      {/* Departure and Destination for evening in a row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 18 }}>Departure Station</Text>
          <RNPicker
            selectedValue={eveningDeparture}
            style={{ height: 30, width: 150 }} // Reduce height here
            onValueChange={(itemValue) => setEveningDeparture(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>

        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 18 }}>Destination Station</Text>
          <RNPicker
            selectedValue={eveningDestination}
            style={{ height: 30, width: 150 }} // Reduce height here
            onValueChange={(itemValue) => setEveningDestination(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>
      </View>
      
      {/* Buttons at the bottom side by side with a small gap */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>
        {/* Copy Reverse Trip Button */}
        <Button title="Click for round-trip" onPress={copyReverseEveningTrip} style={{ marginRight: 30 }} />
        
        {/* Spacer (view with width to create a gap between the buttons) */}
        <View style={{ width: 20 }} />  {/* You can adjust the width as needed */}

        {/* Search Button */}
        <Button title="Search Train Schedules" onPress={handleSearch} />
      </View>
    </View>
  );
}
