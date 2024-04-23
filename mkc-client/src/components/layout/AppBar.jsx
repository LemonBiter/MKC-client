import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import { Box, useMediaQuery } from '@mui/material';

import Logo from './Logo';
import { AppBarToolbar } from './AppBarToolbar';

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar color="default" toolbar={<AppBarToolbar />}>
            <TitlePortal />
            {isLargeEnough && <Logo />}
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;
