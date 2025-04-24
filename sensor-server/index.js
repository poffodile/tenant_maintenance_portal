const express = require("express");
const http = require("http");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // allow all origins (you can restrict it to your Angular port)
    methods: ["GET", "POST"],
  },
});

const portName = "COM4"; // Change this to your Arduino port
const arduinoPort = new SerialPort({ path: portName, baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

io.on("connection", (socket) => {
  console.log("Client connected");

  // Send a welcome message or status confirmation
  socket.emit("message", "Connected to sensor server");

  // When new sensor data comes in from Arduino
  parser.on("data", (data) => {
    console.log("Sensor Data:", data);
    socket.emit("sensor-data", data); // Send data to frontend
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
