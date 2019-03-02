import React, { Component } from "react";
import "../../form.css";
import "./PublishForm.css";
const browserWindow = window.remote.getCurrentWindow();
const shell = window.remote.shell;
class PublishForm extends Component {
  state = {
    title: "",
    body: "",
    tags: "",
    setPassword: "",
    previousKey: "",
    passwordUpdated: false,
    hasClickedOnce: false
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
    this.setState({ body: event.target.value, hasClickedOnce: false });
  }.bind(this);
  clickGenerate = function() {
    let convertedBody = this.state.body;
    let gottenTags = convertedBody.match(/\{.*?\}/g);
    convertedBody = convertedBody.replace(gottenTags, "");
    if (gottenTags !== null) {
      gottenTags = gottenTags[0];
      gottenTags = gottenTags.substring(1);
      gottenTags = gottenTags.substring(0, gottenTags.length - 1);
      gottenTags = gottenTags.replace(",", '","');
      gottenTags = `["${gottenTags}"]`;
    }
    convertedBody = this.replaceBreaksWithParagraphs(convertedBody);
    convertedBody = convertedBody.replace(
      /\[([^[\]]+)\]\(([^)]+())\)/g,
      "<a href='$2'>$1</a>"
    );
    convertedBody = convertedBody.replace("<p><p>", "<p>");
    convertedBody = convertedBody.replace("</p></p>", "</p>");
    this.setState({
      body: convertedBody,
      hasClickedOnce: true,
      tags: gottenTags
    });
  }.bind(this);
  clickSubmit = function() {
    let data = new FormData();
    data.append("password", this.state.setPassword);
    data.append("title", this.state.title);
    data.append("tags", this.state.tags);
    let currentBody = this.state.body;
    data.append("body", currentBody);
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "https://impedans.me/api/poster/index.php");
    xmlhttp.send(data);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let response = JSON.parse(xmlhttp.responseText);
        console.log(response);
        if (response.status === "success") {
          // did upload
          shell.openExternal("https://haakon.underbakke.net");
          browserWindow.close();
        } else {
          // error
          if (response.errorCode === 1 || response.errorCode === 4) {
            this.setState({ body: currentBody + "\nWRONG PASSWORD" });
          } else if (response.errorCode === 2) {
            this.setState({ body: currentBody + "\nSUPPLY TITLE" });
          }
        }
      }
    }.bind(this);
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
    let clickEvent = this.state.hasClickedOnce
      ? this.clickSubmit
      : this.clickGenerate;
    let submitText = this.state.hasClickedOnce ? "Submit" : "Generate";
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
        <FormInput type="submit" text={submitText} onClick={clickEvent} />
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
