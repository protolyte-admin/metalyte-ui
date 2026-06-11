import axiosClient from "./axiosClient";

export const loginApi = (request) => {

    return axiosClient.post(
        "/auth/login",
        request
    );
};