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
import { calculateCount } from '../utils';
import { Box, Dialog, DialogContent, Typography, Divider, TextField as NoteInput, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../../css/order.css'

import {useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";

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
    const refresh = useRefresh();
    const record = useRecordContext();
    if (!record) return null;
    const roomInfo = record.roomInfo;
    const { mArr, aArr } = calculateCount(roomInfo);
    const localTime = new Date(record?.published_date).toLocaleString();
    const handleDeleteNote = async (note) => {
        if (!record.id || !note.noteId) return;
        const res = await dataProvider.delete('order', { id: record.id, noteId: note.noteId });
        if (res?.success) {
            refresh();
        }
    }
    return (
                <Box>
                    <Typography variant="h5">{record.name ?? '无'}</Typography>
                    <Box display="flex" mt={3}>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                电话
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.phone ?? '无'}
                            </Typography>
                        </Box>
                        <Box display="flex" mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                地址
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.address ?? '无'}
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
                        <Box display="flex" sx={{position: 'relative'}} mr={5} flexDirection="column">
                            <Typography color="textSecondary" variant="body2">
                                Stage
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.stage ?? '无'}
                            </Typography>
                            <div className={"order-show-status-ball" + ' ' +record.stage}></div>
                        </Box>
                    </Box>
                    <Box display="flex" mt={3}>
                        <Box display="flex" mr={5} flexDirection="column">
                         <Typography color="textSecondary" variant="body2">
                                邮箱地址
                            </Typography>
                            <Typography variant="subtitle1">
                                {record.email ?? '无'}
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
                        {record.additional ? record.additional.map((note, index) => (
                            <Box className="order-show-note-area" key={index}>
                                <Typography sx={{color: 'rgba(0, 0, 0, 0.6)'}} mb={2}>{new Date(note.noteTime).toLocaleString()}</Typography>
                                <Box display="flex">
                                    <Box className="content-area">
                                        <Typography>{note.value}</Typography>
                                    </Box>
                                    <DeleteForeverIcon onClick={() => handleDeleteNote(note)} sx={{cursor:'pointer', marginLeft: '10px'}} />
                                </Box>
                            </Box>
                        )) : null}
                    </Box>
                    <Box mt={6}>
                        <Typography variant="h5" sx={{ whitespace: 'normal', wordBreak: 'break-all'}}>
                            板材配件数量统计
                        </Typography>
                        <Divider sx={{margin: '20px 0'}} textAlign="left">板材</Divider>
                        <Box display="flex" flexWrap="wrap">
                            {mArr.map((each, index) => (
                                <Box key={index}
                                     sx={{
                                         display: 'flex',
                                         flexDirection: 'column',
                                         justifyContent: 'space-between',
                                         margin: '3px',
                                         padding: '10px',
                                         maxWidth: '180px',
                                         minWidth: '140px',
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
                            {aArr.map((each, index) => (
                                <Box key={index}
                                     sx={{
                                         display: 'flex',
                                         flexDirection: 'column',
                                         justifyContent: 'space-between',
                                         margin: '3px',
                                         padding: '10px',
                                         maxWidth: '180px',
                                         minWidth: '140px',
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!record?.id) return;

            const result = await dataProvider.update('order', {
                id: record.id,
                newNote: currentNote
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
                type="submit"
                color="primary"
                disabled={!currentNote || isLoading}
            >
                Add this note
            </Button>
        </form>
    )
}