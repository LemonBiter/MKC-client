import {Box, Card, Typography, Button, TextField, useMediaQuery, MenuItem, InputLabel, Select, FormControl} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import {useNotify, useRefresh} from "react-admin";
import '../../css/storage.css';
import generateShortId from "ssid";
import {useDispatch, useSelector} from "react-redux";
import { update } from '../../app/message'
import * as React from "react";

const StorageShow = () => {
    const [messages, setMessages] = useState([]);
    // const fetchMessageList = useCallback(async () => {
    //     const { data } = await dataProvider.getList('message');
    //     setMessages(data);
    // }, []);

    // useEffect(() => {
    //     fetchMessageList();
    // }, [1]);
    //
    // const handleRefresh = () => {
    //     fetchMessageList();
    // }

    return (
        <Box sx={{
            height: '100%',
            background: 'rgb(233,233,238)',
            padding: '0 30px 0 30px',
            display: 'flex',
            justifyContent: 'flex-start'
        }}>
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                overflow: 'scroll',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                // alignItems: 'flex-start'
            }}>
                <h2>提交库存申请</h2>
                <OperationBox />
                {/*{messages? messages.map((m, i) => (*/}
                {/*    <MessageItem handleRefresh={handleRefresh} m={m} key={i} />*/}
                {/*)) : null}*/}
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

const OperationBox = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [file, setFile] = useState(null);
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const handleCapture = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };
    const handleTextChange = (event) => {
        const content = event.target.value;
        setContent(content);
    }
    const handleUpload = async () => {
        try {
            const fileId = file ? generateShortId() : '';
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('fileId', fileId);
                formData.append('from', 'message');
                await dataProvider.create('image',formData, {headers: {
                        'Content-Type': 'multipart/form-data'
                    }});
            }
            const response = await dataProvider.create('storage', {id: generateShortId(), title: type, detail: content, fileId});
            console.log(response)
            if (response.success) {
                alert('上传成功！');
            } else {
                alert('上传失败，请重试！');
            }
        } catch (error) {
            alert('上传过程中出现错误！');
        }
    };

    return (<Box className="storage-operation">
        <FormControl sx={{width: isSmall ? '80%' : '40%', marginBottom: '30px'}}>
            <InputLabel id="demo-simple-select-label">申请类型</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                variant="filled"
                value={type}
                defaultValue={'arrival'}
                label="type"
                onChange={handleTypeChange}
            >
                <MenuItem value='arrival'>到货通知</MenuItem>
                {/*<MenuItem value={20}>Twenty</MenuItem>*/}
                {/*<MenuItem value={30}>Thirty</MenuItem>*/}
            </Select>
        </FormControl>
        <Box mb={6}>
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCapture}
            />
        </Box>
        <TextField sx={{marginBottom: '30px', width: isSmall ? '100%' : '50%'}}
                   variant="outlined"
                   onChange={(e) => handleTextChange(e)}
                   multiline
                   rows={4}
                   label="备注" />

        <Button variant="contained" onClick={handleUpload}>通知入库</Button>
    </Box>);
}
export default  StorageShow;