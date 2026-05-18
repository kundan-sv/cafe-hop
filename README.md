# ☕ Cafe Hop

A social café discovery mobile application built using **React Native** and **Firebase**.

Cafe Hop helps users discover nearby cafés, explore café details, write reviews, and view community recommendations through an interactive map experience.

---

# ✨ Features

- 🔐 Firebase Authentication (Login / Signup)
- 📍 Real-Time User Location Access
- 🗺 Interactive Café Map
- ☕ Nearby Café Discovery
- 📝 Community Review System
- 👥 Friend Review Support
- 🍰 Popular Menu Detection from Reviews
- 🎨 Pixel-Themed UI Design
- ⚡ Real-Time Firebase Firestore Integration

---

# 🛠 Tech Stack

## Frontend
- React Native
- Expo
- React Navigation

## Backend & Database
- Firebase Authentication
- Firebase Firestore

## Maps & Location
- React Native Maps
- Expo Location
- OpenStreetMap / Overpass API

---

# 📸 Screenshots

_Add your app screenshots here._

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/kundan-sv/cafe-hop.git
```

## 2. Open Project Folder

```bash
cd cafe-hop
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Expo

```bash
npx expo start
```

---

# 🔥 Firebase Setup

## 1. Create Firebase Project

Go to:

https://console.firebase.google.com

---

## 2. Enable Authentication

- Open Authentication
- Click "Get Started"
- Enable:
  - Email/Password

---

## 3. Enable Firestore Database

- Open Firestore Database
- Create Database
- Start in Test Mode

---

## 4. Add Firebase Config

Create `firebase.js` and add your Firebase configuration.

Example:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export { firebaseApp };
```

---

# 📂 Project Structure

```text
assets/
App.js
MapScreen.js
CafeDetailsScreen.js
CafeDetailsTab.js
ReviewForm.js
FriendScreen.js
firebase.js
globalStyles.js
```

---

# 🌟 Future Improvements

- 💬 Real-Time Chat Between Friends
- ❤️ Save Favorite Cafés
- 📷 Upload Images in Reviews
- 🤖 AI-Based Café Recommendations
- 🌙 Dark Mode
- 🔎 Advanced Café Filters

---

# 👩‍💻 Author

**Kundan Sri Vyshnavi**

GitHub:  
https://github.com/kundan-sv

---

# 📄 License

This project is created for educational, learning, and portfolio purposes.
