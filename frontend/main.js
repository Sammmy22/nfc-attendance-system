import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

const studentTable = document.getElementById("student-list");

studentTable.innerHTML = `<table class="table">
    <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Enrollment No.</th>
      <th scope="col">NUID</th>
      <th scope="col">Course</th>
      <th scope="col">Attendance</th>
    </tr>
    </thead>
    <tbody id="content">
    </tbody>`;

socket.emit("fetch");

socket.on("connect", () => {
  console.log("connected");
});

socket.on("response", (data) => {
  setStudentData(data);
  populateTable();
});

socket.on("mark", (resObj) => {
  setStudentData(resObj);
  populateTable();
});

const setStudentData = (data) => {
  // console.log(data);
  const stringifiedData = JSON.stringify(data);
  // console.log(stringifiedData);
  localStorage.setItem("students", stringifiedData);
};

document.getElementById("button").addEventListener("click", () => {
  socket.emit("reset");
});

const populateTable = () => {
  const stringifiedData = localStorage.getItem("students");
  const parsedData = JSON.parse(stringifiedData);

  console.log(Object.keys(parsedData));

  const tableBody = document.getElementById("content");

  let tableContent = "";

  parsedData.map((student) => {
    tableContent += `<tr>
      <td>${student.name}</td>
      <td>${student.enrollmentno}</td>
      <td>${student.nuid}</td>
      <td>${student.course}</td>
      <td>${student.attendance}</td>
    </tr>`;
  });

  tableBody.innerHTML = tableContent;
};
