import * as signalR from "@microsoft/signalr";
import Config from "react-native-config";

const { BASE_URLL } = Config;

export const createNotificationConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URLL}/hubs/notifications`, {
      transport: signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .build();
};