import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import LabelIcon from '@mui/icons-material/Label';
import MessageIcon from '@mui/icons-material/Message';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    useSidebarState,
} from 'react-admin';

import visitors from '../../visitors';
import orders from '../../components/orders/index';
import accessory from "../accessory";
import material from "../material";
import reviews from '../../reviews';
import SubMenu from './SubMenu';
import {dataProvider} from "../../dataProvider";
import {WEB_SOCKET_LINK} from "../../const";
import {useWebSocket} from "../../WebSocketContext";

const Menu = ({ dense = false }) => {
    const socket = useWebSocket();
    const [unconfirmedMessage, setUnconfirmedMessage] = useState(0)

    useEffect(() => {
        if (socket) {
            socket.on('updateMessage', (data) => {
                const { count } = JSON.parse(data);
                console.log('ws:' + count);
                setUnconfirmedMessage(count);
            });
        }
    }, [socket]);


    const fetchUnconfirmedMessage = useCallback(async() => {
        const { data } = await dataProvider.getUnconfirmedMessage('message');
        setUnconfirmedMessage(parseInt(data));
    }, []);

    useEffect(() => {
        fetchUnconfirmedMessage()
    }, []);

    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();
    const handleToggle = (menu) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            <MenuItemLink
                to="/calendar"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.calendar.name`, {
                    smart_count: 2,
                })}
                leftIcon={<CalendarMonthIcon />}
                dense={dense}
            />
            <MenuItemLink
                to="/message"
                state={{ _scrollToTop: true }}
                // primaryText={ + unconfirmedMessage}
                leftIcon={<MessageIcon />}
                dense={dense}
            >
                {unconfirmedMessage
                    ? <span style={{color: 'red'}}>
                    未读消息：({unconfirmedMessage})</span>
                    : `${translate(`resources.message.name`, { smart_count: 2 })}`}
            </MenuItemLink>
            <MenuItemLink
                to="/order"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.order.name`, {
                    smart_count: 2,
                })}
                leftIcon={<orders.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/material"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.material.name`, {
                    smart_count: 2,
                })}
                leftIcon={<material.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/accessory"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.accessory.name`, {
                    smart_count: 2,
                })}
                leftIcon={<accessory.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/employee"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.employee.name`, {
                    smart_count: 2,
                })}
                leftIcon={<AccountBoxIcon />}
                dense={dense}
            />
            <MenuItemLink
                to="/storage"
                state={{ _scrollToTop: true }}
                leftIcon={<WarehouseIcon />}
                dense={dense}
            >库存</MenuItemLink>
        </Box>
    );
};

export default Menu;