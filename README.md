# DyanoCharge

DyanoCharge is a smart EV charging recommendation and monitoring dashboard designed to help users identify suitable EV charging stations based on real-time station conditions.

The system evaluates factors such as **station load, occupancy, waiting time, distance, grid status, and vehicle battery level** to recommend the most suitable available charging station.

This repository contains the **React-based dashboard, Firebase integration, and recommendation logic** for the DyanoCharge system.

---

## Overview

EV drivers may need to choose between multiple charging stations with different conditions. A nearby station may be overloaded, fully occupied, or have a long waiting time.

DyanoCharge addresses this by evaluating available stations and recommending the most suitable option based on multiple factors.

The system monitors three charging stations:

* **Station A**
* **Station B**
* **Station C**

The dashboard analyzes the available data and either:

* Recommends the best available charging station, or
* Returns an **AVOID** recommendation when charging is unsafe or no suitable station is available.

---

## Features

### Real-Time Firebase Integration

The dashboard subscribes to Firebase Realtime Database and receives station and grid information.

The application includes fallback data so that the interface can still display default station information if live data is unavailable.

### Smart Charging Station Recommendation

The recommendation system evaluates:

* Station load
* Load status
* Station occupancy
* Waiting time
* Distance from the vehicle
* Vehicle battery range
* Grid headroom
* Overall grid status

Unsafe stations are filtered out before selecting the best available option.

### Station Safety Checks

A station is considered unsuitable when:

* Load is **90% or higher**
* Load status is **RED**
* All charging slots are occupied
* Waiting time exceeds **45 minutes**
* The station is outside the estimated vehicle battery range

The system also avoids recommending charging when:

* Grid headroom is critically low
* Grid status is RED
* No station meets the safety and availability conditions

### Weighted Station Scoring

Safe stations are scored using a weighted combination of:

* Load
* Waiting time
* Distance
* Occupancy

The station with the lowest score is selected as the recommended charging station.

### Vehicle Battery and Range Calculation

Users can enter the vehicle's current battery percentage.

The application estimates the vehicle's remaining driving range and uses it to determine whether each charging station is reachable.

### Location and Distance Calculation

The dashboard supports:

* Selecting predefined Bangalore locations
* Manual latitude input
* Manual longitude input
* Automatic distance calculation between the vehicle and each charging station

### Interactive Bangalore Map

The application includes an interactive map displaying:

* The user's active vehicle location
* The currently recommended destination
* Location context and zoom controls

### Charging Station Diagnostics

The dashboard displays information about each charging station, including:

* Current load percentage
* Load status
* Occupied charging slots
* Available slots
* Waiting time
* Distance from the vehicle
* Safety status

### Recommendation Synchronization

After calculating the recommended station, the dashboard synchronizes the recommendation back to Firebase.

The stored recommendation includes:

* Recommended station
* LED status
* Reason for the recommendation
* Update timestamp

A **GREEN LED status** represents a valid recommended station, while **RED** represents an `AVOID` condition.

### Light and Dark Mode

The application supports both light and dark themes, with the selected theme stored locally in the browser.

---

## System Architecture

```text
EV Charging Stations
        │
        ▼
Sensors and ESP32 Hardware
        │
        ▼
Firebase Realtime Database
        │
        ▼
DyanoCharge Dashboard
        │
        ├── Live Station Data
        ├── Vehicle Information
        ├── Distance Calculation
        ├── Safety Checks
        └── Recommendation Logic
                │
                ▼
      Recommended Station / AVOID
```

This repository primarily contains the **dashboard, Firebase integration, and recommendation logic**.

---

## Recommendation Flow

```text
Live Station Data
        +
Vehicle Battery
        +
Vehicle Location
        │
        ▼
Calculate Vehicle Range
        │
        ▼
Calculate Distance to Stations
        │
        ▼
Check Grid Conditions
        │
        ▼
Filter Unsafe Stations
        │
        ▼
Score Safe Stations
        │
        ▼
Recommend Best Station
        │
        ├── Station A
        ├── Station B
        ├── Station C
        └── AVOID
```

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Styling

* Tailwind CSS
* PostCSS
* Autoprefixer

### Database

* Firebase Realtime Database

### UI and Utilities

* Lucide React
* clsx
* tailwind-merge
* class-variance-authority

### Mapping

* OpenStreetMap

---

## Project Structure

```text
dyanocharge-final/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   └── BangaloreMap.tsx
│   ├── lib/
│   │   ├── bangaloreLocations.ts
│   │   ├── decisionLogic.ts
│   │   ├── distance.ts
│   │   └── firebase.ts
│   ├── services/
│   │   └── stationService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── tsconfig.node.json
```

---

## Core Components

### `App.tsx`

The main dashboard component responsible for:

* Firebase data subscription
* Vehicle battery input
* Vehicle location input
* Distance calculation
* Battery range calculation
* Charging station diagnostics
* Recommendation generation
* Recommendation synchronization
* Theme switching

### `stationService.ts`

Handles communication with Firebase Realtime Database.

It:

* Subscribes to live dashboard data
* Normalizes incoming station data
* Provides fallback dashboard data
* Writes recommendations back to Firebase

### `decisionLogic.ts`

Contains the station recommendation logic.

The system:

1. Checks overall grid conditions.
2. Checks whether each station is safe.
3. Filters out unsuitable stations.
4. Calculates a score for safe stations.
5. Selects the station with the lowest score.

If no station is suitable, the system returns:

```text
AVOID
```

### `distance.ts`

Handles:

* Distance calculation between the vehicle and charging stations
* Estimated vehicle range based on battery percentage

### `BangaloreMap.tsx`

Displays the interactive map and supports:

* Active vehicle location
* Recommended destination display
* Location-focused map rendering

---

## Getting Started

### Prerequisites

* Node.js
* npm

### Clone the Repository

```bash
git clone https://github.com/prernapatro/dyanocharge-final.git
```

### Navigate to the Project Directory

```bash
cd dyanocharge-final
```

### Install Dependencies

```bash
npm install
```

### Configure Firebase

Configure Firebase in:

```text
src/lib/firebase.ts
```

using your Firebase project configuration.

### Start the Development Server

```bash
npm run dev
```

---

## Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## Future Improvements

* Support for additional charging stations
* Historical station analytics
* Improved route planning
* Real-time sensor visualizations
* Dynamic traffic integration
* User authentication
* Notification alerts
* More advanced recommendation models

---

## Author

**Prerna Patro**

GitHub: https://github.com/prernapatro
