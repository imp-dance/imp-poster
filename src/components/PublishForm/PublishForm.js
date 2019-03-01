import React, { Component } from "react";
import "../../form.css";
import "./PublishForm.css";
const browserWindow = window.remote.getCurrentWindow();
class PublishForm extends Component {
  state = { title: "", body: "" };
  titleChanged = function(event) {
    this.setState({ title: event.target.value });
  }.bind(this);
  clickSubmit = function() {
    browserWindow.close();
  };
  render() {
    let className = this.props.onecolumn ? "form onecolumn" : "form";
    return (
      <div className={className}>
        <FormInput
          type="text"
          label="Title"
          autoFocus
          text={this.state.title}
          onChange={this.titleChanged}
        />
        <FormInput type="textarea" label="Body" text={this.state.body} />
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
