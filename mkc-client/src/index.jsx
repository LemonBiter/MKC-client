import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import { App } from "./App";
import store from "./app/store";
import { BrowserRouter } from 'react-router-dom';
import {WebSocketProvider} from "./WebSocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <WebSocketProvider>
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </WebSocketProvider>
);

// <Provider store={store}>
//     {/*<BrowserRouter >*/}
//     <App />
//     {/*</BrowserRouter>*/}
// </Provider>