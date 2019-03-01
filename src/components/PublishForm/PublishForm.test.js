import React from "react";
import ReactDOM from "react-dom";
import PublishForm from "./PublishForm";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<PublishForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
