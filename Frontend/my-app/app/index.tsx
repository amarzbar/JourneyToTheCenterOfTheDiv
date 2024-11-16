import React, { useState, useEffect } from "react";
import { Text, View, Button, TouchableOpacity, Linking } from "react-native";
import { Picker as RNPicker } from '@react-native-picker/picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { stationsByLine } from './stations.js'; 
import { getTrainServices } from './trains.js';

export default function Index() {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [selectedLine, setSelectedLine] = useState("Lakeshore West");

  // Set default stations as Aldershot (departure) and Union (destination)
  const [morningDeparture, setMorningDeparture] = useState("Aldershot");
  const [morningDestination, setMorningDestination] = useState("Union");
  const [eveningDeparture, setEveningDeparture] = useState("Union");
  const [eveningDestination, setEveningDestination] = useState("Aldershot");

  const [morningTrainServices, setMorningTrainServices] = useState(null);
  const [eveningTrainServices, setEveningTrainServices] = useState(null);

  // Load saved state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('trainState');
        if (savedState) {
          const {
            selectedLine,
            morningDeparture,
            morningDestination,
            eveningDeparture,
            eveningDestination
          } = JSON.parse(savedState);

          // Use saved values if available, otherwise fallback to defaults
          setSelectedLine(selectedLine || "Lakeshore West");
          setMorningDeparture(morningDeparture || "Aldershot");
          setMorningDestination(morningDestination || "Union");
          setEveningDeparture(eveningDeparture || "Union");
          setEveningDestination(eveningDestination || "Aldershot");
        }
      } catch (error) {
        console.error("Failed to load saved state", error);
      }
    };

    loadSavedState();

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
      setCurrentTime(formattedTime);

      let newGreeting = "";
      if (hours >= 5 && hours < 12) {
        newGreeting = "Good morning!";
      } else if (hours >= 12 && hours < 16) {
        newGreeting = "Good afternoon!";
      } else if (hours >= 16 && hours < 20) {
        newGreeting = "Good evening!";
      } else {
        newGreeting = "Working late!";
      }
      setGreeting(newGreeting + " It is");
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const saveStateToAsyncStorage = async () => {
    const stateToSave = {
      selectedLine,
      morningDeparture,
      morningDestination,
      eveningDeparture,
      eveningDestination,
    };

    try {
      await AsyncStorage.setItem('trainState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state", error);
    }
  };

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

  const getMorningTrainServices = async () => {
    const date = "2024-11-15"; 
    const departureCode = getStationCode(morningDeparture); 
    const destinationCode = getStationCode(morningDestination); 
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      setMorningTrainServices(services);
    } else {
      setMorningTrainServices([]);
    }
  };

  const getEveningTrainServices = async () => {
    const date = "2024-11-15"; 
    const departureCode = getStationCode(eveningDeparture); 
    const destinationCode = getStationCode(eveningDestination); 
    if (departureCode && destinationCode) {
      const services = await getTrainServices(departureCode, destinationCode, date);
      setEveningTrainServices(services);
    } else {
      setEveningTrainServices([]);
    }
  };

  const handleSearch = async () => {
    await getMorningTrainServices();
    await getEveningTrainServices();
    saveStateToAsyncStorage(); // Save state to AsyncStorage whenever the search is triggered
  };

  const swapStations = (isMorning) => {
    if (isMorning) {
      const temp = morningDeparture;
      setMorningDeparture(morningDestination);
      setMorningDestination(temp);
    } else {
      const temp = eveningDeparture;
      setEveningDeparture(eveningDestination);
      setEveningDestination(temp);
    }
  };

  const copyReverseEveningTrip = () => {
    setEveningDeparture(morningDestination);
    setEveningDestination(morningDeparture);
  };

  const openCorsDemo = () => {
    Linking.openURL('https://cors-anywhere.herokuapp.com/corsdemo');
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {greeting} {currentTime}
      </Text>

      <Text style={{ fontSize: 20 }}>Select Line</Text>
      <RNPicker
        selectedValue={selectedLine}
        style={{ height: 50, width: 200, marginBottom: 20 }}
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
            style={{ height: 50, width: 200, marginLeft: 10 }}
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

      {/* Departure and Destination for morning */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 18 }}>Departure</Text>
          <RNPicker
            selectedValue={morningDeparture}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => setMorningDeparture(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>

        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 18 }}>Destination</Text>
          <RNPicker
            selectedValue={morningDestination}
            style={{ height: 50, width: 150 }}
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
            style={{ height: 50, width: 200, marginLeft: 10 }}
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

      {/* Departure and Destination for evening */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 18 }}>Departure</Text>
          <RNPicker
            selectedValue={eveningDeparture}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => setEveningDeparture(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>

        <View style={{ marginLeft: 5 }}>
          <Text style={{ fontSize: 18 }}>Destination</Text>
          <RNPicker
            selectedValue={eveningDestination}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => setEveningDestination(itemValue)}
          >
            {stationsByLine[selectedLine].map((station) => (
              <RNPicker.Item key={station.stationCode} label={station.stationName} value={station.stationName} />
            ))}
          </RNPicker>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 20 }}>
        <Button title="Click for round-trip" onPress={copyReverseEveningTrip} style={{ marginRight: 30 }} />
        <View style={{ width: 20 }} />
        <Button title="Search Train Schedules" onPress={handleSearch} />
      </View>

      {/* Link to CORS Anywhere demo */}
      <TouchableOpacity onPress={openCorsDemo} style={{ marginTop: 30 }}>
        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
          Debug
        </Text>
      </TouchableOpacity>
    </View>
  );
}
