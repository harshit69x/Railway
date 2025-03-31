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
  const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnrNumber}`
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f7b1ceb019msh1a72ae8d99fe975p11a898jsnb0dc845b74d7",
      "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
    },
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const result = await response.json()

    // For demo purposes, add mock passenger names if they don't exist
    if (result.success && result.data && result.data.passengerList) {
      result.data.passengerList.forEach((passenger, index) => {
        if (!passenger.passengerName) {
          passenger.passengerName = `Passenger ${index + 1}`
        }
      })
    }

    return result
  } catch (error) {
    console.error("Error fetching PNR status:", error)
    throw error
  }
}

/**
 * Fetch train status from the API
 * @param trainNumber - The train number
 * @param departureDate - The departure date in YYYYMMDD format
 * @returns Train status information
 */
export async function fetchTrainStatus(trainNumber: string, departureDate: string): Promise<TrainStatusResponse> {
  const url = `https://indian-railway-irctc.p.rapidapi.com/api/trains/v1/train/status?departure_date=${departureDate}&isH5=true&client=web&train_number=${trainNumber}`
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f7b1ceb019msh1a72ae8d99fe975p11a898jsnb0dc845b74d7",
      "x-rapidapi-host": "indian-railway-irctc.p.rapidapi.com",
      "x-rapid-api": "rapid-api-database",
    },
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching train status:", error)
    throw error
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
    const pnrStatus = await fetchPNRStatus(pnrNumber)

    if (!pnrStatus.success) {
      throw new Error("Failed to fetch PNR status")
    }

    const trainNumber = pnrStatus.data.trainNumber.toString()
    const departureDate = getCurrentDateFormatted()

    // Fetch train status
    const trainStatus = await fetchTrainStatus(trainNumber, departureDate)

    if (trainStatus.error) {
      throw new Error("Failed to fetch train status")
    }

    // Find current station and next station
    const stations = trainStatus.body.stations
    const currentStationCode = trainStatus.body.current_station

    let currentStationIndex = -1
    let currentStation: Station | null = null
    let nextStation: Station | null = null

    // Find the current station in the list
    for (let i = 0; i < stations.length; i++) {
      if (stations[i].stationCode === currentStationCode) {
        currentStationIndex = i
        currentStation = {
          code: stations[i].stationCode,
          name: stations[i].stationName,
          arrivalTime: stations[i].arrivalTime,
          departureTime: stations[i].departureTime,
          distance: stations[i].distance,
          platform: stations[i].expected_platform !== "-" ? stations[i].expected_platform : undefined,
        }
        break
      }
    }

    // Find the next station
    if (currentStationIndex !== -1 && currentStationIndex < stations.length - 1) {
      const next = stations[currentStationIndex + 1]
      nextStation = {
        code: next.stationCode,
        name: next.stationName,
        arrivalTime: next.arrivalTime,
        departureTime: next.departureTime,
        distance: next.distance,
        platform: next.expected_platform !== "-" ? next.expected_platform : undefined,
      }
    }

    // Get passenger information
    const passenger = pnrStatus.data.passengerList[0]

    return {
      trainNumber: pnrStatus.data.trainNumber,
      trainName: pnrStatus.data.trainName,
      currentStation,
      nextStation,
      eta: nextStation ? formatTime(nextStation.arrivalTime) : null,
      passengerInfo: {
        pnrNumber: pnrStatus.data.pnrNumber,
        coach: passenger.currentCoachId,
        berth: passenger.currentBerthNo,
        berthType: passenger.currentBerthCode,
        passengerName: passenger.passengerName || "Passenger", // Include passenger name
      },
    }
  } catch (error) {
    console.error("Error getting train tracking info:", error)
    return null
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

