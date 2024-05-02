import { LoadingIndicator, LocalesMenuButton } from 'react-admin';
import { ThemeSwapper } from '../../themes/ThemeSwapper';

import {Box, Dialog} from "@mui/material";
import MessagePanel from "../message";
export const AppBarToolbar = () => (
    <>
        {/*<MessagePanel />*/}
        <LocalesMenuButton />
        <ThemeSwapper />
        <LoadingIndicator />
    </>
);