import requests
import urllib.parse

def get_train_services(departure, destination, date):
    # Construct the URL using string formatting
    scheduleURL = "https://api.gotransit.com/v2/schedules/en/timetable/all?fromStop={}&toStop={}&date={}".format(
        urllib.parse.quote(departure),
        urllib.parse.quote(destination),
        urllib.parse.quote(date)
    )

    # Make the request to the API
    response = requests.get(scheduleURL)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Load the JSON data
        data = response.json()
        train_services = []

        for trip in data.get('trips', []):
            # Check if the transitType indicates a rail service
            if trip.get('transitType') == 1:  # Indicates rail
                line_info = trip.get('lines', [{}])[0]  # Get the first line's info
                from_stop = line_info.get('fromStopCode', 'N/A')
                to_stop = line_info.get('toStopCode', 'N/A')

                # Check if the trip's from and to stops match the desired stops
                if from_stop == departure and to_stop == destination:
                    service_info = {
                        "departure_time": trip['departureTimeDisplay'],
                        "arrival_time": trip['arrivalTimeDisplay'],
                        "duration": trip['duration'],
                        "line_display": line_info.get('lineDisplay', 'N/A'),
                        "trip_number": line_info.get('tripNumber', 'N/A'),
                        "from_stop": from_stop,
                        "to_stop": to_stop
                    }
                    train_services.append(service_info)

        if not train_services:
            print(f"There are no trains scheduled for {date} from {departure} to {destination}.")

        return train_services

    else:
        print(f"Error: {response.status_code}")
        return None

# Example usage
departure = "ME"
destination = "UN"
date = "2024-11-04"

# data for AL to UN
morning_train_services = get_train_services(departure, destination, date)
evening_train_services = get_train_services(destination, departure, date)

for service in morning_train_services:
    print(service)

for service in evening_train_services:
    print(service)
