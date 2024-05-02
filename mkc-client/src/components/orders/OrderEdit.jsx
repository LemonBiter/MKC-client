import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    required,
    useNotify,
    useRedirect,
    getRecordFromLocation,
    Toolbar,
    PasswordInput,
    ReferenceArrayInput,
    NumberInput,
    useRecordContext, Edit, ShowButton, TopToolbar, ListButton, useListContext, useRefresh, SaveButton, DeleteButton,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import CreatableSelect from 'react-select/creatable'
import '../../css/order.css'
import {RichTextInput} from "ra-input-rich-text";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Divider, Grid, TextField, Typography, Button} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import { useSelector, useDispatch } from 'react-redux'
import {decrement, increment, removedSelection, update} from '../../app/order'
import _ from "lodash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import OrderAside from "./OrderAside";

const roomOptions = [
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Laundry', label: 'Laundry' },
    { value: 'Bathroom', label: 'Bathroom' },
    { value: 'Storage', label: 'Storage' },
    { value: 'StudyRoom', label: 'StudyRoom' },
    { value: 'bedroom1', label: 'bedroom 1' },
    { value: 'bedroom2', label: 'bedroom 2' },
    { value: 'bedroom3', label: 'bedroom 3' },

]


const MaterialItem = ({ room, m, index }) => {
    const [materialDetail, setMaterialDetail] = useState({});
    const [countDisplay, setCountDisplay] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        setMaterialDetail({
            id: m?.value,
            position: m.position,
            label: m?.label,
            room: room.value,
            count: parseInt(m?.count) || 1,
            type: 'material'
        })
        setCountDisplay(parseInt(m?.count) || 1);
    }, [1]);

    useEffect(() => {
        dispatch(update(materialDetail));
    }, [materialDetail]);

    const handleCountChange = (event) => {
        setCountDisplay(event.target.value);
        setMaterialDetail({id: m?.value, position: m.position, label: m.label, room: room.value, count: event.target.value, type: 'material' });
    }

    return (
        <Box className="material-item" paddingLeft={3}>
            <Box sx={{width: '300px', whiteSpace: 'normal', wordBreak:'break-all'}}>
                <Typography >
                    {m.label}
                </Typography>
            </Box>
            <ClearIcon />
            <TextField
                type="number"
                variant="standard"
                label="数量"
                value={countDisplay}
                min={1}
                sx={{ width: '100px' }}
                onChange={(value) => handleCountChange(value)}
            />
            <Typography color="textSecondary"
                        variant="subtitle2"
                        sx={{width: '90px'}}
                        marginLeft={2} >
                (位置：{m.position ? m.position : '未知'})
            </Typography>
        </Box>
    )
}

const AccessoryItem = ({ room, m, index }) => {
    const [accessoryDetail, setAccessoryDetail] = useState({});
    const [countDisplay, setCountDisplay] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        setAccessoryDetail({
            id: m?.value,
            position: m.position,
            label: m?.label,
            room: room.value,
            count: parseInt(m?.count) || 1,
            type: 'accessory'
        })
        setCountDisplay(parseInt(m?.count) || 1);
    }, [1]);

    useEffect(() => {
        dispatch(update(accessoryDetail));
    }, [accessoryDetail]);

    const handleCountChange = (event) => {
        setCountDisplay(event.target.value);
        setAccessoryDetail({id: m?.value, position: m.position, label: m.label, room: room.value, count: event.target.value, type: 'accessory' });
    }

    return (
        <Box className="accessory-item" paddingLeft={3}>
            <Box sx={{width: '300px', whiteSpace: 'normal', wordBreak:'break-all'}}>
                <Typography >
                    {m.label}
                </Typography>
            </Box>
            <ClearIcon />
            <TextField
                type="number"
                variant="standard"
                label="数量"
                value={countDisplay}
                min={1}
                sx={{ width: '100px' }}
                onChange={(value) => handleCountChange(value)}
            />
            <Typography color="textSecondary"
                        variant="subtitle2"
                        sx={{width: '90px'}}
                        marginLeft={2} >
                (位置：{m.position ? m.position : '未知'})
            </Typography>
        </Box>
    )
}
const RoomCard = ({ roomInfo, materialList, accessoryList, onRoomDelete, room, index }) => {
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState([]);
    // const roomInfo = useSelector((state) => state.order.value);
    const dispatch = useDispatch();
    const materialListOptions = materialList.map(material => {
        return { value: material.id, label: material.detail, position: material?.position, fileExist: material.fileExist }
    })
    const accessoryListOptions = accessoryList.map(accessory => {
        return { value: accessory.id, label: accessory.detail, position: accessory?.position, fileExist: accessory.fileExist }
    })

    useEffect(() => {
        const material = roomInfo?.material;
        const accessory = roomInfo?.accessory;
        if (material) {
            const idArr = Object.keys(material);
            const previousMaterialArr = idArr.reduce((pre, cur, index, arr) => {
                pre.push({ value: cur, label: material[cur]?.label, position: material[cur]?.position, count: material[cur]?.count });
                return pre;
            }, []);
            handleUpdateMaterial(previousMaterialArr);
        }
        if (accessory) {
            const idArr = Object.keys(accessory);
            const previousAccessoryArr = idArr.reduce((pre, cur, index, arr) => {
                pre.push({ value: cur, label: accessory[cur]?.label, position: accessory[cur]?.position, count: accessory[cur]?.count });
                return pre;
            }, []);
            console.log('previousAccessoryArr: ', previousAccessoryArr);
            handleUpdateAccessory(previousAccessoryArr);
        }
    }, [roomInfo]);

    const handleUpdateMaterial = (value, actionMeta) => {
        if (actionMeta?.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ id: removed, room: room.value, type: 'material' }))
        }
        setSelectedMaterial(value);
    }

    const handleUpdateAccessory = (value, actionMeta) => {
        if (actionMeta?.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ id: removed, room: room.value, type: 'accessory' }))
        }
        console.log('value:', value);
        setSelectedAccessory(value);
    }

    return (
        <Card
            sx={{boxShadow: 'none', borderRadius: '0'}}
            className="room-card">
            <Box position="relative">
                <Divider textAlign="left" sx={{margin: '30px 0 10px 0'}}><h2>{room.label}</h2></Divider>
                {/*<CloseIcon sx={{position:"absolute", top: '10px', right: '20px', cursor: 'pointer'}}*/}
                {/*           onClick={() => removeRoom(room.value)} className="close" />*/}
            </Box>

            <Box className="top">
            </Box>
            <Box className="middle">
                <Box className="middle-1">
                    <CreatableSelect
                        className="material-select"
                        value={selectedMaterial}
                        onChange={(value, actionMeta) => handleUpdateMaterial(value, actionMeta)}
                        options={materialListOptions}
                        isMulti
                        name="material" />
                    <Typography className="title" variant="subtitle2" gutterBottom>
                        添加物料
                    </Typography>
                </Box>
                <Box className="middle-2">
                    <CreatableSelect
                        className="material-select"
                        value={selectedAccessory}
                        onChange={(value, actionMeta) => handleUpdateAccessory(value, actionMeta)}
                        options={accessoryListOptions}
                        isMulti
                        name="material" />
                    <Typography className="title" variant="subtitle2" gutterBottom>
                        添加配件
                    </Typography>
                </Box>
            </Box>

            <Box className="bottom">
                <Box className='bottom-left'>
                    {selectedMaterial?.length ? <Divider textAlign="left" sx={{margin: '30px 0 10px 0'}}><h4>物料列表</h4></Divider> : null}
                    {selectedMaterial?.length ? selectedMaterial.map((m, i) => (
                        <MaterialItem
                            className="material-item"
                            room={room}
                            m={m}
                            key={i} />
                    )) : null}
                </Box>
                <Box className='bottom-right'>
                    {selectedAccessory?.length ? <Divider textAlign="left" sx={{margin: '30px 0 10px 0'}}>配件列表</Divider> : null}
                    {selectedAccessory?.length ? selectedAccessory.map((m, i) => (
                        <AccessoryItem className="accessory-item" room={room} m={m} key={i} />
                    )) : null}
                </Box>

            </Box>
        </Card>
    )
}

const RoomSelectBox = () => {
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMaterialList = async () => {
            const { data } = await dataProvider.getListWithoutFile('material');
            setMaterialList(data);
            setLoading(false);
        }
        const fetchAccessoryList = async () => {
            const { data } = await dataProvider.getListWithoutFile('accessory');
            setAccessoryList(data);
            setLoading(false);
        }
        fetchMaterialList();
        fetchAccessoryList();

    }, []);
    const { roomInfo } = useRecordContext();
    useEffect(() => {
        const rooms = Object.keys(roomInfo).map((room) => {
            return { value: room, label: room }
        });
        handleRoomUpdate(rooms)
    }, [roomInfo]);
    const handleHeightIncrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.add('room-box-on-click');
    }

    const handleHeightDecrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.remove('room-box-on-click');
    }

    const handleRoomUpdate = (values, actionMeta) => {
        if (actionMeta?.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ room: removed }))
        }
        setSelectedRoom(values);
    }

    return <Box className="order-create-form-box-item layer-2">
        {loading ? 'loading...' : <CreatableSelect onMenuOpen={handleHeightIncrease}
                                                   onMenuClose={handleHeightDecrease}
                                                   value={selectedRoom}
                                                   onChange={(values,actionMeta) => handleRoomUpdate(values, actionMeta)}
                                                   options={roomOptions}
                                                   isMulti
                                                   name="room" />}
        <Box className="room-box">
            {selectedRoom.map((room, index) => {
                return <RoomCard
                    materialList={materialList}
                    accessoryList={accessoryList}
                    key={room.value}
                    roomInfo={roomInfo[room.value]}
                    index={index}
                    room={room} />
            })}
        </Box>
    </Box>
}
const EditToolbar =() => {
    return(
        <Toolbar>
            <SaveButton alwaysEnable type="submit" />
            <DeleteButton />
        </Toolbar>
    )
}
const EditActions = () => {
    return (
        <TopToolbar>
            <ShowButton />
            <ListButton />
        </TopToolbar>
    )};
const OrderEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
    const roomInfo = useSelector((state) => state.order.value)
    const [roomInfoDetail, setRoomInfoDetail] = useState({});

    useEffect(() => {
        setRoomInfoDetail(roomInfo)
    }, [roomInfo]);
    useEffect(() => {
        const fetchMaterialList = async () => {
            const { data } = await dataProvider.getListWithoutFile('material');
            setMaterialList(data);
            setLoading(false);
        }
        const fetchAccessoryList = async () => {
            const { data } = await dataProvider.getListWithoutFile('accessory');
            setAccessoryList(data);
            setLoading(false);
        }
        fetchMaterialList();
        fetchAccessoryList();
    }, []);
    const handleSave = async (values) => {
        try {
            if (values) {
                Object.defineProperty(values, 'roomInfo', { value: roomInfo, enumerable: true });
                const jsonData = JSON.stringify(values);
                const res = await dataProvider.update('order', values,'?from=edit_page');
                if (res.success) {
                    notify('创建成功');
                    redirect('/order');
                }
            } else {
                notify('创建失败，使用了无效字段');
            }
        } catch (e) {

        }

    }
    return (
        <Edit aside={<OrderAside roomInfo={roomInfoDetail} />} actions={<EditActions />}>
            <SimpleForm className="order-create-simple-form-wrap"
                        toolbar={<EditToolbar />}
                        warnWhenUnsavedChanges
                        onSubmit={handleSave}
            >
                <Box className="order-create-form-box-wrap">
                    <Box className="order-create-form-box-item layer-1" >
                        <Typography variant="h6" gutterBottom>
                            Identity
                        </Typography>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput source="name"
                                           variant="standard"
                                           validate={[required()]}
                                           label="姓名"
                                           isRequired />
                            </Box>
                            <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="phone"
                                    variant="standard"
                                    label="电话"
                                    isRequired />
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <TextInput type="email"
                                       variant="standard"
                                       source="email"
                                       fullWidth />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Address
                        </Typography>
                        <TextInput
                            source="address"
                            name="address"
                            multiline
                            fullWidth
                            variant="standard"
                            helperText={false}
                        />
                        <Typography variant="h6"
                                    sx={{marginTop: '20px'}}
                                    gutterBottom>
                            Notes
                        </Typography>
                        <Box mt={2} mb={2} style={{ whiteSpace: 'pre-line' }}>
                            <NotesIterator />
                            <NoteArea />
                        </Box>
                        <Box mt={6} mb={2} style={{ whiteSpace: 'pre-line' }}>
                            <DateInput label="Publication date" source="published_date" defaultValue={new Date()} />
                        </Box>
                    </Box>
                    <Divider textAlign="center" sx={{margin: '10px 0'}}>房间添加</Divider>
                    <RoomSelectBox />
                </Box>
                <Box className="order-create-aside"></Box>
            </SimpleForm>
        </Edit>
    );
}

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
        <Box>
            <TextField fullWidth
                       rows={2}
                       multiline
                       value={currentNote}
                       onChange={handleChange}
                       label="add new note" />
            <Button
                sx={{float: 'right'}}
                type="submit"
                color="primary"
                onClick={handleSubmit}
                disabled={!currentNote || isLoading}
            >
                Add this note
            </Button>
        </Box>
    )
}
const NoteArea = () => {
    const record = useRecordContext();
    const refresh = useRefresh();
    if (!record || !record?.additional) return;
    const handleDeleteNote = async (note)=> {
        if (!record.id || !note.noteId) return;
        const res = await dataProvider.delete('order', { id: record.id, noteId: note.noteId });
        if (res?.success) {
            refresh();
        }
    }
    return (<Fragment>
        {record.additional.map((note, index) => (
            <Box className="order-show-note-area" key={index}>
                <Typography sx={{color: 'rgba(0, 0, 0, 0.6)'}} mb={2}>{new Date(note.noteTime).toLocaleString()}</Typography>
                <Box display="flex">
                    <Box className="content-area">
                        <Typography>{note.value}</Typography>
                    </Box>
                    <DeleteForeverIcon onClick={() => handleDeleteNote(note)} sx={{cursor:'pointer', marginLeft: '10px'}} />
                </Box>
            </Box>
        ))}
    </Fragment>)

};

export default OrderEdit;

/*

1. 姓名
2. 地址
3. 电话
4. 邮箱（可选）
5. 下单时间
6. 板子选项（下拉框）
    6.1. 配件（下拉框）
7. 额外信息

 */



