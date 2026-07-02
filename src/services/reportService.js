import axiosClient from "../api/axiosClient";

export function getReportSummary(params) {
    return axiosClient.get("/reports/summary", {
        params
    });
}

export function getReportMessages(params) {
    // params: { page, size, fromDate, toDate, status, search, sort }
    return axiosClient.get("/reports/messages", {
        params
    });
}

