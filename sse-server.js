const express = require("express");
const parser = require("body-parser");
const cors = require("cors");
//if not import cors you will get this error
// Access to resource at 'http://localhost:3000/my-endpoint' from origin 'http://localhost:4200' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
const EventEmitter = require("events");

const app = express();
const Stream = new EventEmitter();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cors());

app.get("/sse", function (request, response) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  Stream.on("push", function (event, data) {
    response.write(
      "event: " +
        String(event) +
        "\n" +
        "data: " +
        JSON.stringify(data) +
        "\n\n"
    );
  });
});

setInterval(function () {
  Stream.emit("push", "message", { msg: new Date() });
}, 10000);

app.listen(3000);

console.log("Server is running");
