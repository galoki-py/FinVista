# FinVista Setup Guide

Follow these steps to clone and set up the FinVista project on a new development device.

## 🛠️ Prerequisites

Before you begin, ensure your machine has the following tools installed:

1. **Git**: [Download and Install Git](https://git-scm.com/downloads).
2. **Node.js v20.x or later**: [Download and Install Node.js](https://nodejs.org/).
3. **PowerShell 7+ (Windows)** or **zsh/bash (Mac/Linux)**.
4. **Visual Studio Code (Recommended)**.
5. **Expo Go (Mobile Development)**: Install the [Expo Go app](https://expo.dev/expo-go) on your physical Android or iOS device for testing.

---

## 📡 Step 1: Clone the Repository

Open your terminal and run the following command:

```bash
git clone https://github.com/galoki-py/FinVista.git
cd FinVista
```

---

## ⚙️ Step 2: Set Up Environment Variables

The project uses `.env` files for configuration. You need to create these files in the `server` and `apps/mobile` directories.

### Backend Server (`server/.env`)
Create a file named `.env` in the `server` directory and add the following (replace with your actual keys if necessary):

```env
PORT=5000
MONGO_URI=mongodb://your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GEMINI_API_KEY=your_gemini_api_key
```

### Mobile App (`apps/mobile/.env`)
Create a file named `.env` in the `apps/mobile` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```
> [!NOTE]
> When testing on a physical device via Expo Go, replace `localhost` with your computer's local IP address (e.g., `192.168.1.10`).

---

## 📦 Step 3: Install Dependencies

From the root of the project, run:

```bash
npm install
```
This will install all root and workspace-level dependencies for the mobile app, web app, and server.

---

## 🚀 Step 4: Start Development

You can start all components at once using **Turborepo**:

```bash
npm run dev
```

Alternatively, you can start components individually:

### 1️⃣ Start the Backend Server
```bash
cd server
npm run dev
```

### 2️⃣ Start the Mobile App (Expo)
```bash
cd apps/mobile
npm start
```
- Press **`a`** for Android Emulator.
- Press **`i`** for iOS Simulator.
- Scan the **QR code** with the **Expo Go** app on your physical device.

---

## 🛠️ Troubleshooting

### Common Issues

- **Port 5000 already in use**: Change the `PORT` in `server/.env`.
- **Invalid Loopback on Mobile**: Ensure your mobile device and computer are on the same Wi-Fi network.
- **Node Version mismatch**: Use `nvm` (Node Version Manager) to switch to Node.js v20 or v22.

---

## 🧪 Verification

To verify your setup is correct:
1. Ensure the server logs "Connected to MongoDB".
2. Ensure the Expo Dev Tools open in your browser.
3. Verify you can sign in to the mobile app or web interface.
