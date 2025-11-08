import {axiosModule} from "@utils/index.ts";

export function getUserTimeout() {
    return axiosModule.get("timeout/get_user_timeout");
}
