import {Box, Dialog} from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import {useEffect, useState} from "react";

const MessagePanel = (panel) => {
    const [openPanel, setOpenPanel] = useState(false);
    useEffect(() => {
        console.log('openPanel:', openPanel);
    }, [openPanel]);
    const handleOpen = () => {
        setOpenPanel(!openPanel);
    }
    return(
        <Box onClick={handleOpen}>
            <MarkEmailUnreadIcon sx={{
                marginRight: '30px',
                cursor: 'pointer',
            }} />
            <Dialog open={openPanel}>
                <Box>Ok</Box>
            </Dialog>
        </Box>

    )
}

export default MessagePanel;