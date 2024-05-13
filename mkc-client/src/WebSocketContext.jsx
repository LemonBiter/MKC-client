// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import {WEB_SOCKET_LINK} from "./const";
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(WEB_SOCKET_LINK, { autoConnect: true });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};
