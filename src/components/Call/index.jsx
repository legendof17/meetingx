import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./index.css";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const socket = io.connect("http://192.168.0.118:5000");
  const st = props.location.state?.st || true;
  const history = useHistory();
  const [hide, setHide] = useState("revert");
  const [hide2, setHide2] = useState("none");
  const BoldFont = { fontWight: "bold" };
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  // const gotoSignup = () => {
  //   history.push("/signup", { st: true });
  // };

  return (
    <div>
      {st ? (
        <div>
          <h1 style={{ textAlign: "center", color: "#fff" }}>Ta/k</h1>
          <div className="container">
            <div className="video-container">
              <div className="video">
                {stream && (
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    style={{ width: "300px" }}
                  />
                )}
              </div>
              <div className="video">
                {callAccepted && !callEnded ? (
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "300px" }}
                  />
                ) : null}
              </div>
            </div>
            <div className="myId">
              <TextField
                id="filled-basic"
                label="Name"
                variant="filled"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "20px" }}
              />
              <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AssignmentIcon fontSize="large" />}
                >
                  Copy ID
                </Button>
              </CopyToClipboard>

              <TextField
                id="filled-basic"
                label="ID to call"
                variant="filled"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              <div className="call-button">
                {callAccepted && !callEnded ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveCall}
                  >
                    End Call
                  </Button>
                ) : (
                  <IconButton
                    color="primary"
                    aria-label="call"
                    onClick={() => callUser(idToCall)}
                  >
                    <PhoneIcon fontSize="large" />
                  </IconButton>
                )}
                {idToCall}
              </div>
            </div>
            <div>
              {receivingCall && !callAccepted ? (
                <div className="caller">
                  <h1>{name} is calling...</h1>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={answerCall}
                  >
                    Answer
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span>
            you are not supposed to visit this page like this, I blocked
            automations ~{" "}
          </span>
          <span
            style={{ display: hide }}
            onMouseEnter={() => {
              setHide("none");
              setHide2("revert");
            }}
          >
            MJI
          </span>
          <span
            style={{ display: hide2 }}
            onMouseLeave={() => {
              setHide2("none");
              setHide("revert");
            }}
          >
            <span style={BoldFont}>M</span>ichael{" "}
            <span style={BoldFont}>J</span>
            ackson <span style={BoldFont}>I</span>ntelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default Login;
