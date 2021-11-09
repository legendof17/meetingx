import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const st = props.location.state?.st || false;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [DATA, setDATA] = useState(Object);
  const [islogged, setIslogged] = useState(props?.islogged || false);
  const [message, setMessage] = useState("");
  const [hide, setHide] = useState("revert");
  const [hide2, setHide2] = useState("none");

  const BoldFont = { fontWight: "bold" };
  const history = useHistory();

  useEffect(() => {
    if (islogged) {
      Object.entries(DATA).map(([key, value]) =>
        sessionStorage.setItem(key, value)
      );
      setTimeout(() => {
        history.push("/dashboard", { st: true });
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [islogged]);

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

  const gotoSignup = () => {
    history.push("/signup", { st: true });
  };

  const ApiCall = async (u, p) => {
    const data = { username: u, password: p };
    const response = await axios.post("https://192.168.0.118:4001/login", data);
    // console.log(response.data);
    setDATA(response.data);
    setMessage(response.data.message);
    setIslogged(response.data.loggedin);
  };
  return (
    <div>
      {st ? (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label>
              username:
              <input
                autoFocus={true}
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
            <button onClick={gotoSignup}>Signup?</button>
          </form>
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

export default Login;
