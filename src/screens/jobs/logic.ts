import {PartyJobResult} from "@interfaces/JobInterface";
import {firebase} from "@react-native-firebase/database";
import {renderNumber} from "@utils/helperFunctions.ts";
import {constants} from "@utils/index.ts";

export const FirebaseDB = firebase.app().database(constants.firebaseDB_URL);

export interface FirebaseUser {
    id: number;
    name: string;
    partyId: string;
    jobId: number;
}

export interface FirebasePartyCrew {
    id: number;
    name: string;
    img_url: string;
    strength: number;
    dexterity: number;
    intelligence: number;
    charisma: number;
    level: number;
    energy: number;
}

export interface FirebaseParty {
    id: string;
    name: string;
    owner_id: number;
    crew: FirebasePartyCrew[];
    job_id: number;
    required_crew: number;
    status: number;
    result?: PartyJobResult;
    message?: string;
    droppedItems?: any;
}

export function getTotalPartyStat(
    partyDetails: FirebaseParty,
    statKey: "strength" | "dexterity" | "intelligence" | "charisma",
): string {
    let total = 0;
    partyDetails.crew.forEach((each: FirebasePartyCrew) => {
        total += each[statKey];
    });
    return renderNumber(total, 0);
}
