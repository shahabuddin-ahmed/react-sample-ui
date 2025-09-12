import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";
import stores from "./stores";
import App from "./App";

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(
        <Provider {...stores}>
            <App />
        </Provider>
    );
}
