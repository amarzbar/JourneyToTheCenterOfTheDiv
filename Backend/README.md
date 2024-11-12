API.py
----------

API.py contains the following function:

```def get_train_services(departure, destination, date)```

and returns a dictionary containing a list of train schedules for the selected departure and destination stops for the day. 

The dictionary contains the following parameters: ```departure_time, arrival_time, duration, line_display, trip_number, from_stop, to_stop```

Please note that the trips returned are one way and not round trip. In order to get the return trips, run the function again but swap the departure and destination locations. 

Please use the station's stopcode when passing in departure and destination as parameters. ```trainstations.csv``` contains a full list of train lines, train stations, and their corresponding stopcodes. 
