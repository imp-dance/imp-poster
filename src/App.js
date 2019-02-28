import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
const remote = window.require("electron").remote;
const browserWindow = remote.getCurrentWindow();
browserWindow.show();
class App extends Component {
  state = {};
  render() {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default App;
