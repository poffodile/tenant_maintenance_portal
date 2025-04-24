import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  /**
   * @property socket A connection to the backend Node.js server via Socket.IO.
   * This will listen for real-time data from the Arduino sensor.
   */
  private socket: Socket;

  /**
   * Constructor sets up the socket connection to the Node server
   * where the Arduino is streaming live sensor data.
   */
  constructor() {
    this.socket = io('http://localhost:3000'); // Make sure this matches your server port
  }

  /**
   * @method getSensorData
   * Creates an Observable that listens for `sensor-data` events from the backend.
   * Each time new temperature/humidity data is received, it pushes it to whoever is subscribed.
   *
   * @returns Observable<string> Live sensor data stream (e.g. "Temperature: 25.2C, Humidity: 70%")
   */
  getSensorData(): Observable<string> {
    return new Observable((observer) => {
      this.socket.on('sensor-data', (data: string) => {
        observer.next(data); // Pass the received data to the Angular component
      });
    });
  }
}
