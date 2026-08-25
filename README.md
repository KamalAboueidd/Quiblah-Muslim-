# Quiblah Muslim Web Application

## Overview

The Quiblah Muslim web application is a comprehensive, client-side progressive web application designed to provide essential Islamic tools. It is built purely with HTML, CSS, and Vanilla JavaScript, ensuring lightweight performance and broad compatibility across modern browsers and mobile devices.

The application integrates with various public APIs to provide accurate, real-time data for prayer times, Qibla direction, Quran recitation audio, and local supplications (Azkar).

## Features

### 1. Prayer Times (Mawaqit)
- Fetches accurate prayer times based on the user's geographic coordinates using the Aladhan API.
- Calculates and displays the time remaining for the upcoming prayer.
- Displays Hijri date conversions.

### 2. The Holy Quran (Al-Moshaf)
- Integrates with the Alquran.cloud API to fetch and render chapters (Surahs) and verses (Ayahs).
- Supports continuous scrolling for reading and features a clean, legible typography optimized for Arabic script.

### 3. Audio Player (Listen)
- A fully featured audio player resembling modern streaming platforms.
- Integrates with MP3Quran API v3.
- Curated list of prominent reciters with dynamic fallback avatars.
- Supports background playback, volume control, and progress seeking.
- Responsive mobile fullscreen layout for an optimized listening experience.

### 4. Qibla Compass
- Utilizes DeviceOrientation API (on Android) and WebkitCompassHeading (on iOS) to calculate accurate device orientation.
- Calculates the bearing to the Kaaba using standard geospatial formulas.
- Renders a responsive CSS-based compass that dynamically rotates to point toward the Qibla.

### 5. Azkar and Supplications
- Includes comprehensive JSON datasets for Morning and Evening Azkar (`azkar.json`, `short_azkar.json`).
- Features interactive counters for repeated supplications.
- Built-in haptic feedback and toast notifications upon completion of each Zikr.

### 6. Distance to Kaaba
- Calculates the geodesic distance between the user's current location and the Kaaba in Mecca.
- Uses Leaflet.js to render an interactive map visually connecting the two coordinates.

## Architecture and Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+).
- State Management: LocalStorage for user preferences and saved locations.
- Map Integration: Leaflet.js (Mapbox/OSM).
- HTTP Client: Axios for API requests.
- Iconography: FontAwesome.

## External APIs

1. Aladhan API (`https://api.aladhan.com`): Used for prayer times, Qibla bearing, and Hijri dates.
2. MP3Quran API (`https://www.mp3quran.net/api/v3`): Used for fetching reciters, servers, and audio files.
3. Alquran Cloud API (`https://api.alquran.cloud`): Used for fetching Quranic text.
4. UI Avatars (`https://ui-avatars.com`): Used for dynamic fallback image generation for reciters.

## File Structure

- `index.html`: Main dashboard and Prayer Times entry point.
- `quran.html`: Reading interface for the Holy Quran.
- `listen.html`: Audio player and reciter selection interface.
- `qibla.html`: Qibla compass implementation and sensor logic.
- `distance.html`: Interactive map and distance calculation tool.
- `azkar.html` / `sabah_masaa.html`: Supplication interfaces with tracking functionality.
- `toast.js`: Global notification system.
- `assets/`: Directory containing static media, backgrounds, and specific images.
- `*.json`: Static datasets for offline access to specific text content.

## Setup and Deployment

This project requires no build steps or bundlers. It can be served using any static file server.

1. Clone the repository.
2. Serve the directory using a local HTTP server (e.g., `python -m http.server`, or Node's `http-server`).
3. Open `index.html` in a web browser.

Note: Sensor functionalities (Qibla Compass, Geolocation) require the application to be served over HTTPS in production environments due to modern browser security policies.