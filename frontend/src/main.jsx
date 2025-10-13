import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root")); // Moved to src folder
root.render(<App />);
