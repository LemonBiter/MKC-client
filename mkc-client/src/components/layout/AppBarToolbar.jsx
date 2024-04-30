import { LoadingIndicator, LocalesMenuButton } from 'react-admin';
import { ThemeSwapper } from '../../themes/ThemeSwapper';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
export const AppBarToolbar = () => (
    <>
        {/*<MarkEmailUnreadIcon />*/}
        <LocalesMenuButton />
        <ThemeSwapper />
        <LoadingIndicator />
    </>
);