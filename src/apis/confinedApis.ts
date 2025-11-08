import {axiosModule} from "@utils/index.ts";

export function getConfinedPeople() {
    return axiosModule.get("/confined/get_confined_people");
}

export function saveConfinedPerson(id: number, type: number) {
    return axiosModule.post("/confined/save_confined_person", {
        id,
        type,
    });
}
