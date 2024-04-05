# NFC-ATTENDANCE-SYSTEM

## Installation

* `npm install` in both the `frontend` and `backend` folders.
* Attack the esp32 to the computer and flask the `nfc_attendance.ino` file in the Arduino IDE

## Backend

Dependencies:

- MongoDB (Database)
- ExpressJS (Server)
- Nodemon (For running the server in a loop)
- socket.io (For alerting front-end about changes)
- CORS

The server has a `/class/:nuid` `GET` path to where is should query at in order to update the attendance status of the student in the current running session.

To start the server make sure to have the `MONGO_URL` in `.env` file then start a terminal session the backend folder and run `nodemon server.js` command.

## Frontend

Tools used:

- Vite (For bunding the project)
- socket.io (Communicating with the backend for changes)
- Bootstrap (Styling)


## Arduino

Components used:

 - ESP32 microcontroller
 - ssd1306 OLED Display
 - PN532 nfc chip reader