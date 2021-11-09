import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const SignUp = (props) => {
  const st = props.location.state?.st || false;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [hide, setHide] = useState("revert");
  const [hide2, setHide2] = useState("none");

  const BoldFont = { fontWight: "bold" };
  const history = useHistory();

  useEffect(() => {
    if (status) {
      setTimeout(() => {
        history.push("/login", { st: true });
      }, 1000 * 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    ApiCall(username, password);
    e.preventDefault();
  };

  const gotoLogin = () => {
    history.push("/login", { st: true });
  };

  const ApiCall = async (u, p) => {
    const data = { username: u, password: p };
    const response = await axios.post(
      "https://192.168.0.118:4001/signup",
      data
    );
    // console.log(response.data);
    setStatus(response.data.status);
    setMessage(response.data.message);
  };
  return (
    <div>
      {st ? (
        <div>
          <h1>SignUp</h1>
          <form onSubmit={handleSubmit}>
            <label>
              username:
              <input
                type="text"
                name="username"
                autoComplete="off"
                onChange={handleChangeUsername}
              />
            </label>
            <br />
            <label>
              password:
              <input
                type="password"
                name="password"
                autoComplete="off"
                onChange={handleChangePassword}
              />
            </label>
            <br />
            <input type="submit" value="Submit" />{" "}
            <button onClick={gotoLogin}>Login?</button>
          </form>
          <br />
          <h4>{message}</h4>
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

export default SignUp;
