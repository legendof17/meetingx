import React from "react";
import { Link } from "react-router-dom";
import Header from "../UI/Header";
import "./index.css";

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <h1>HomePage</h1>
      <span>A great platform for Meeting and Gatherings</span>
      <Link to={{ pathname: "/login", state: { st: true } }} className="login">
        Login
      </Link>
      <Link
        to={{ pathname: "/signup", state: { st: true } }}
        className="signup"
      >
        Signup
      </Link>
    </div>
  );
};

export default HomePage;
