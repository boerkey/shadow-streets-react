# ShadowStreets

A React Native mobile game application built with TypeScript, Redux, and Firebase.

## Prerequisites

-   Node.js >= 18
-   React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
-   iOS: Xcode and CocoaPods (macOS only)
-   Android: Android Studio and JDK

## Quick Start

### 1. Install Dependencies

```bash
yarn install

# iOS only
cd ios && pod install && cd ..
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:

-   `PRODUCTION_API_URL` - Your production API endpoint
-   `DEV_API_URL` - Your local development API endpoint
-   `ONESIGNAL_APP_ID` - Get from [OneSignal Dashboard](https://onesignal.com)
-   `FIREBASE_DATABASE_URL` - Get from [Firebase Console](https://console.firebase.google.com/)

### 3. Configure Firebase

**Android:**

```bash
cp android/app/google-services.json.example android/app/google-services.json
# Download your actual google-services.json from Firebase Console and replace the example
```

**iOS:**

```bash
cp ios/GoogleService-Info.plist.example ios/GoogleService-Info.plist
# Download your actual GoogleService-Info.plist from Firebase Console and replace the example
```

### 4. Run the App

```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## Project Structure

```
src/
├── apis/          # API service functions
├── assets/        # Images, fonts, and other assets
├── components/    # Reusable React components
├── constants/     # App constants and configuration
├── hooks/         # Custom React hooks
├── interfaces/    # TypeScript type definitions
├── redux/         # Redux store, actions, reducers, and sagas
├── screens/       # Screen components
└── utils/         # Utility functions and helpers
```

## Environment Variables

This project uses `react-native-config` to manage environment variables. All sensitive data is stored in `.env` (gitignored) and should never be committed.

Required variables:

-   `PRODUCTION_API_URL` - Production API endpoint
-   `DEV_API_URL` - Development API endpoint
-   `ONESIGNAL_APP_ID` - OneSignal push notification App ID
-   `FIREBASE_DATABASE_URL` - Firebase Realtime Database URL

## Security

**Never commit these files:**

-   `.env` and `.env.local`
-   `android/app/google-services.json`
-   `ios/GoogleService-Info.plist`
-   `android/gradle.properties.local`
-   Any keystore files or files containing API keys

Always use the `.example` template files as a reference. Before committing, verify no sensitive files are staged:

```bash
git status
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all sensitive data is in `.env` (not committed)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Troubleshooting

### Environment variables not loading

-   Clear Metro cache: `yarn start --reset-cache`
-   Rebuild the app: `yarn android` or `yarn ios`

### Firebase not initializing

-   Verify `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in correct locations
-   Check that files contain valid JSON/XML
-   Ensure Firebase project has correct package name/bundle ID

### Build errors

```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod deintegrate && pod install && cd ..
```

## Learn More

-   [React Native Documentation](https://reactnative.dev)
-   [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
-   [Redux Documentation](https://redux.js.org)
-   [Firebase Documentation](https://firebase.google.com/docs)
