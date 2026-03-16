// frontend/src/main.tsx
// This is the entry point of the React application. It renders the App component into the root element of the HTML document.
// It also imports necessary stylesheets for the application, including the styles for React Flow,
// which is a library used for building node-based editors and diagrams in React.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "reactflow/dist/style.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);