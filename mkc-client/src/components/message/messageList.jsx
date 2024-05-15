import {BooleanField, Datagrid, DateField, List, useNotify, useRecordContext, useRefresh} from "react-admin";
import {Box, Button, TextField, useMediaQuery} from "@mui/material";
import {Fragment, useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import * as React from "react";
import ImageViewer from "react-simple-image-viewer";

const DatagridHeader = () => {
    return (
        <Fragment />
    )
}

const MessageList = () => {
    return (
        <List title="消息列表">
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
    const { id, published_date, title, detail, fileId, confirm, postedBy, confirmedBy } = record;
    const [localTime, setLocalTime] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgList, setImgList] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [confirmedWorker, setConfirmedWorker] = useState('');
    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);
    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };
    const typeArr = {arrival: '到货通知', supply:'缺货通知'}
    useEffect(() => {
        const localTime = new Date(published_date).toLocaleString();
        setLocalTime(localTime);
    }, [published_date]);

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

    const handleShowImg = useCallback(async () => {
        const resp = await dataProvider.getImageBuffer('image', { id: fileId }, {responseType: 'blob'});
        const url = window.URL.createObjectURL(new Blob([resp.data]));
        setImgUrl(url);
        setImgList([url]);
    }, [])

    const handleConfirmBy = (event) => {
        const confirmBy = event.target.value;
        setConfirmedWorker(confirmBy);
    }

    return (<Box sx={{
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
            {fileId &&(!imgUrl) ?
                <Button
                    variant="contained"
                    onClick={handleShowImg}
                    sx={{padding: '10px 20px'}}>
                    查看图片
                </Button>
                : null}
            { imgUrl ? <Box className="img-area" sx={{height: '100px', flex: '1'}}>
                <img style={{minWidth: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer'}} alt='' src={imgUrl} onClick={() => openImageViewer(0)} />
            </Box> : null }
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
            {/*{confirmedBy ? <h2>{confirmedBy}</h2> : */}
            {isViewerOpen && (
                <ImageViewer
                    sx={{zIndex: '9'}}
                    src={ imgList }
                    currentIndex={ 0 }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )}
        </Box>

        {/*<TextField source="id" />*/}
        {/*<TextField source="title" />*/}
        {/*<DateField source="published_date" />*/}

        {/*<TextField source="category" />*/}
        {/*<BooleanField source="commentable" />*/}
    </Box>)
}

export default MessageList;