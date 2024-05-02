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
            <SubMenu
                handleToggle={() => handleToggle('menuSales')}
                isOpen={state.menuSales}
                name="pos.menu.sales"
                icon={<orders.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/commands"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.commands.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<orders.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/invoices"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.invoices.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<invoices.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCatalog')}
                isOpen={state.menuCatalog}
                name="pos.menu.catalog"
                icon={<products.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/products"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.products.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<products.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/categories"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.categories.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<categories.icon />}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuCustomers')}
                isOpen={state.menuCustomers}
                name="pos.menu.customers"
                icon={<visitors.icon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/customers"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.customers.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<visitors.icon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/segments"
                    state={{ _scrollToTop: true }}
                    primaryText={translate(`resources.segments.name`, {
                        smart_count: 2,
                    })}
                    leftIcon={<LabelIcon />}
                    dense={dense}
                />
            </SubMenu>
            <MenuItemLink
                to="/reviews"
                state={{ _scrollToTop: true }}
                primaryText={translate(`resources.reviews.name`, {
                    smart_count: 2,
                })}
                leftIcon={<reviews.icon />}
                dense={dense}
            />
        </Box>
    );
};

export default Menu;