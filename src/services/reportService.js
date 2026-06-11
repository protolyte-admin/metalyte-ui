import axiosClient from "../api/axiosClient";

export function getReportSummary(params) {
    return axiosClient.get("/reports/summary", {
        params
    });
}

export function getReportMessages(params) {
    return axiosClient.get("/reports/messages", {
        params
    });
}
