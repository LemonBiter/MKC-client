import {BooleanField, Datagrid, DateField, List, useNotify, useRecordContext, useRefresh} from "react-admin";
import {Box, Button, TextField, useMediaQuery} from "@mui/material";
import {Fragment, useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import * as React from "react";
import ImageViewer from "react-simple-image-viewer";

const EmployeeList = () => {
    return (
        <List title="消息列表">
            <Datagrid>
                <EmployeeItem />
            </Datagrid>
        </List>
    )
}

const EmployeeItem = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const refresh = useRefresh();
    const notify = useNotify();
    const { id, published_date, title, detail, fileId, confirm } = record;
    const [localTime, setLocalTime] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [imgList, setImgList] = useState([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
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
        dataProvider.update('message', { id, confirm: true }).then((res) => {
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

    return (<Box sx={{
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: '50px'}}>
        <Box>
            <h2>{typeArr[title]}</h2>
            <h3>{detail}</h3>
            <h4>{localTime}</h4>
        </Box>
        { imgUrl ? <Box className="img-area" sx={{marginLeft:'30px', width: '100px', height: '100px', flex: '1'}}>
            <img style={{minWidth: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer'}} alt='' src={imgUrl} onClick={() => openImageViewer(0)} />
        </Box> : null }
        <Box sx={{
            cursor: 'pointer',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: isSmall ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'}}>
            {fileId ?
                <Button
                    variant="contained"
                    onClick={handleShowImg}
                    sx={{padding: '10px 20px', marginRight: '20px'}}>
                    查看图片</Button>
                : null}
            <Button variant="contained"
                    sx={{padding: '10px 20px'}}
                    onClick={handleMessageConfirm}
                    disabled={confirm}>{confirm ? '已确认' : '确认'}</Button>
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

export default EmployeeList;