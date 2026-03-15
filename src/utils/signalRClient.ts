import * as signalR from '@microsoft/signalr';
import { API_BASE_URLL } from '../config/api';

export const createNotificationConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URLL}/hubs/notifications`)
    .withAutomaticReconnect()
    .build();
};