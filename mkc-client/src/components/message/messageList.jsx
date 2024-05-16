import {
    BooleanField,
    Datagrid,
    DateField,
    List,
    SearchInput,
    useNotify,
    useRecordContext,
    useRefresh
} from "react-admin";
import {Box, Button, Divider, TextField, useMediaQuery} from "@mui/material";
import {Fragment, useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import * as React from "react";
import ImageViewer from "react-simple-image-viewer";
import {useWebSocket} from "../../WebSocketContext";
import CircularProgress from '@mui/material/CircularProgress';

const DatagridHeader = () => {
    return (
        <Fragment />
    )
}

const messageFilters = [
    <SearchInput source="detail" alwaysOn />,
]

const MessageList = () => {
    const socket = useWebSocket();
    const refresh = useRefresh();
    useEffect(() => {
        if (socket) {
            socket.on('updateMessage', (data) => {
                console.log('ws: fetch message list');
                refresh();
            })
        }
    }, []);

    return (
        <List title="消息列表"
              filters={messageFilters}>
            <Datagrid header={<DatagridHeader />}>
                <MessageItem />
            </Datagrid>
        </List>
    )
}




const MessageItem = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const refresh = useRefresh();
    const notify = useNotify();
    let { id, published_date, title, detail, fileId, fileIds, confirm, postedBy, confirmedBy } = record;
    const [localTime, setLocalTime] = useState('');
    if (fileId) {
        if (!fileIds) {
            fileIds = [];
        }
        fileIds = fileIds?.filter(Boolean);
        fileIds.push(fileId);
    }
    const imgExisted = fileIds && fileIds[0];

    const [confirmedWorker, setConfirmedWorker] = useState('');
    const [openPanel, setOpenPanel] = useState(false);
    const typeArr = {arrival: '到货通知', supply:'缺货通知'}
    const [storedImg, setStoredImg] = useState([]);
    useEffect(() => {
        const localTime = new Date(published_date).toLocaleString();
        setLocalTime(localTime);
    }, [published_date]);

    const handleStorage = (value) => {
        setStoredImg(value);
    }
    const handleMessageConfirm = () => {
        if (!confirmedWorker) {
            notify('请填写确认人员姓名');
            return;
        }
        dataProvider.update('message', { id, confirm: true, confirmedBy: confirmedWorker }).then((res) => {
            if (res.success) {
                notify('已确认');
                refresh();
            }
        })
    }

    const handleShowImg = useCallback( () => {
        setOpenPanel(!openPanel);
    }, [openPanel])

    const handleConfirmBy = (event) => {
        const confirmBy = event.target.value;
        setConfirmedWorker(confirmBy);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection:'column',
        }}>
            <Box>
        <Box sx={{
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        justifyContent: 'space-between',
        paddingRight: '50px'}}>
        <Box sx={{flex: '1.2'}}>
            <h2>{typeArr[title]}</h2>
            <h3>{detail}</h3>
            <h4>{localTime}</h4>
        </Box>
        <Box sx={{display: 'flex', justifyContent:'center', alignItems: 'center', flex: '1'}}>
            {imgExisted ?
                <Button
                    variant="contained"
                    onClick={handleShowImg}
                    sx={{padding: '10px 20px'}}>
                    查看图片
                </Button>
                : null}
        </Box>
        <Box sx={{flex: '0.5', display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'flex-start'}}>
            <p>递交人员:{postedBy??'unknown'}</p>
            {confirmedBy ? <p>确认人员:{confirmedBy}</p> : null}
        </Box>
        <Box sx={{
            cursor: 'pointer',
            display: 'flex',
            flex: '1.5',
            flexDirection: isSmall ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'}}>
            <Button variant="contained"
                    sx={{padding: '10px 20px'}}
                    onClick={handleMessageConfirm}
                    disabled={confirm}>{confirm ? '已确认' : '确认'}</Button>

            { !confirmedBy ?<Fragment>
                <h3 style={{margin: '0 20px'}}>By</h3>
                <TextField sx={{width: '100px'}}
                           onChange={handleConfirmBy}
                           variant="standard" />
            </Fragment> : null}

        </Box>
        </Box>
        { openPanel ?  <ImagePanel storedImg={storedImg} handleStorage={handleStorage} fileIds={fileIds} />: null }
        </Box>
    </Box>)
}

const ImagePanel = ({ fileIds, handleStorage, storedImg }) => {
    const [loading, setLoading] = useState(true);
    const [imgUrls, setImgUrls] = useState([]);
    const [imgList, setImgList] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const openImageViewer = useCallback((index) => {
        setCurrentIndex(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentIndex(0);
        setIsViewerOpen(false);
    };
    const fetchImgs = useCallback(async() => {
        return await Promise.all(fileIds.map((fileId) => {
            return new Promise(async (resolve, reject) => {
                const resp = await dataProvider.getImageBuffer('image', {id: fileId}, {responseType: 'blob'});
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                resolve(url);
            })
        }));
    }, [fileIds]);
    useEffect(() => {
        if (fileIds && !storedImg?.length) {
            fetchImgs().then(value => {
                handleStorage(value);
                setImgUrls(value);
                setImgList(value);
                setLoading(false);
            })
        } else {
            setImgUrls(storedImg);
            setImgList(storedImg);
            setLoading(false);
        }
    }, [fileIds]);
    return (
        <Box>
            <Divider />
            <Box sx={{display: 'flex', alignItems: 'center'}}>
            { loading ? <CircularProgress /> : null }
                <Box className="img-area"
                     sx={{height: '100px',
                         flex: '1',
                         display: 'flex',
                         justifyContent: 'flex-start',
                         flexDirection: 'row',
                     }}>
                    {imgUrls?.map((imgUrl, index) => (
                    <img key={index} style={{height: '100%', marginRight: '5px', objectFit: 'contain', cursor: 'pointer'}} alt='' src={imgUrl} onClick={() => openImageViewer(index)} />
                    ))}
                </Box>
            </Box>
            {isViewerOpen && (
                <ImageViewer
                    sx={{zIndex: '9'}}
                    src={ imgList }
                    currentIndex={ currentIndex }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )}
        </Box>
        )

}

export default MessageList;