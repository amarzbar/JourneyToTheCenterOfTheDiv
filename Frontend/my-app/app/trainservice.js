async function getTrainServices(departure, destination, date) {
    // Construct the URL using template literals
    const scheduleURL = `https://api.gotransit.com/v2/schedules/en/timetable/all?fromStop=${encodeURIComponent(departure)}&toStop=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`;

    try {
        // Make the request to the API
        const response = await fetch(scheduleURL);

        // Check if the request was successful (status code 200)
        if (response.ok) {
            // Load the JSON data
            const data = await response.json();
            const trainServices = [];

            // Loop through the trips data
            for (const trip of data.trips || []) {
                // Check if the transitType indicates a rail service
                if (trip.transitType === 1) {  // Indicates rail
                    const lineInfo = trip.lines?.[0] || {};  // Get the first line's info
                    const fromStop = lineInfo.fromStopCode || 'N/A';
                    const toStop = lineInfo.toStopCode || 'N/A';

                    // Check if the trip's from and to stops match the desired stops
                    if (fromStop === departure && toStop === destination) {
                        const serviceInfo = {
                            departure_time: trip.departureTimeDisplay,
                            arrival_time: trip.arrivalTimeDisplay,
                            duration: trip.duration,
                            line_display: lineInfo.lineDisplay || 'N/A',
                            trip_number: lineInfo.tripNumber || 'N/A',
                            from_stop: fromStop,
                            to_stop: toStop
                        };
                        trainServices.push(serviceInfo);
                    }
                }
            }

            if (trainServices.length === 0) {
                console.log(`There are no trains scheduled for ${date} from ${departure} to ${destination}.`);
            }

            return trainServices;
        } else {
            console.log(`Error: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Example usage
const departure = "ME";
const destination = "UN";
const date = "2024-11-04";

// Get morning train services
getTrainServices(departure, destination, date).then(morningTrainServices => {
    morningTrainServices.forEach(service => {
        console.log(service);
    });
});

// Get evening train services
getTrainServices(destination, departure, date).then(eveningTrainServices => {
    eveningTrainServices.forEach(service => {
        console.log(service);
    });
});
