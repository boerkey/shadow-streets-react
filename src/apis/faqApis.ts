import { axiosModule } from "@utils/index";

export function getFaq() {
    return axiosModule.get("/faq/get_faq");
}
