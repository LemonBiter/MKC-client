import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux'
import { App } from "./App";
import store from "./app/store";
import {HashRouter} from 'react-router-dom';
import {WebSocketProvider} from "./WebSocketContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <WebSocketProvider>
        <HashRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </HashRouter>
    </WebSocketProvider>
);

// <Provider store={store}>
//     {/*<BrowserRouter >*/}
//     <App />
//     {/*</BrowserRouter>*/}
// </Provider>