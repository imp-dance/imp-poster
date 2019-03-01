import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header/Header";
const browserWindow = window.remote.getCurrentWindow();
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
