# ☕ Cafe Hop

Cafe Hop is a location-based mobile application that helps users discover nearby cafés, explore café details, and share reviews with the community and can see friend reviews directly who are connected to you.

The application is built using **React Native**, **Expo**, **Firebase**, and **OpenStreetMap**.

---

# 📌 About the Project

Cafe Hop is designed to provide an interactive café discovery experience through maps, reviews, ratings,friend and community feedback.

The app detects the user’s live location and displays nearby cafés on an interactive map. Users can open navigation and directions for selected cafés from their current location. Users can open café details, write reviews, view ratings, and explore popular menu items mentioned by other users.

The project combines:
- mobile app development
- authentication systems
- location services
- map integration
- cloud database integration
- community review systems
- Friend reviews 

---

# 🎯 Main Objective

The main objective of the project is to help users:

- discover cafés around them
- view café details easily
- Users can open navigation and directions for selected cafés from the current location
- explore reviews from other users
- share their own experiences
- identify popular menu items through community reviews
- you can connect friends 
- you can trust reviews from your connected friends feedback through friends review section

---

# ✨ Features

## 🔐 Authentication System
- User Signup
- User Login
- Firebase Authentication Integration

---

## 📍 Live Location Access
- Requests location permission
- Detects user’s current location
- Displays live location on map

---

## 🗺 Interactive Map
- Interactive café map interface
- Zoom in / zoom out support
- Tap-based location interaction
- Navigation and route support through map integration

---

## ☕ Nearby Café Discovery
- Detects nearby cafés around selected location
- Displays cafés as markers on the map
- Uses OpenStreetMap and Overpass API
- Users can open navigation and directions for selected cafés
---

## 📄 Café Details Screen
When a café marker is selected:
- café details screen opens
- café name is displayed
- café address/location is displayed
- users can explore reviews and menu information

---

## 📝 Community Review System
Users can:
- write reviews
- give ratings
- read reviews from other users and friends 

Reviews are stored using Firebase Firestore.

---

## ⭐ Rating System
- Star rating support
- User ratings displayed inside reviews
- Average app review rating shown

---

## 🍰 Popular Menu Detection
The app analyzes review text and identifies frequently mentioned menu items such as:
- coffee
- latte
- tiramisu
- matcha
- cake
- sandwich

Popular items are displayed inside the Popular Menu section.

---

## 🎨 UI Design
- Pixel-themed interface
- Custom icons and markers
- Mobile-friendly layout

---

# 🧭 How the App Works

## Step 1 — User Authentication
The user signs up or logs into the app.

---

## Step 2 — Location Permission
The app requests location permission from the user.

---

## Step 3 — Detect User Location
The application detects the user’s live location.

---

## Step 4 — Fetch Nearby Cafés
Nearby cafés are fetched using:
- OpenStreetMap
- Overpass API

---

## Step 5 — Display Café Markers
Cafés are shown as markers on the map.
Users can open navigation and directions for selected cafés from the current location.

---

## Step 6 — Connecting Friends
user can connect friends:
- when they search their friend's email,it will show their account
- for this,that friend also have to sign up through their email 
- in that way user can connect friends

---

## Step 7 — Open Café Details
When the user taps a café marker:
- café details screen opens
- reviews and menu sections become visible

---

## Step 8 — Write and Read Reviews
Users can:
- submit reviews
- give ratings
- read community reviews
- read connected friend reviews

---

## Step 9 — Popular Menu Detection
Review text is analyzed to detect frequently mentioned menu items.

---

# 📱 Screens Included

## 🔐 Authentication Screen
- Signup
- Login

---

## 🗺 Map Screen
- Interactive map
- Café markers
- User location

---

## ☕ Café Details Screen
- Café information
- Ratings
- Community reviews
- Popular menu

---

## 📝 connecting friends
- search email
- connect friends

---

# 🛠 Tech Stack

## Frontend
- React Native
- Expo
- React Navigation

---

## Backend & Database
- Firebase Authentication
- Firebase Firestore

---

## Maps & Location
- React Native Maps
- Expo Location
- OpenStreetMap
- Overpass API

---

# 📸 Screenshots

## Authentication Screen

<img width="329" height="736" alt="image" src="https://github.com/user-attachments/assets/848f5676-10ec-4b24-b7fc-b81b7804de33" />

---

## Map Screen

<img width="330" height="736" alt="Map Screen" src="https://github.com/user-attachments/assets/284ba1ea-0f4c-4547-a0ec-33cf30573cf5" />

---

## Café Details Screen

<img width="331" height="736" alt="Cafe Details Screen" src="https://github.com/user-attachments/assets/a2bf5c63-3250-4c40-ba36-923e01634a8b" />

---

## connecting friends

<img width="330" height="737" alt="Review Screen" src="https://github.com/user-attachments/assets/c42ec756-8865-434f-80f8-ca0909828196" />

---

# 🚀 How to Run the Project

## 1. Clone Repository

```bash
git clone https://github.com/kundan-sv/cafe-hop.git
```

---

## 2. Open Project Folder

```bash
cd cafe-hop
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start Expo

```bash
npx expo start
```

---

## 5. Run on Mobile

- Install Expo Go
- Scan the QR code generated by Expo

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
StarRating.js
firebase.js
globalStyles.js
```

---

# 🌟 Future Improvements

- Café search functionality
- Better filtering system
- Save favourite cafés
- Upload images in reviews
- AI-based recommendations
- Dark mode
- Improved café data coverage

---

# 👩‍💻 Author

**Kundan Sri Vyshnavi**

GitHub:  
https://github.com/kundan-sv

---

# 📄 License

This project is created for educational, learning, mobile application development experience.
