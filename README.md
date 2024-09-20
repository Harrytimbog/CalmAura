# CalmAura - A Mobile Application for Tracking Peripheral Interaction Metrics

**CalmAura** is a mobile application designed to track and measure the metrics of reflex, reaction, and reflection during peripheral interactions. Using device sensors like the accelerometer and microphone, CalmAura responds to user movements and sounds, providing real-time feedback and visualizations. 

This project leverages Expo for a seamless development experience across iOS and Android platforms.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Real-Time Sensor Tracking**: Measures reflex, reaction, and reflection based on movement (accelerometer) and sound (microphone).
- **Dynamic Visualization**: Displays metrics on a bar chart that updates in real time.
- **Simulated Metrics**: Provides random simulation for reflection metrics to test functionality.
- **Cross-Platform**: Built using React Native and Expo, compatible with both iOS and Android devices.
- **Permissions Handling**: Requests necessary permissions for microphone access and sensor data collection.

## Technologies Used
- **Frontend**: React Native, Expo
- **Backend (future development)**: Node.js, Express, MongoDB
- **Sensors**: Accelerometer, Gyroscope (via `expo-sensors`), Microphone (via `expo-av`)
- **Data Visualization**: `react-native-chart-kit` for dynamic bar charts
- **Mobile Development**: Expo for streamlined cross-platform development

## Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js and npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (for testing on a mobile device)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Harrytimbog/CalmAura.git
   cd CalmAura
