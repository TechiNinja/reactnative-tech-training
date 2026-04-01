import * as signalR from '@microsoft/signalr';
import { API_WS_BASE_URL } from '../config/api';

export const createNotificationConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${API_WS_BASE_URL}/hubs/notifications`)
    .withAutomaticReconnect()
    .build();
};