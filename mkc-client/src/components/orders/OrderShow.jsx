import * as React from 'react';
import {
    ShowBase,
    TextField,
    ReferenceField,
    ReferenceManyField,
    ReferenceArrayField,
    useRecordContext,
    useRedirect, DateField, RichTextField, SimpleShowLayout, Show, useListContext, useNotify, useRefresh,
} from 'react-admin';
// import { Controlled as ControlledZoom } from "react-medium-image-zoom";
import {calculateCount, parseOrderDataToCSV} from '../utils';
import {
    Box,
    Dialog,
    DialogContent,
    Typography,
    Divider,
    TextField as NoteInput,
    Button,
    useMediaQuery
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CollectionsIcon from '@mui/icons-material/Collections';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import ImageViewer from 'react-simple-image-viewer';
import '../../css/order.css'

import {useCallback, useEffect, useRef, useState} from "react";
import {dataProvider} from "../../dataProvider";
import {CSVLink} from "react-csv";
import generateShortId from "ssid";
import Compressor from "compressorjs";

const OrderShow = ({ open, id}) => {
    const redirect = useRedirect();
    const handleClose = () => {
        redirect('list', 'order');
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            sx={{
                '.MuiDialog-paper': {
                    position: 'absolute',
                    top: 15,
                },
            }}
        >
            <DialogContent>
                {!!id ? (
                    <ShowBase id={id}>
                        <OrderShowContent />
                    </ShowBase>
                ) : null}
            </DialogContent>
        </Dialog>
    );
};

export default OrderShow;



const OrderShowContent = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const refresh = useRefresh();
    const record = useRecordContext();
    const [csvExportData, setCsvExportData] = useState([])
    const csvLinkRef = useRef();
    // if (!record) return null;
    // const roomInfo = record.roomInfo;

    const localTime = new Date(record?.published_date).toLocaleString();
    const [materialArray, setMaterialArray] = useState([]);
    const [accessoryArray, setAccessoryArray] = useState([]);

    const csvHeader = [
        { label: "下单日期", key: "published_date" },
        { label: "姓名", key: "name" },
        { label: "电话", key: "phone" },
        { label: "状态", key: "stage" },
        // { label: "电话", key: "phone" },
    ];
    useEffect(() => {
        if (record && record?.roomInfo) {
            const { mArr, aArr } = calculateCount(record?.roomInfo);
            setMaterialArray(mArr);
            setAccessoryArray(aArr);
        }
    }, [record]);
    const handleDeleteNote = async (note) => {
        if (!record.id || !note.noteId) return;
        const res = await dataProvider.delete('order', { id: record.id, noteId: note.noteId });
        if (res?.success) {
            refresh();
        }
    }

    useEffect(() => {
        if (csvExportData?.length) {
            csvLinkRef.current.link.click();
        }
    }, [csvExportData]);

    const handleOrderExport = useCallback(async () => {
        const { data } = await dataProvider.getOne('order', {id: record.id });
        if (!data) return null;
        const csvData = parseOrderDataToCSV(data);
        console.log(csvData);
        setCsvExportData(csvData);
    }, []);

    return (
                <Box>
                    <Typography variant="h5">{record?.name ?? '无'}</Typography>
                    <Box display="flex" mt={3} sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: isSmall ? 'column' : 'row'
                    }}>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                电话
                            </Typography>
                            <Typography variant="subtitle1">
                                {record?.phone ?? '无'}
                            </Typography>
                        </Box>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                地址
                            </Typography>
                            <Typography variant="subtitle1">
                                {record?.address ?? '无'}
                            </Typography>
                        </Box>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                下单时间
                            </Typography>
                            <Typography variant="subtitle1">
                                {localTime ?? '无'}
                            </Typography>
                        </Box>
                        <Box display="flex" sx={{ position: 'relative'}} mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Stage
                            </Typography>
                            <Typography variant="subtitle1">
                                {record?.stage ?? '无'}
                            </Typography>
                            <div className={"order-show-status-ball" + ' ' +record?.stage}></div>
                        </Box>
                        {!isSmall ? <Box sx={{position: 'absolute', bottom: '0', right: '20px'}}>
                            <Button onClick={handleOrderExport}
                                    variant='outlined'>
                                <FileDownloadIcon />
                                导出订单内容
                            </Button>
                            <CSVLink headers={csvHeader} data={csvExportData}
                                     ref={csvLinkRef}>
                            </CSVLink>
                        </Box> : null }
                    </Box>
                    <Box display="flex" mt={3}>
                        <Box display="flex" mr={5} flexDirection="column">
                         <Typography color="textSecondary" variant="body2">
                                邮箱地址
                            </Typography>
                            <Typography variant="subtitle1">
                                {record?.email ?? '无'}
                            </Typography>
                         </Box>
                    </Box>
                    <Box mt={2} mb={2} style={{ whiteSpace: 'pre-line' }}>
                        <Typography color="textSecondary" variant="body2">
                            备注信息
                        </Typography>
                    </Box>
                    <Divider />
                    <Box mt={2} mb={2} style={{ whiteSpace: 'pre-line' }}>
                        <NotesIterator />
                    </Box>
                    <Box mt={6} mb={2} style={{ whiteSpace: 'pre-line' }}>
                        {record?.additional ? record?.additional.map((note, index) => (
                            <NoteList key={note?.noteId} note={note} handleDeleteNote={handleDeleteNote} />
                        )) : null}
                    </Box>
                    <Box mt={6}>
                        <Typography variant="h5" sx={{ whitespace: 'normal', wordBreak: 'break-all'}}>
                            板材配件数量统计
                        </Typography>
                        <Divider sx={{margin: '20px 0'}} textAlign="left">板材</Divider>
                        <Box display="flex" flexWrap="wrap">
                            {materialArray.map((each, index) => (
                                <Box key={index}
                                     sx={{
                                         display: 'flex',
                                         flexDirection: 'column',
                                         justifyContent: 'space-between',
                                         margin: '3px',
                                         padding: '10px',
                                         width: isSmall ? '100%' : 'none',
                                         maxWidth: isSmall ? 'none' : '180px',
                                         minWidth: isSmall ? 'none' : '140px',
                                         flexWrap: 'wrap',
                                         wordBreak: 'break-all',
                                         whiteSpace: 'normal',
                                         background: '#dfe6e9',
                                         borderRadius: '5px',
                                     }}
                                    >
                                    <Typography variant="body1" sx={{whitespace: 'normal', wordBreak: 'break-all'}}>
                                        {each.label}
                                    </Typography>
                                    {each.position ? <Typography variant="body1">
                                        总计({each.total})  存放: {each.position}
                                    </Typography> : null}
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {each.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        <Divider sx={{margin: '20px 0'}} textAlign="left">配件</Divider>
                        <Box display="flex" flexWrap="wrap">
                            {accessoryArray.map((each, index) => (
                                <Box key={index}
                                     sx={{
                                         display: 'flex',
                                         flexDirection: 'column',
                                         justifyContent: 'space-between',
                                         margin: '3px',
                                         padding: '10px',
                                         width: isSmall ? '100%' : 'none',
                                         maxWidth: isSmall ? 'none' : '180px',
                                         minWidth: isSmall ? 'none' : '140px',
                                         flexWrap: 'wrap',
                                         wordBreak: 'break-all',
                                         whiteSpace: 'normal',
                                         background: '#f1f2f6',
                                         borderRadius: '5px',
                                     }}
                                >
                                    <Typography variant="body1" sx={{whitespace: 'normal', wordBreak: 'break-all'}}>
                                        {each.label}
                                    </Typography>
                                     <Typography variant="body1">
                                        总计({each.total})
                                         {each.position ? `存放: ${each.position}` : null}
                                     </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {each.text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
    );
};


const  NotesIterator = () => {
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh()
    const [currentNote, setCurrentNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [imgFile, setImgFile] = useState('');
        useEffect(() => {
            if (imgFile) {
                const fileId = generateShortId();
                const uploadImgNote = async () => {
                    try {
                        const fileSize = Math.round(imgFile.size / 1024 / 1024);
                        const quality = fileSize >= 2 ? 0.4 : 0.6
                        new Compressor(imgFile, { quality, async success(compressedFile) {
                                const formData = new FormData();
                                formData.append('image', compressedFile);
                                formData.append('fileId', fileId);
                                formData.append('from', 'order');
                                await dataProvider.create('image',formData, {headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }});
                                const res = await dataProvider.update('order', {
                                    id: record?.id,
                                    fileId,
                                    type: 'img',
                                }, '?from=update_note');
                                if (res.success) {
                                    notify('增加图片成功');
                                    refresh();
                                } else {
                                    notify('增加图片失败');
                                }
                            }

                        })

                    } catch (e) {
                        console.log(e);
                        notify('增加图片失败');
                    }

                }
                uploadImgNote();
            }

    }, [imgFile]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!record?.id) return;
            const result = await dataProvider.update('order', {
                id: record.id,
                newNote: currentNote,
                type: 'text',
            }, '?from=update_note');
            if (result.success) {
                setCurrentNote('');
                notify('增加备注成功');
                refresh();
            } else {
                notify('增加备注失败');
            }
        } catch (e) {
            console.log(e);
            notify('增加备注失败');
        }

    }
    const handleImgUpload = async (event) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            setImgFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', (e) => {
                setImgUrl(e.target.result);
            })
        })
    }
    const handleChange = (event) => {
        event.preventDefault();
        const content = event?.target?.value;
        setCurrentNote(content);
    }
    return (
        <form onSubmit={handleSubmit}>
            <NoteInput fullWidth
                       rows={2}
                       multiline
                       value={currentNote}
                       onChange={handleChange}
                       label="add new note" />
            <Button
                sx={{float: 'right'}}
                onClick={handleImgUpload}
                color="primary"
            >
                <CollectionsIcon />
                上传图片
            </Button>
            <Button
                sx={{float: 'right'}}
                type="submit"
                color="primary"
                disabled={!currentNote || isLoading}
            >
                <BorderColorIcon />
                上传备注
            </Button>
        </form>
    )
}

const NoteList = ({ note, handleDeleteNote }) => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [displayUrl, setDisplayUrl] = useState('');
    const isImgNote = note?.type === 'img';
    const imgList = [displayUrl];

    const fetchImg = useCallback(async() => {
        if (note?.type === 'img') {
            const resp = await dataProvider.getImageBuffer('image', { id: note?.value }, {responseType: 'blob'});
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            setDisplayUrl(url);
        }
    }, []);

    useEffect(() => {
        fetchImg();
    }, []);

    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);
    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };

    return (
        <Box className="order-show-note-area">
        <Typography sx={{color: 'rgba(0, 0, 0, 0.6)'}} mb={2}>{new Date(note.noteTime).toLocaleString()}</Typography>
        <Box display="flex">
            { isImgNote
                ? <Box className="img-area">
                    <img style={{
                        // width: isSmall ? '100%' : '300px'
                        width: '100%'
                    }} alt='' src={displayUrl} onClick={() => openImageViewer(0)} />
                </Box>
                : <Box className="content-area">
                    <Typography>{note.value}</Typography>
                </Box>
            }
            <DeleteForeverIcon onClick={() => handleDeleteNote(note)} sx={{cursor:'pointer', marginLeft: '10px'}} />
        </Box>
            {isImgNote && isViewerOpen && (
                <ImageViewer
                    src={ imgList }
                    currentIndex={ 0 }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )}
    </Box>
    )
}