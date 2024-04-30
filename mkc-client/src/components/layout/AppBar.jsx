import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import {Box, Typography, useMediaQuery} from '@mui/material';

import Logo from './Logo';
import { AppBarToolbar } from './AppBarToolbar';

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar color="primary"
                toolbar={<AppBarToolbar />}
        >
            <Typography
                flex="1"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                variant="h6"
                color="inherit"
                id="react-admin-title"
            >Modern Kitchens Cabinets </Typography>
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;
