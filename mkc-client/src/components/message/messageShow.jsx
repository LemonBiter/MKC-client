import {Box, Card, Typography, Button, useMediaQuery} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import { dataProvider} from "../../dataProvider";
import{ apiUrl } from "../../const";
import {useNotify, useRefresh} from "react-admin";
import generateShortId from "ssid";
import {useDispatch, useSelector} from "react-redux";
import { update } from '../../app/message'
import * as React from "react";
import ImageViewer from "react-simple-image-viewer";
import {WEB_SOCKET_LINK} from "../../const";
import {useWebSocket} from "../../WebSocketContext";

const MessageShow = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const socket = useWebSocket();
    const [messages, setMessages] = useState([]);
    const fetchMessageList = useCallback(async () => {
        const { data } = await dataProvider.getList('message');
        setMessages(data);
    }, []);

    useEffect(() => {
        fetchMessageList();
    }, [1]);

    useEffect(() => {
        if (socket) {
            socket.on('updateMessage', (data) => {
                console.log('ws: fetch message list');
                fetchMessageList();
            })
        }
    }, []);

    const handleRefresh = () => {
        fetchMessageList();
    }

    return (
        <Box sx={{
            // border: '1px solid black',
            height: '100%',
            background: 'rgb(233,233,238)',
            paddingLeft: '30px',
            display: 'flex',
            justifyContent: 'flex-start'
        }}>
            <Box sx={{
                width: isSmall ? '100%' : '60%',
                height: '100%',
                display: 'flex',
                overflow: 'scroll',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                // alignItems: 'flex-start'
            }}>
                <h2>消息通知队列</h2>
                {messages? messages.map((m, i) => (
                    <MessageItem handleRefresh={handleRefresh} m={m} key={i} />
                )) : null}
            </Box>
        </Box>
    )
}

const topics = { supply: '补货申请' , arrival: '到货通知'}

const MessageItem = ({ m, handleRefresh }) => {
    const notify = useNotify();
    const { confirm, detail, id, published_date, title, fileId } = m;
    const [imgUrl, setImgUrl] = useState('');
    const [imgList, setImgList] = useState([]);

    const localTime = new Date(published_date).toLocaleString();
    const topic = topics[title];
    const buttonStatus = confirm ? '已确认' : '确认'
    const handleMessageConfirm = () => {
        dataProvider.update('message', { id, confirm: true }).then((res) => {
            if (res.success) {
                notify('已确认');
                handleRefresh();
            }
        })
    }

    const handleShowImg = useCallback(async () => {
        const resp = await dataProvider.getImageBuffer('image', { id: fileId }, {responseType: 'blob'});
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        setImgUrl(url);
        setImgList([url]);
    }, [])
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);
    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    return (
        <Card sx={{
            margin: '10px 20px 0 0',
            height: 'auto',
            padding: '10px 20px',
            position: 'relative',
        }}>
            <Box sx={{display: 'flex'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent:'space-evenly', flex: '1'}}>
                    <Typography variant="subtitle2" sx={{fontSize: '20px'}}>
                        {topic}: {detail}
                    </Typography>
                    <Typography variant="subtitle2" sx={{fontSize: '16px'}} color="textSecondary">
                        {localTime}
                    </Typography>
                </Box>
                { imgUrl ? <Box className="img-area" sx={{marginLeft:'30px', width: '100px', height: '100px', flex: '1'}}>
                    <img style={{width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer'}} alt='' src={imgUrl} onClick={() => openImageViewer(0)} />
                </Box> : null }
            </Box>
            <Box display='flex' justifyContent="flex-end" mt={2}>
                {fileId
                    ?<Button variant="contained"
                             onClick={handleShowImg}
                             sx={{marginRight: '10px'}}>查看图片</Button>
                    : null }
                <Button
                    disabled={confirm}
                    variant="contained"
                    sx={{
                        // position: 'absolute',
                        // bottom: '20px',
                        // right: '20px',
                    }} onClick={handleMessageConfirm}>{buttonStatus}</Button>
            </Box>

            {isViewerOpen && (
                <ImageViewer
                    src={ imgList }
                    currentIndex={ 0 }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )}
        </Card>
    )
}
export default  MessageShow;