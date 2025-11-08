import Config from "react-native-config";

// Firebase Database URL - Get from your Firebase project settings
export const firebaseDB_URL =
    Config.FIREBASE_DATABASE_URL ||
    "https://your-project-default-rtdb.region.firebasedatabase.app/";

export const firebaseUsersTable = "Users";
export const firebasePartiesTable = "Parties";
export const maxLength12 = 12;
export const maxLength16 = 16;
