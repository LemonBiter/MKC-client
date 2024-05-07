import {Box, Card, Typography, Button} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import {useNotify, useRefresh} from "react-admin";
import generateShortId from "ssid";
import {useDispatch, useSelector} from "react-redux";
import { update } from '../../app/message'

const MessageShow = () => {
    const [messages, setMessages] = useState([]);
    const fetchMessageList = useCallback(async () => {
        const { data } = await dataProvider.getList('message');
        setMessages(data);
    }, []);

    useEffect(() => {
        fetchMessageList();
    }, [1]);

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
                width: '50%',
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

const topics = {supply: '补货申请'}

const MessageItem = ({ m, handleRefresh }) => {
    const notify = useNotify();
    const { confirm, detail, id, published_date, title } = m;
    const localTime = new Date(published_date).toLocaleString();
    const topic = topics[title];
    const buttonStatus = confirm ? '已确认' : '确认'
    const handleMessageConfirm = () => {
        dataProvider.update('message', { id, confirm: true }).then((res) => {
            if (res.success) {
                notify('已确认补货申请');
                handleRefresh();
            }
        })
    }

    return (
        <Card sx={{
            margin: '10px 20px 0 0',
            height: '100px',
            padding: '10px',
            position: 'relative',
        }}>
            <Box>
                <Typography variant="subtitle2" sx={{fontSize: '18px'}}>
                    （{detail}）的{topic}
                </Typography>
                <Typography ml={2} variant="subtitle2" sx={{fontSize: '14px'}} color="textSecondary">
                    {localTime}
                </Typography>
                <Button
                    disabled={confirm}
                    variant="contained"
                    sx={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                }} onClick={handleMessageConfirm}>{buttonStatus}</Button>
            </Box>
        </Card>
    )
}

export default  MessageShow;