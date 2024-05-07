import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import LabelIcon from '@mui/icons-material/Label';
import MessageIcon from '@mui/icons-material/Message';

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    useSidebarState,
} from 'react-admin';

import visitors from '../../visitors';
import orders from '../../components/orders/index';
import invoices from '../../invoices';
import products from '../../products';
import categories from '../../categories';
import reviews from '../../reviews';
import SubMenu from './SubMenu';
import {dataProvider} from "../../dataProvider";

const Menu = ({ dense = false }) => {
    const [unconfirmedMessage, setUnconfirmedMessage] = useState(0)
    const fetchUnconfirmedMessage = useCallback(async() => {
        const { data } = await dataProvider.getUnconfirmedMessage('message');
        setUnconfirmedMessage(parseInt(data));
    }, []);

    useEffect(() => {
        setInterval(fetchUnconfirmedMessage, 5000);
    }, [fetchUnconfirmedMessage]);

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
                to="/message"
                state={{ _scrollToTop: true }}
                // primaryText={ + unconfirmedMessage}
                leftIcon={<MessageIcon />}
                dense={dense}
            >

                {unconfirmedMessage ? <span style={{color: 'red'}}>未读消息：({unconfirmedMessage})</span> : `${translate(`resources.message.name`, { smart_count: 2 })}`}
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
                leftIcon={<reviews.icon />}
                dense={dense}
            />
            <MenuItemLink
                to="/accessory"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.accessory.name`, {
                    smart_count: 2,
                })}
                leftIcon={<reviews.icon />}
                dense={dense}
            />
        </Box>
    );
};

export default Menu;