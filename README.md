# Quiblah Muslim (Quiblah-Muslim-)

A modern, comprehensive Islamic Progressive Web Application (PWA) engineered to provide precise prayer timings, Holy Quran reading and tafseer, continuous audio recitation streaming, an accurate Qibla compass, interactive nearby mosque mapping, daily adhkar counters, and background Web Push notifications.

Built purely with Vanilla JavaScript, modular CSS, and semantic HTML5, designed for high performance, smooth mobile interactivity, and complete offline capability.

---

## Table of Contents

- Overview
- Core Features and Mobile Screenshots
  - 1. Prayer Times and Islamic Dashboard
  - 2. Holy Quran Reader
  - 3. Quran Tafseer and Commentary
  - 4. Quran Audio Streaming Player
  - 5. Daily Azkar and Supplications
  - 6. Morning and Evening Adhkar (Sabah and Masaa)
  - 7. 99 Names of Allah (Asmaul Husna)
  - 8. Qibla Direction Compass
  - 9. Nearby Mosques Finder
  - 10. Geodesic Distance to Kaaba
- Modular Architecture
- Code Organization and Language Statistics
- Technical Stack
- Local Installation and Setup
- Progressive Web App (PWA) Offline Operation
- Contributing
- License and Author

---

## Overview

Quiblah Muslim is an open-source Islamic web application designed to serve as an indispensable daily companion for Muslims around the world. The application runs entirely client-side with minimal server dependencies, guaranteeing swift load speeds, robust offline usability, and broad cross-platform compatibility across iOS, Android, macOS, and Windows.

---

## Core Features and Mobile Screenshots

### 1. Prayer Times and Islamic Dashboard

Displays exact daily prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) tailored to the user's geographic coordinates, alongside a dynamic countdown timer for the upcoming prayer and dual Gregorian and Hijri calendar conversions.

| Prayer Times Overview | Countdown and Timings Schedule |
| :---: | :---: |
| <img src="assets/ShotsREADME/PrayTime/f1.png" width="340" alt="Prayer Times Overview" /> | <img src="assets/ShotsREADME/PrayTime/f2.png" width="340" alt="Countdown and Timings Schedule" /> |

- **How It Works**:
  - Automatically requests user geolocation permissions via `navigator.geolocation`.
  - Queries the Aladhan API to obtain calculation parameters based on standard international authorities.
  - Updates remaining seconds every second through an asynchronous timer in `features/home/home.js`.
  - Features dynamic background transitions matching the atmospheric mood of the current time.

---

### 2. Holy Quran Reader

A full-fledged Quran reading experience featuring all 114 Surahs rendered in authentic Madani Arabic typography, an interactive surah selection drawer, search filters, and instant verse-level tafseer lookup.

| Surahs Drawer (Search & Index) | Surah Header & Audio Controls | Verse Reading Flow | Quick Verse Tafseer Modal |
| :---: | :---: | :---: | :---: |
| <img src="assets/ShotsREADME/Quran/im1.png" width="220" alt="Surahs Drawer" /> | <img src="assets/ShotsREADME/Quran/im2.png" width="220" alt="Surah Header" /> | <img src="assets/ShotsREADME/Quran/im3.png" width="220" alt="Verse Reading Flow" /> | <img src="assets/ShotsREADME/Quran/im4.png" width="220" alt="Quick Tafseer Modal" /> |

- **How It Works**:
  - Preloaded locally from `core/quran_data.js` and `core/surahs_meta.js` for instant, zero-latency offline reading.
  - Features side-by-side action buttons on mobile for reading tafseer and playing audio recitation simultaneously.
  - Clicking any verse number opens a transparent frosted-glass modal with verse-level explanation without interrupting the reading experience.

---

### 3. Quran Tafseer and Commentary

An extensive study module offering verse-by-verse commentary from reputable sources (Al-Tafseer Al-Muyassar and Tafseer Al-Jalalayn), coupled with ayah recitation playback, copying, and sharing capabilities.

| Tafseer Surah Overview | Verse Commentary Cards | Tafseer Search & Jump |
| :---: | :---: | :---: |
| <img src="assets/ShotsREADME/Tafseer/im1.png" width="280" alt="Tafseer Surah Overview" /> | <img src="assets/ShotsREADME/Tafseer/im2.png" width="280" alt="Verse Commentary Cards" /> | <img src="assets/ShotsREADME/Tafseer/im3.png" width="280" alt="Tafseer Search & Jump" /> |

- **How It Works**:
  - Dynamically fetches commentary through asynchronous APIs with batched rendering for high performance.
  - Features individual verse audio playback and instant copy/share functionality.
  - Employs a transparent frosted glass sidebar drawer for fast surah switching on mobile devices.

---

### 4. Quran Audio Streaming Player

A modern continuous audio player inspired by international streaming platforms that continues playing recitations smoothly across page navigations without interruption.

| Curated Reciters Catalog | Surahs Recitation List | Compact Player Bar | Expanded Fullscreen Player |
| :---: | :---: | :---: | :---: |
| <img src="assets/ShotsREADME/Listen_To_Quran/m1.png" width="220" alt="Reciters Catalog" /> | <img src="assets/ShotsREADME/Listen_To_Quran/m2.png" width="220" alt="Surahs Recitation List" /> | <img src="assets/ShotsREADME/Listen_To_Quran/m3.png" width="220" alt="Compact Player Bar" /> | <img src="assets/ShotsREADME/Listen_To_Quran/m4.png" width="220" alt="Expanded Fullscreen Player" /> |

- **How It Works**:
  - Integrates with the MP3Quran API v3 covering prominent reciters (e.g., Mishary Rashid Alafasy, Abdul Basit, Yasser Al-Dosari, Mahmoud Khalil Al-Husary).
  - Uses `core/player-bridge.js` to communicate with the root frame, ensuring non-stop playback while browsing other sections.
  - Supports track scrubbing, seeking, volume controls, and mobile fullscreen expansion.
  - Renders over an animated background image carousel with translucent glassmorphic cards.

---

### 5. Daily Azkar and Supplications

A rich library of daily Islamic supplications with interactive repetition counters and sensory feedback.

| Supplication Categories | Interactive Azkar Counter | Completed Zikr State |
| :---: | :---: | :---: |
| <img src="assets/ShotsREADME/Azkar/im1.png" width="280" alt="Supplication Categories" /> | <img src="assets/ShotsREADME/Azkar/im2.png" width="280" alt="Interactive Azkar Counter" /> | <img src="assets/ShotsREADME/Azkar/im3.png" width="280" alt="Completed Zikr State" /> |

- **How It Works**:
  - Sourced from structured local datasets (`data/azkar.json` and `data/short_azkar.json`).
  - Interactive touch counters update repetition counts with vibration pulses via `navigator.vibrate`.
  - Automatically saves completion states in browser LocalStorage.

---

### 6. Morning and Evening Adhkar (Sabah and Masaa)

Dedicated section for Morning and Evening remembrance prayers with a twin-button category selector and electronic digital tasbeeh.

| Morning & Evening Selection | Adhkar Reading & Counter | Completed Session Feedback |
| :---: | :---: | :---: |
| <img src="assets/ShotsREADME/NightAndMoring/im1.png" width="280" alt="Morning & Evening Selection" /> | <img src="assets/ShotsREADME/NightAndMoring/im2.png" width="280" alt="Adhkar Reading & Counter" /> | <img src="assets/ShotsREADME/NightAndMoring/im3.png" width="280" alt="Completed Session Feedback" /> |

- **How It Works**:
  - Automatically suggests morning or evening prayers depending on the current time of day.
  - Displays virtues, Hadith references, and repetition counts for each supplication.

---

### 7. 99 Names of Allah (Asmaul Husna)

A complete visual catalog of the 99 Beautiful Names of Allah with Arabic calligraphy, transliteration, English translation, and theological meanings.

<p align="center">
  <img src="assets/ShotsREADME/ALLAH_Names/image.png" width="380" alt="99 Names of Allah Catalog" />
</p>

- **How It Works**:
  - Rendered dynamically from `data/names.json`.
  - Supports real-time client-side search filtering by name, number, or virtue.
  - Smooth card flip and accordion animations for reading comprehensive descriptions.

---

### 8. Qibla Direction Compass

A precision digital compass calculating and visualizing the exact bearing to the Holy Kaaba in Mecca from any location worldwide.

| Compass Sensor Alignment | Calibrated Qibla Azimuth |
| :---: | :---: |
| <img src="assets/ShotsREADME/Quiblah/m1.png" width="340" alt="Compass Sensor Alignment" /> | <img src="assets/ShotsREADME/Quiblah/m2.png" width="340" alt="Calibrated Qibla Azimuth" /> |

- **How It Works**:
  - Leverages `DeviceOrientationEvent` (`webkitCompassHeading` for iOS and absolute orientation angles for Android).
  - Calculates the forward azimuth to Mecca (21.4225° N, 39.8262° E) using great-circle spherical trigonometry.
  - Renders a hardware-accelerated compass rose and needle that smoothly tracks device movement.

---

### 9. Nearby Mosques Finder

An interactive geospatial mapping tool finding mosques within customizable search perimeters (1 km, 2 km, 3 km, and 5 km) around the user.

| Interactive Map Overview | Walking Distance Guidelines | Distance Guidelines Arc | Mosque Details Bottom Card | Direct Route Telemetry |
| :---: | :---: | :---: | :---: | :---: |
| <img src="assets/ShotsREADME/Masjed/m1.png" width="180" alt="Nearby Mosques Map" /> | <img src="assets/ShotsREADME/Masjed/m2.png" width="180" alt="Walking Distance Guidelines" /> | <img src="assets/ShotsREADME/Masjed/m3.png" width="180" alt="Distance Guidelines Arc" /> | <img src="assets/ShotsREADME/Masjed/m4.png" width="180" alt="Mosque Details Card" /> | <img src="assets/ShotsREADME/Masjed/m5.png" width="180" alt="Direct Route Telemetry" /> |

- **How It Works**:
  - Powered by Leaflet.js and OpenStreetMap cartography.
  - Queries the OpenStreetMap Overpass API for places of worship tagged with `amenity=place_of_worship` and `religion=muslim`.
  - Calculates straight-line walking distances and dynamically draws visual navigation guide paths.

---

### 10. Geodesic Distance to Kaaba

An interactive cartographic feature measuring the exact distance in kilometers from the user's home location to the Holy Kaaba in Mecca.

| Flight Route to Mecca | Geodesic Line and Measurements |
| :---: | :---: |
| <img src="assets/ShotsREADME/From_Home_to_Elharam/m1.png" width="340" alt="Flight Route to Mecca" /> | <img src="assets/ShotsREADME/From_Home_to_Elharam/m2.png" width="340" alt="Geodesic Line and Measurements" /> |

- **How It Works**:
  - Utilizes the Haversine formula to compute great-circle distance over the Earth's ellipsoidal surface.
  - Draws a geodesic curved polyline across the world map directly connecting the user to Mecca.

---

## Modular Architecture

The repository is structured with a **Feature-Based Modular Architecture**. Every domain feature is strictly isolated into its own folder containing its respective JavaScript logic and CSS stylesheet:

```text
PrayerTimer/
├── core/                                # Shared foundational modules
│   ├── player-bridge.js                 # Cross-frame audio communication bridge
│   ├── pwa.js                           # PWA installation and lifecycle controller
│   ├── reminders.js                     # Encrypted Web Push subscription client
│   ├── toast.js                         # Global notification toast system
│   ├── visitor-counter.js               # Anonymous visitor analytics tracker
│   ├── surahs_meta.js                   # Quran chapter indices and metadata
│   └── quran_data.js                    # Complete Quran Arabic text dataset
│
├── features/                            # Encapsulated feature modules (Logic + Styles)
│   ├── landing/                         # Shell and carousel (landing.js, landing.css)
│   ├── home/                            # Prayer times dashboard (home.js, home.css)
│   ├── quran/                           # Quran reading interface (quran.js, quran.css)
│   ├── tafseer/                         # Quran commentary module (tafseer.js, tafseer.css)
│   ├── listen/                          # Audio streaming player (listen.js, listen.css)
│   ├── azkar/                           # Daily adhkar catalog (azkar.js, azkar.css)
│   ├── sabah-masaa/                     # Morning/evening azkar (sabah-masaa.js, sabah-masaa.css)
│   ├── names/                           # 99 Names of Allah (names.js, names.css)
│   ├── qibla/                           # Qibla compass module (qibla.js, qibla.css)
│   ├── mosques/                         # Nearby mosque finder (mosques.js, mosques.css)
│   ├── distance/                        # Kaaba distance calculator (distance.js, distance.css)
│   └── reminders/                       # Notification settings (reminders-page.js, reminders-page.css)
│
├── data/                                # Local datasets (JSON)
│   ├── azkar.json                       # Comprehensive supplications
│   ├── short_azkar.json                 # Quick prayer adhkar
│   ├── names.json                       # Asmaul Husna definitions
│   └── verses.json                      # Selected Quranic verses
│
├── assets/                              # Static visual and audio assets
│   ├── ShotsREADME/                     # Organized documentation screenshots by feature
│   ├── Azan/                            # Audio recordings for prayer calls
│   ├── bg1.jpg, bg2.jpg, bg3.jpg        # High-resolution background photography
│   └── mosque.svg, favicon.png          # Vector branding assets
│
├── icons/                               # PWA application icons
├── api/                                 # Vercel serverless push notification handlers
├── *.html                               # Semantic HTML entrypoints
├── service-worker.js                    # PWA Service Worker with offline caching (v9)
├── server.js                            # Local Node.js HTTP and Push server
├── .gitattributes                       # GitHub Linguist language detection overrides
└── README.md                            # Comprehensive project documentation
```

---

## Code Organization and Language Statistics

All internal scripts and inline CSS have been extracted into independent, modular files. As a result, **JavaScript represents over 91% of the entire codebase**:

| Language | Number of Files | Lines of Code | Size (Bytes) | Percentage of Code |
|---|:---:|:---:|:---:|:---:|
| JavaScript (`.js`) | 33 files | 9,956 lines | 3,533,999 B | 91.4% |
| CSS (`.css`) | 12 files | 6,760 lines | 215,077 B | 5.6% |
| HTML (`.html`) | 12 files | 1,988 lines | 116,476 B | 3.0% |

Configured via `.gitattributes` to ensure GitHub Linguist accurately reflects the author's code without distortion from datasets or vendored assets.

---

## Technical Stack

- **Client-Side Core**: Vanilla JavaScript (Modern ECMAScript ES6+).
- **Styling**: Native CSS3 with CSS Custom Properties (Variables), Flexbox, and CSS Grid.
- **PWA Architecture**: Service Worker API, Cache Storage API, Web App Manifest.
- **Sensors and Telemetry**: DeviceOrientation API, Geolocation API, Vibration API.
- **Geographic Mapping**: Leaflet.js (v1.9.4), OpenStreetMap, Overpass API.
- **Network Layer**: Axios HTTP client.
- **Notifications**: W3C Push API, VAPID encryption with `web-push`.
- **Fonts and Icons**: FontAwesome 6, Google Fonts (Tajawal, Amiri Quran).

---

## Local Installation and Setup

The application requires no build steps, bundlers, or compilation pipelines:

### Prerequisites

- Node.js (version 16 or higher recommended).
- Git installed on your machine.

### Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/KamalAboueidd/Quiblah-Muslim-.git
   cd Quiblah-Muslim-
   ```

2. Install dependencies (required for Web Push backend):
   ```bash
   npm install
   ```

3. Start the local server:
   ```bash
   npm start
   # or
   node server.js
   ```

4. Open your web browser and navigate to:
   ```text
   http://localhost:8000
   ```

Note: Hardware sensor access (Compass and precise GPS Geolocation) requires HTTPS in production environments according to browser security standards. When deployed to GitHub Pages or Vercel, HTTPS is provisioned automatically.

---

## Progressive Web App (PWA) Offline Operation

Quiblah Muslim functions as an installable Progressive Web Application:

- **Desktop & Mobile Installation**: Installable directly from browser prompts to home screens and desktop application menus on iOS, Android, macOS, and Windows.
- **Offline Cache**: Managed by `service-worker.js` (Cache v9), pre-caching all essential application shell assets, modules, stylesheets, and datasets.
- **Resilient Fallback**: Critical features (Quran reading, daily adhkar, 99 Names, and cached prayer schedules) operate without any internet connectivity.

---

## Contributing

Contributions from the open-source community are welcome:

1. Fork the repository on GitHub.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Maintain the modular structure by placing JavaScript and CSS in their designated `features/<feature-name>/` directory.
4. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a Pull Request on GitHub.

---

## License and Author

- **Author**: Kamal Abou Eid
- **Repository**: [https://github.com/KamalAboueidd/Quiblah-Muslim-](https://github.com/KamalAboueidd/Quiblah-Muslim-)
- **License**: This project is open-source under the ISC License. Free for use, study, and contribution.