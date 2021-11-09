import React, { Component } from "react";
import { Input, Button } from "@material-ui/core";
import "./index.css";

class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
  }

  handleChange = (e) => this.setState({ url: e.target.value });

  join = () => {
    var url;
    if (this.state.url !== "") {
      url = this.state.url.split("/");
      window.location.href = `/meeting/${url[url.length - 1]}`;
    } else {
      url = Math.random().toString(36).substring(2, 7);
      window.location.href = `/meeting/${url}`;
    }
  };

  render() {
    return (
      <div className="container2">
        <div>
          <h1 style={{ fontSize: "45px" }}>Video Meeting</h1>
          <p style={{ fontWeight: "200" }}>
            Video conference website that lets you stay in touch with all your
            friends.
          </p>
        </div>

        <div
          style={{
            background: "white",
            width: "30%",
            height: "auto",
            padding: "20px",
            minWidth: "400px",
            textAlign: "center",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>
            Start or join a meeting
          </p>
          <Input placeholder="URL" onChange={(e) => this.handleChange(e)} />
          <Button
            variant="contained"
            color="primary"
            onClick={this.join}
            style={{ margin: "20px" }}
          >
            Go
          </Button>
        </div>
      </div>
    );
  }
}

export default Meeting;
