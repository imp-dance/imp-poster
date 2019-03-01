import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import PublishForm from "./components/PublishForm/PublishForm";
const browserWindow = window.remote.getCurrentWindow();
browserWindow.show();
class App extends Component {
  state = {};
  render() {
    return (
      <div className="App">
        <Header />
        <PublishForm onecolumn="true" />
      </div>
    );
  }
}

export default App;
