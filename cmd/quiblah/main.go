// Package main implements a high-performance CLI utility and lightweight microservice
// for calculating accurate Islamic prayer timings and geodesic Qibla direction.
// Developed as part of the Quiblah Muslim (قبلة المسلم) open-source suite.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"time"
)

const (
	// Kaaba coordinates (Mecca, Saudi Arabia)
	KaabaLat = 21.4225
	KaabaLng = 39.8262

	// Earth mean radius in kilometers
	EarthRadiusKm = 6371.0
)

// PrayerTimes represents the five daily Islamic prayer times plus Sunrise.
type PrayerTimes struct {
	Fajr    string `json:"fajr"`
	Sunrise string `json:"sunrise"`
	Dhuhr   string `json:"dhuhr"`
	Asr     string `json:"asr"`
	Maghrib string `json:"maghrib"`
	Isha    string `json:"isha"`
}

// QiblaInfo holds bearing and distance information relative to the Holy Kaaba.
type QiblaInfo struct {
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
	BearingDeg float64 `json:"bearing_deg"`
	DistanceKm float64 `json:"distance_km"`
	Direction  string  `json:"direction"`
}

// APIResponse encapsulates standard JSON response structure.
type APIResponse struct {
	Status    string       `json:"status"`
	Location  [2]float64   `json:"location"`
	Timestamp string       `json:"timestamp"`
	Qibla     QiblaInfo    `json:"qibla"`
	Prayers   *PrayerTimes `json:"prayers,omitempty"`
}

// degToRad converts degrees to radians.
func degToRad(deg float64) float64 {
	return deg * (math.Pi / 180.0)
}

// radToDeg converts radians to degrees.
func radToDeg(rad float64) float64 {
	return rad * (180.0 / math.Pi)
}

// CalculateQibla computes forward azimuth and geodesic distance to Mecca via Haversine.
func CalculateQibla(lat, lng float64) QiblaInfo {
	lat1 := degToRad(lat)
	lng1 := degToRad(lng)
	lat2 := degToRad(KaabaLat)
	lng2 := degToRad(KaabaLng)

	dLng := lng2 - lng1

	// Great-Circle Forward Azimuth
	y := math.Sin(dLng) * math.Cos(lat2)
	x := math.Cos(lat1)*math.Sin(lat2) - math.Sin(lat1)*math.Cos(lat2)*math.Cos(dLng)
	bearing := radToDeg(math.Atan2(y, x))
	bearing = math.Mod(bearing+360.0, 360.0)

	// Haversine Distance
	dLat := lat2 - lat1
	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Cos(lat1)*math.Cos(lat2)*math.Sin(dLng/2)*math.Sin(dLng/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	distance := EarthRadiusKm * c

	// Cardinal direction text
	cardinal := compassDirection(bearing)

	return QiblaInfo{
		Latitude:   lat,
		Longitude:  lng,
		BearingDeg: math.Round(bearing*100) / 100,
		DistanceKm: math.Round(distance*10) / 10,
		Direction:  cardinal,
	}
}

// compassDirection converts an angle into human-readable compass heading.
func compassDirection(deg float64) string {
	dirs := []string{"N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
		"S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"}
	idx := int(math.Round(deg/22.5)) % 16
	return dirs[idx]
}

// CalculatePrayerTimes approximates daily prayer times based on astronomical solar positioning.
func CalculatePrayerTimes(lat, lng float64, t time.Time, timezoneOffsetHours float64) PrayerTimes {
	dayOfYear := float64(t.YearDay())

	// Approximate solar declination (Cooper's formula)
	declination := 23.45 * math.Sin(degToRad((360.0/365.0)*(dayOfYear-81.0)))

	// Equation of time in minutes
	b := degToRad((360.0 / 364.0) * (dayOfYear - 81.0))
	eqTime := 9.87*math.Sin(2*b) - 7.53*math.Cos(b) - 1.5*math.Sin(b)

	// Solar noon (Dhuhr) in local hours
	solarNoonUTC := 12.0 - (lng / 15.0) - (eqTime / 60.0)
	solarNoonLocal := solarNoonUTC + timezoneOffsetHours

	// Hour angle function for given altitude angle
	hourAngle := func(alpha float64) float64 {
		radAlpha := degToRad(alpha)
		radLat := degToRad(lat)
		radDec := degToRad(declination)
		cosHA := (math.Sin(radAlpha) - math.Sin(radLat)*math.Sin(radDec)) / (math.Cos(radLat) * math.Cos(radDec))
		if cosHA > 1.0 {
			cosHA = 1.0
		} else if cosHA < -1.0 {
			cosHA = -1.0
		}
		return radToDeg(math.Acos(cosHA)) / 15.0
	}

	// Standard astronomical calculation angles:
	// Fajr: -18.0°, Sunrise: -0.833°, Maghrib: -0.833°, Isha: -17.0°
	haFajr := hourAngle(-18.0)
	haSunrise := hourAngle(-0.833)
	haIsha := hourAngle(-17.0)

	// Asr angle based on shadow length: cot(AsrAngle) = 1 + tan|lat - dec|
	zenith := math.Abs(lat - declination)
	asrAngle := radToDeg(math.Atan(1.0 / (1.0 + math.Tan(degToRad(zenith)))))
	haAsr := hourAngle(asrAngle)

	formatHours := func(h float64) string {
		h = math.Mod(h+24.0, 24.0)
		hours := int(h)
		minutes := int(math.Round((h - float64(hours)) * 60.0))
		if minutes >= 60 {
			hours++
			minutes = 0
		}
		return fmt.Sprintf("%02d:%02d", hours%24, minutes)
	}

	return PrayerTimes{
		Fajr:    formatHours(solarNoonLocal - haFajr),
		Sunrise: formatHours(solarNoonLocal - haSunrise),
		Dhuhr:   formatHours(solarNoonLocal),
		Asr:     formatHours(solarNoonLocal + haAsr),
		Maghrib: formatHours(solarNoonLocal + haSunrise),
		Isha:    formatHours(solarNoonLocal + haIsha),
	}
}

// startHTTPService launches a lightweight HTTP microservice API for Quiblah Muslim.
func startHTTPService(port int) {
	mux := http.NewServeMux()

	// CORS middleware
	enableCORS := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	mux.HandleFunc("/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "healthy",
			"service": "quiblah-muslim-go",
			"time":    time.Now().UTC().Format(time.RFC3339),
		})
	}))

	mux.HandleFunc("/api/qibla", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		lat := 30.0444 // Default to Cairo
		lng := 31.2357
		if latStr := r.URL.Query().Get("lat"); latStr != "" {
			_, _ = fmt.Sscanf(latStr, "%f", &lat)
		}
		if lngStr := r.URL.Query().Get("lng"); lngStr != "" {
			_, _ = fmt.Sscanf(lngStr, "%f", &lng)
		}

		qibla := CalculateQibla(lat, lng)
		now := time.Now()
		_, offsetSec := now.Zone()
		tzOffset := float64(offsetSec) / 3600.0
		prayers := CalculatePrayerTimes(lat, lng, now, tzOffset)

		resp := APIResponse{
			Status:    "success",
			Location:  [2]float64{lat, lng},
			Timestamp: now.UTC().Format(time.RFC3339),
			Qibla:     qibla,
			Prayers:   &prayers,
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(resp)
	}))

	addr := fmt.Sprintf(":%d", port)
	log.Printf("[Quiblah-Muslim] Go microservice listening on http://localhost%s\n", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func main() {
	serveFlag := flag.Bool("serve", false, "Start lightweight HTTP API microservice")
	portFlag := flag.Int("port", 8080, "Port for the HTTP microservice")
	latFlag := flag.Float64("lat", 30.0444, "Observer Latitude in decimal degrees (Default: Cairo)")
	lngFlag := flag.Float64("lng", 31.2357, "Observer Longitude in decimal degrees (Default: Cairo)")
	flag.Parse()

	if *serveFlag {
		startHTTPService(*portFlag)
		return
	}

	// CLI Display Mode
	now := time.Now()
	_, offsetSec := now.Zone()
	tzOffset := float64(offsetSec) / 3600.0

	qibla := CalculateQibla(*latFlag, *lngFlag)
	prayers := CalculatePrayerTimes(*latFlag, *lngFlag, now, tzOffset)

	fmt.Println("==========================================================")
	fmt.Println("         Quiblah Muslim (قبلة المسلم) - Go CLI Engine      ")
	fmt.Println("==========================================================")
	fmt.Printf("Location Coordinates : %.4f° N, %.4f° E\n", *latFlag, *lngFlag)
	fmt.Printf("Current Date & Time  : %s\n", now.Format("2006-01-02 15:04:05 MST"))
	fmt.Println("----------------------------------------------------------")
	fmt.Printf("Qibla Bearing Angle  : %.2f° (%s)\n", qibla.BearingDeg, qibla.Direction)
	fmt.Printf("Distance to Kaaba    : %.1f km\n", qibla.DistanceKm)
	fmt.Println("----------------------------------------------------------")
	fmt.Println("Astronomical Solar Prayer Times:")
	fmt.Printf("  Fajr    : %s\n", prayers.Fajr)
	fmt.Printf("  Sunrise : %s\n", prayers.Sunrise)
	fmt.Printf("  Dhuhr   : %s\n", prayers.Dhuhr)
	fmt.Printf("  Asr     : %s\n", prayers.Asr)
	fmt.Printf("  Maghrib : %s\n", prayers.Maghrib)
	fmt.Printf("  Isha    : %s\n", prayers.Isha)
	fmt.Println("==========================================================")
	fmt.Println("Tip: Run with `-serve -port 8080` to launch the API microservice.")
	os.Exit(0)
}
