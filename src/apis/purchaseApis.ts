import {axiosModule} from "@utils/index";

export function getProductList() {
    return axiosModule.get("/purchase/get_product_list");
}
