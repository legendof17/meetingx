const express = require("express");
const https = require("https");
const fs = require("fs");
var cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
var xss = require("xss");

var key = fs.readFileSync(__dirname + "/selfsigned.key");
var cert = fs.readFileSync(__dirname + "/selfsigned.crt");
var options = {
  key: key,
  cert: cert,
};
var server = https.createServer(options, app);
var io = require("socket.io")(server);

const admins = { admin: "adminpass" };

const hosts = { jordan: "jordanpass", michael: "michaelpass" };

const users = { john: "johnpass", garry: "garrypass" };

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>MeetingXBend Server is running</h1>");
});

app.post("/login", (req, res) => {
  let response = {
    username: null,
    usertype: null,
    host: false,
    admin: false,
    loggedin: false,
    message: "failed, try again!",
  };
  if (
    req.body.username in admins &&
    admins[req.body.username] === req.body.password
  ) {
    response = {
      username: req.body.username,
      usertype: "admin",
      host: true,
      admin: true,
      loggedin: true,
      message:
        "successfully logged in, you will be redirected to dashboard in few seconds!",
    };
    res.send(response);
  } else if (
    req.body.username in hosts &&
    hosts[req.body.username] === req.body.password
  ) {
    response = {
      username: req.body.username,
      usertype: "host",
      host: true,
      admin: false,
      loggedin: true,
      message:
        "successfully logged in, you will be redirected to dashboard in few seconds!",
    };
    res.send(response);
  } else if (
    req.body.username in users &&
    users[req.body.username] === req.body.password
  ) {
    response = {
      username: req.body.username,
      usertype: "user",
      host: false,
      admin: false,
      loggedin: true,
      message:
        "successfully logged in, you will be redirected to dashboard in few seconds!",
    };
    res.send(response);
  } else res.send(response);
});

app.post("/signup", (req, res) => {
  if (req.body.username in { ...admins, ...hosts, ...users })
    res.send({ status: false, message: "try another username!" });
  else {
    users[req.body.username] = req.body.password;
    res.send({
      status: true,
      message:
        "successfully created you will be redirected to login page in few seconds!",
    });
  }
});

app.get("/getadmins", (req, res) => {
  res.status(200).json(admins);
});
app.get("/gethosts", (req, res) => {
  res.status(200).json(hosts);
});
app.get("/getusers", (req, res) => {
  res.status(200).json(users);
});
app.get("/getall", (req, res) => {
  res
    .status(200)
    .json({ admins: { ...admins }, hosts: { ...hosts }, users: { ...users } });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"));
  });
}
app.set("port", process.env.PORT || 4001);

const sanitizeString = (str) => {
  return xss(str);
};

let connections = {};
let messages = {};
let timeOnline = {};

io.on("connection", (socket) => {
  socket.on("join-call", (path) => {
    if (connections[path] === undefined) {
      connections[path] = [];
    }
    connections[path].push(socket.id);

    timeOnline[socket.id] = new Date();

    for (let a = 0; a < connections[path].length; ++a) {
      io.to(connections[path][a]).emit(
        "user-joined",
        socket.id,
        connections[path]
      );
    }

    if (messages[path] !== undefined) {
      for (let a = 0; a < messages[path].length; ++a) {
        io.to(socket.id).emit(
          "chat-message",
          messages[path][a]["data"],
          messages[path][a]["sender"],
          messages[path][a]["socket-id-sender"]
        );
      }
    }

    console.log(path, connections[path]);
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("chat-message", (data, sender) => {
    data = sanitizeString(data);
    sender = sanitizeString(sender);

    var key;
    var ok = false;
    for (const [k, v] of Object.entries(connections)) {
      for (let a = 0; a < v.length; ++a) {
        if (v[a] === socket.id) {
          key = k;
          ok = true;
        }
      }
    }

    if (ok === true) {
      if (messages[key] === undefined) {
        messages[key] = [];
      }
      messages[key].push({
        sender: sender,
        data: data,
        "socket-id-sender": socket.id,
      });
      console.log("message", key, ":", sender, data);

      for (let a = 0; a < connections[key].length; ++a) {
        io.to(connections[key][a]).emit(
          "chat-message",
          data,
          sender,
          socket.id
        );
      }
    }
  });

  socket.on("disconnect", () => {
    var diffTime = Math.abs(timeOnline[socket.id] - new Date());
    var key;
    for (const [k, v] of JSON.parse(
      JSON.stringify(Object.entries(connections))
    )) {
      for (let a = 0; a < v.length; ++a) {
        if (v[a] === socket.id) {
          key = k;

          for (let a = 0; a < connections[key].length; ++a) {
            io.to(connections[key][a]).emit("user-left", socket.id);
          }

          var index = connections[key].indexOf(socket.id);
          connections[key].splice(index, 1);

          console.log(key, socket.id, Math.ceil(diffTime / 1000));

          if (connections[key].length === 0) {
            delete connections[key];
          }
        }
      }
    }
  });

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(app.get("port"), () => {
  console.log("listening on", app.get("port"));
});
