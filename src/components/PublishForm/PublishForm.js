import React, { Component } from "react";
import "../../form.css";
import "./PublishForm.css";
class PublishForm extends Component {
  state = { title: "Test", body: "Hoho" };
  titleChanged = function(event) {
    this.setState({ title: event.target.value });
  }.bind(this);
  render() {
    let className = this.props.onecolumn ? "form onecolumn" : "form";
    return (
      <div className={className}>
        <FormInput
          type="text"
          label="Title"
          text={this.state.title}
          onChange={this.titleChanged}
        />
        <FormInput type="textarea" label="Body" text={this.state.body} />
        <FormInput type="submit" text="Publish" />
      </div>
    );
  }
}
export class FormInput extends Component {
  render() {
    let inputElement;
    if (this.props.type === "textarea") {
      inputElement = (
        <textarea onChange={this.props.onChange || ""}>
          {this.props.text || ""}
        </textarea>
      );
    } else {
      inputElement = (
        <input
          onChange={this.props.onChange || ""}
          type={this.props.type}
          value={this.props.text || ""}
        />
      );
    }
    return (
      <label>
        {this.props.label || <div />}
        {inputElement}
      </label>
    );
  }
}
export default PublishForm;
