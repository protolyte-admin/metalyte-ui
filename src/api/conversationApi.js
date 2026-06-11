import axiosClient from "./axiosClient";

export function getConversations() {
    return axiosClient.get("/messages/conversations");
}

export function getMessages(phoneNumber) {
    return axiosClient.get(
        `messages/conversation/${phoneNumber}/messages`
    );
}


export const sendTextMessage = (data) =>
    axiosClient.post("/messages/text", data);