// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {WEB_SOCKET_LINK} from "./const";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(WEB_SOCKET_LINK);
        ws.onopen = () => console.log('WebSocket connected');
        ws.onmessage = (callback) => callback();
        ws.onclose = () => console.log('WebSocket disconnected');
        ws.onerror = error => console.error('WebSocket error:', error);

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
