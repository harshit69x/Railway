/**
 * Railway Service API
 * This service handles all railway-related API calls including PNR status and train tracking
 */

// PNR Status API Response Type
export interface PNRStatusResponse {
  success: boolean
  data: {
    pnrNumber: number
    dateOfJourney: string
    trainNumber: number
    trainName: string
    sourceStation: string
    destinationStation: string
    reservationUpto: string
    boardingPoint: string
    journeyClass: string
    numberOfpassenger: number
    chartStatus: string
    passengerList: {
      passengerSerialNumber: number
      bookingStatus: string
      bookingCoachId: string
      bookingBerthNo: number
      bookingBerthCode: string
      bookingStatusDetails: string
      currentStatus: string
      currentCoachId: string
      currentBerthNo: number
      currentBerthCode: string
      currentStatusDetails: string
      passengerName?: string // Added passenger name field
    }[]
    timeStamp: string
    trainCancelStatus: string
    bookingFare: number
    ticketFare: number
    quota: string
  }
}

// Train Status API Response Type
export interface TrainStatusResponse {
  error: null | string
  status: {
    result: string
    message: {
      title: string
      message: string
    }
  }
  body: {
    time_of_availability: string
    current_station: string
    terminated: boolean
    server_timestamp: string
    train_status_message: string
    stations: {
      stationCode: string
      stationName: string
      arrivalTime: string
      departureTime: string
      distance: string
      dayCount: string
      actual_arrival_date: string
      actual_departure_date: string
      actual_arrival_time: string
      actual_departure_time: string
      expected_platform: string
    }[]
  }
}

// Station information type
export interface Station {
  code: string
  name: string
  arrivalTime: string
  departureTime: string
  distance: string
  platform?: string
}

// Train tracking information
export interface TrainTrackingInfo {
  trainNumber: number
  trainName: string
  currentStation: Station | null
  nextStation: Station | null
  sourceStation: string  // Added source station from PNR
  destinationStation: string  // Added destination station from PNR
  pnrNumber: number
  stationCode: string
  stationName: string
  eta: string | null
  passengerInfo: {
    pnrNumber: number
    coach: string
    berth: number
    berthType: string
    passengerName?: string // Added passenger name field
  }
}

/**
 * Fetch PNR status from the API
 * @param pnrNumber - The PNR number to check
 * @returns PNR status information
 */
export async function fetchPNRStatus(pnrNumber: string): Promise<PNRStatusResponse> {
  // Use the correct API endpoint format
  const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnrNumber}`;
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string,
      'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST_1 as string
    }
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error("Failed to fetch PNR status");
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching PNR status:", error);
    throw error;
  }
}

/**
 * Fetch train status from the API
 * @param trainNumber - The train number
 * @param departureDate - The departure date in YYYYMMDD format
 * @returns Train status information
 */
export async function fetchTrainStatus(trainNumber: string, departureDate: string): Promise<TrainStatusResponse> {
  const url = `https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status?departure_date=${departureDate}&isH5=true&client=web&train_number=${trainNumber}`;
  
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string,
      "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPIDAPI_HOST_2 as string,
      "x-rapid-api": "rapid-api-database"
    }
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching train status:", error);
    throw error;
  }
}

/**
 * Get the current date in YYYYMMDD format
 * @returns Current date in YYYYMMDD format
 */
export function getCurrentDateFormatted(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}${month}${day}`
}

/**
 * Format time in 12-hour format
 * @param time - Time in 24-hour format (HH:MM)
 * @returns Time in 12-hour format with AM/PM
 */
export function formatTime(time: string): string {
  if (time === "--" || !time) return "--"

  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const formattedHours = hours % 12 || 12

  return `${formattedHours}:${String(minutes).padStart(2, "0")} ${period}`
}

/**
 * Get train tracking information by combining PNR status and train status
 * @param pnrNumber - The PNR number
 * @returns Train tracking information
 */
export async function getTrainTrackingInfo(pnrNumber: string): Promise<TrainTrackingInfo | null> {
  try {
    // Fetch PNR status
    console.log("Fetching PNR status for:", pnrNumber);
    const pnrStatus = await fetchPNRStatus(pnrNumber);
    console.log("PNR Status Response:", JSON.stringify(pnrStatus, null, 2));

    if (!pnrStatus.success) {
      throw new Error("Failed to fetch PNR status");
    }

    const trainNumber = pnrStatus.data.trainNumber.toString();
    const departureDate = getCurrentDateFormatted();

    console.log("Fetching train status for train:", trainNumber, "on date:", departureDate);
    
    // Fetch train status
    const trainStatus = await fetchTrainStatus(trainNumber, departureDate);
    console.log("Train Status Response:", JSON.stringify(trainStatus, null, 2));

    if (trainStatus.error) {
      throw new Error(`Failed to fetch train status: ${trainStatus.error}`);
    }

    // Log important train status info for debugging
    console.log("Current Station Code:", trainStatus.body.current_station);
    console.log("Train Status Message:", trainStatus.body.train_status_message);
    console.log("Number of Stations:", trainStatus.body.stations.length);
    
    // Find current station and next station based on current time
    const stations = trainStatus.body.stations;
    const currentStationCode = trainStatus.body.current_station;
    
    let currentStationIndex = -1;
    let currentStation: Station | null = null;
    let nextStation: Station | null = null;

    // Get current date and time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    console.log("Current time (HH:MM):", `${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
    console.log("Current time in minutes:", currentTimeMinutes);
    
    // Try to find the current and next stations based on time
    let passedStations = 0;
    let foundNextStation = false;

    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      console.log(`Station ${i+1}: ${station.stationCode} (${station.stationName}) - Departure: ${station.departureTime}`);
      
      // Skip stations with no departure time
      if (station.departureTime === "--") {
        continue;
      }
      
      // Parse departure time
      const [depHours, depMinutes] = station.departureTime.split(":").map(Number);
      const depTimeMinutes = depHours * 60 + depMinutes;
      
      // Adjust for next day departures
      const adjustedDepTimeMinutes = station.dayCount && parseInt(station.dayCount) > 1 
        ? depTimeMinutes + (24 * 60 * (parseInt(station.dayCount) - 1)) 
        : depTimeMinutes;
      
      console.log(`  Station ${station.stationName} departure time in minutes:`, adjustedDepTimeMinutes);
      
      // If this station's departure time is in the past
      if (adjustedDepTimeMinutes < currentTimeMinutes) {
        passedStations++;
        console.log(`  Passed station: ${station.stationName}`);
        currentStationIndex = i;
        currentStation = {
          code: station.stationCode,
          name: station.stationName,
          arrivalTime: station.arrivalTime,
          departureTime: station.departureTime,
          distance: station.distance,
          platform: station.expected_platform !== "-" ? station.expected_platform : undefined,
        };
      } 
      // If this is the first upcoming station
      else if (!foundNextStation) {
        foundNextStation = true;
        console.log(`  Found next station: ${station.stationName}`);
        nextStation = {
          code: station.stationCode,
          name: station.stationName,
          arrivalTime: station.arrivalTime,
          departureTime: station.departureTime,
          distance: station.distance,
          platform: station.expected_platform !== "-" ? station.expected_platform : undefined,
        };
      }
    }
    
    console.log(`Passed ${passedStations} stations. Current station index: ${currentStationIndex}`);
    
    // If we couldn't determine current/next stations by time, use the API's current_station value
    if (currentStationCode && currentStationCode !== "") {
      for (let i = 0; i < stations.length; i++) {
        if (stations[i].stationCode === currentStationCode) {
          console.log("Using API's current station:", stations[i].stationName);
          currentStationIndex = i;
          currentStation = {
            code: stations[i].stationCode,
            name: stations[i].stationName,
            arrivalTime: stations[i].arrivalTime,
            departureTime: stations[i].departureTime,
            distance: stations[i].distance,
            platform: stations[i].expected_platform !== "-" ? stations[i].expected_platform : undefined,
          };
          
          // Set next station if not the last station
          if (i < stations.length - 1) {
            const next = stations[i + 1];
            nextStation = {
              code: next.stationCode,
              name: next.stationName,
              arrivalTime: next.arrivalTime,
              departureTime: next.departureTime,
              distance: next.distance,
              platform: next.expected_platform !== "-" ? next.expected_platform : undefined,
            };
          }
          break;
        }
      }
    }
    
    // If we still couldn't determine the stations, use fallback logic
    if (currentStationIndex === -1 || !currentStation) {
      console.warn("Couldn't determine current station, using fallback logic");
      
      // If train hasn't started yet (no passed stations), use first station as current
      if (passedStations === 0) {
        console.log("Train hasn't started yet, using first station as current");
        currentStation = {
          code: stations[0].stationCode,
          name: stations[0].stationName,
          arrivalTime: stations[0].arrivalTime,
          departureTime: stations[0].departureTime,
          distance: stations[0].distance,
          platform: stations[0].expected_platform !== "-" ? stations[0].expected_platform : undefined,
        };
        
        // Next station is the second station if available
        if (stations.length > 1) {
          nextStation = {
            code: stations[1].stationCode,
            name: stations[1].stationName,
            arrivalTime: stations[1].arrivalTime,
            departureTime: stations[1].departureTime,
            distance: stations[1].distance,
            platform: stations[1].expected_platform !== "-" ? stations[1].expected_platform : undefined,
          };
        }
      } 
      // If all stations are passed, use last station as current
      else if (passedStations === stations.length) {
        console.log("All stations passed, using last station as current");
        currentStation = {
          code: stations[stations.length - 1].stationCode,
          name: stations[stations.length - 1].stationName,
          arrivalTime: stations[stations.length - 1].arrivalTime,
          departureTime: stations[stations.length - 1].departureTime,
          distance: stations[stations.length - 1].distance,
          platform: stations[stations.length - 1].expected_platform !== "-" ? stations[stations.length - 1].expected_platform : undefined,
        };
        // No next station
        nextStation = null;
      }
    }
    
    // If next station is still not determined and we have a current station index
    if (!nextStation && currentStationIndex !== -1 && currentStationIndex < stations.length - 1) {
      const next = stations[currentStationIndex + 1];
      nextStation = {
        code: next.stationCode,
        name: next.stationName,
        arrivalTime: next.arrivalTime,
        departureTime: next.departureTime,
        distance: next.distance,
        platform: next.expected_platform !== "-" ? next.expected_platform : undefined,
      };
      console.log("Setting next station to:", nextStation.name);
    }

    // Get passenger information
    const passenger = pnrStatus.data.passengerList[0];
    console.log("Passenger info:", passenger);
    
    // For the source and destination stations from PNR
    const sourceStationName = pnrStatus.data.sourceStation;
    const destinationStationName = pnrStatus.data.destinationStation;
    console.log("PNR source station:", sourceStationName);
    console.log("PNR destination station:", destinationStationName);

    // If we have no current station, provide source from PNR
    if (!currentStation) {
      console.log("Using source station from PNR as current station");
      currentStation = {
        code: "UNK",
        name: sourceStationName,
        arrivalTime: "--",
        departureTime: "--",
        distance: "0",
      };
    }
    
    // If we have no next station, provide destination from PNR
    if (!nextStation) {
      console.log("Using destination station from PNR as next station");
      nextStation = {
        code: "UNK",
        name: destinationStationName,
        arrivalTime: "--",
        departureTime: "--",
        distance: "0",
      };
    }

    const result = {
      trainNumber: pnrStatus.data.trainNumber,
      trainName: pnrStatus.data.trainName,
      currentStation,
      nextStation,
      sourceStation: sourceStationName,
      destinationStation: destinationStationName, 
      pnrNumber: pnrStatus.data.pnrNumber,
      stationCode: nextStation.code,
      stationName: nextStation.name,
      eta: nextStation ? formatTime(nextStation.arrivalTime) : null,
      passengerInfo: {
        pnrNumber: pnrStatus.data.pnrNumber,
        coach: passenger.currentCoachId,
        berth: passenger.currentBerthNo,
        berthType: passenger.currentBerthCode,
        passengerName: passenger.passengerName || "Passenger",
      },
    };
    
    console.log("Final train tracking info:", result);
    return result;
  } catch (error) {
    console.error("Error getting train tracking info:", error);
    return null;
  }
}

/**
 * Get all stations from a train route
 * @param trainNumber - The train number
 * @returns List of stations
 */
export async function getTrainStations(trainNumber: string): Promise<Station[]> {
  try {
    const departureDate = getCurrentDateFormatted()
    const trainStatus = await fetchTrainStatus(trainNumber, departureDate)

    if (trainStatus.error) {
      throw new Error("Failed to fetch train status")
    }

    return trainStatus.body.stations.map((station) => ({
      code: station.stationCode,
      name: station.stationName,
      arrivalTime: station.arrivalTime,
      departureTime: station.departureTime,
      distance: station.distance,
      platform: station.expected_platform !== "-" ? station.expected_platform : undefined,
    }))
  } catch (error) {
    console.error("Error getting train stations:", error)
    return []
  }
}

