import React, { Component } from "react";
import "../../form.css";
import "./PublishForm.css";
//const browserWindow = window.remote.getCurrentWindow();
class PublishForm extends Component {
  state = {
    title: "",
    body: "",
    setPassword: "",
    previousKey: "",
    passwordUpdated: false
  };
  titleChanged = function(event) {
    this.setState({ title: event.target.value });
  }.bind(this);
  titleClicked = function(event) {
    if (this.state.previousKey === "@" && event.key === "@") {
      this.setState({
        title: "",
        setPassword: event.target.value.split("@")[0],
        passwordUpdated: true
      });
      setTimeout(() => {
        this.setState({
          passwordUpdated: false
        });
      }, 500);
    }
    this.setState({ previousKey: event.key });
  }.bind(this);
  bodyChanged = function(event) {
    this.setState({ body: event.target.value });
  }.bind(this);
  clickSubmit = function() {
    let convertedBody = this.replaceBreaksWithParagraphs(this.state.body);
    convertedBody = convertedBody.replace(
      /\[([^[\]]+)\]\(([^)]+())\)/g,
      "<a href='$2'>$1</a>"
    );
    convertedBody = convertedBody.replace("<p><p>", "<p>");
    convertedBody = convertedBody.replace("</p></p>", "</p>");
    this.setState({ body: convertedBody });
    let data = new FormData();
    data.append("password", this.state.setPassword);
    data.append("title", this.state.title);
    data.append("body", this.state.body);
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "https://impedans.me/api/poster/index.php");
    xmlhttp.send(data);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let response = JSON.parse(xmlhttp.responseText);
        console.log(response);
      }
    };
    /*data.append("json", JSON.stringify(jsonData));
    fetch("https://impedans.me/api/poster/index.php", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache",
      body: JSON.stringify(jsonData)
    })
      .then(response => response.text())
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });*/
    // submit shit to server
    // wait for response
    // browserWindow.close();
  }.bind(this);
  replaceBreaksWithParagraphs(input) {
    input = this.filterEmpty(input.split("\n")).join("</p>\n<p>");
    return "<p>" + input + "</p>\n";
  }
  filterEmpty(arr) {
    var new_arr = [];

    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] !== "") new_arr.push(arr.pop());
      else arr.pop();
    }

    return new_arr.reverse();
  }
  render() {
    let className = this.props.onecolumn ? "form onecolumn" : "form";
    let setPasswordClass = this.state.passwordUpdated ? "passwordUpdated" : "";
    return (
      <div className={className}>
        <FormInput
          type="text"
          label="Title"
          autoFocus
          text={this.state.title}
          className={setPasswordClass}
          onChange={this.titleChanged}
          onKeyUp={this.titleClicked}
        />
        <FormInput
          type="textarea"
          label="Body"
          text={this.state.body}
          onChange={this.bodyChanged}
        />
        <FormInput type="submit" text="Publish" onClick={this.clickSubmit} />
      </div>
    );
  }
}
export class FormInput extends Component {
  state = { inputFocus: false, defaultValue: "" };
  inputFocused = function(event) {
    this.setState({ inputFocus: true });
  }.bind(this);
  inputBlurred = function(event) {
    this.setState({ inputFocus: false });
  }.bind(this);
  defaultOnChange = function(event) {
    this.setState({ defaultValue: event.target.value });
  }.bind(this);
  defaultOnClick = function(event) {
    event.preventDefault();
  };
  render() {
    let inputElement;
    let labelClass = this.state.inputFocus ? "focused" : "";
    if (this.props.type === "textarea") {
      inputElement = (
        <textarea
          {...this.props}
          onChange={this.props.onChange || this.defaultOnChange}
          onFocus={this.inputFocused}
          onBlur={this.inputBlurred}
          value={this.props.text || this.state.defaultValue}
        />
      );
    } else {
      inputElement = (
        <input
          {...this.props}
          onChange={this.props.onChange || this.defaultOnChange}
          type={this.props.type}
          onFocus={this.inputFocused}
          onBlur={this.inputBlurred}
          value={this.props.text || this.state.defaultValue}
          onClick={this.props.onClick || this.defaultOnClick}
        />
      );
    }
    return (
      <label className={labelClass}>
        {this.props.label || <div />}
        {inputElement}
      </label>
    );
  }
}
export default PublishForm;
