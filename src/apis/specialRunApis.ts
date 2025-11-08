import {
    GetSpecialRunListResponse,
    MakeSpecialRunChoiceResponse,
    StartSpecialRunResponse,
} from "@interfaces/SpecialRunInterface";
import {axiosModule} from "@utils/index";

export function getSpecialRuns(): Promise<GetSpecialRunListResponse> {
    return axiosModule.get("/special_run/get_list");
}

export function startSpecialRun(
    difficulty: number,
    category: number,
): Promise<StartSpecialRunResponse> {
    return axiosModule.post("/special_run/start", {
        difficulty,
        category,
    });
}

export function makeSpecialRunChoice(
    choice_id: number,
): Promise<MakeSpecialRunChoiceResponse> {
    console.log("makeSpecialRunChoice", choice_id);
    return axiosModule.post("/special_run/make_choice", {
        choice_id,
    });
}
