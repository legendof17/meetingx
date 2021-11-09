import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { useHistory } from "react-router-dom";

const Dashboard = (props) => {
  const st = props.location.state?.st || false;
  const [hide, setHide] = useState("revert");
  const [hide2, setHide2] = useState("none");
  const BoldFont = { fontWight: "bold" };
  // const history = useHistory();

  return (
    <div>
      {st ? (
        <div>
          <h1>Dashboard</h1>
          <Link
            to={{ pathname: "/musicx", state: { st: true } }}
            className="musicx"
          >
            MusicX
          </Link>
          <br />
          <Link
            to={{ pathname: "/meeting", state: { st: true } }}
            className="joinmeeting"
          >
            Join Meeting
          </Link>
          <br />
          <Link
            to={{ pathname: "/call", state: { st: true } }}
            className="encryptedcall"
          >
            Encrypted Call
          </Link>
          <br />
          <Link
            to="/"
            onClick={() => {
              sessionStorage.clear();
            }}
          >
            Logout
          </Link>
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

export default Dashboard;
