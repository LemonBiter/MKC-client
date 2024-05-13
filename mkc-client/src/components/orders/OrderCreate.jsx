import * as React from 'react';
import _ from 'lodash';
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
    SaveButton,
    Toolbar,
    useRecordContext, TopToolbar, ShowButton, ListButton,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import CreatableSelect from 'react-select/creatable'
import '../../css/order.css'
import OrderAside from './OrderAside'
import {RichTextInput} from "ra-input-rich-text";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Divider, Grid, Typography, Dialog, TextField, useMediaQuery} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import { useSelector, useDispatch } from 'react-redux'
import { removedSelection, cleanAll, update } from '../../app/order'

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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(update({
            id: m.value,
            position: m.position,
            label: m.label,
            room: room.value,
            count: 1,
            type: 'material'
        }))
    }, [1]);

    useEffect(() => {
        dispatch(update(materialDetail));
    }, [materialDetail]);


    const handleCountChange = (event) => {
        setMaterialDetail({id: m.value, position: m.position, label: m.label, room: room.value, count: event.target.value, type: 'material' });
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
                    defaultValue={1}
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
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(update({
            id: m.value,
            position: m.position,
            label: m.label,
            room: room.value,
            count: 1,
            type: 'accessory'
        }))
    }, [1]);

    useEffect(() => {
        dispatch(update(accessoryDetail));
    }, [accessoryDetail]);

    const handleCountChange = (event) => {
        setAccessoryDetail({id: m.value, position: m.position, label: m.label, room: room.value, count: event.target.value, type: 'accessory' });
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
                defaultValue={1}
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
const RoomCard = ({ materialList, accessoryList, onRoomDelete, room, index }) => {
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState([]);
    const roomInfo = useSelector((state) => state.order.value);
    const dispatch = useDispatch();
    const materialListOptions = materialList.map(material => {
        return { value: material.id, label: material.detail, position: material?.position, fileExist: material.fileExist }
    })
    const accessoryListOptions = accessoryList.map(accessory => {
        return { value: accessory.id, label: accessory.detail, position: accessory?.position, fileExist: accessory.fileExist }
    })

    useEffect(() => {
        console.log('roomInfo:', roomInfo);
    }, [roomInfo]);

    const handleUpdateMaterial = (value, actionMeta) => {
        if (actionMeta.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ id: removed, room: room.value, type: 'material' }))
        }
        setSelectedMaterial(value)
    }

    const handleUpdateAccessory = (value, actionMeta) => {
        if (actionMeta.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ id: removed, room: room.value, type: 'accessory' }))
        }
        setSelectedAccessory(value)
    }

    return (
    <Card
        sx={{boxShadow: 'none', borderRadius: '0'}}
        className="room-card">
        <Box position="relative">
            <Divider textAlign="left" sx={{margin: '30px 0 10px 0'}}><h2>{room.label}</h2></Divider>
            <CloseIcon sx={{position:"absolute", top: '10px', right: '20px', cursor: 'pointer'}}
                       onClick={() => removeRoom(room.value)} className="close" />
        </Box>

        <Box className="top">
        </Box>
        <Box className="middle">
            <Box className="middle-1">
                <CreatableSelect
                    className="material-select"
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
    // const handleRoomDelete = (value) => {
    //     const roomSet = selectedRoom.filter(room => room.value !== value);
    //     setSelectedRoom(roomSet);
    // }

    const handleHeightIncrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.add('room-box-on-click');
    }

    const handleHeightDecrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.remove('room-box-on-click');
    }

    const handleRoomUpdate = (values, actionMeta) => {
        if (actionMeta.removedValue) {
            const removed = actionMeta?.removedValue?.value
            dispatch(removedSelection({ room: removed }))
        }
        setSelectedRoom(values);
    }

    return <Box className="order-create-form-box-item layer-2">
        {loading ? 'loading...' : <CreatableSelect onMenuOpen={handleHeightIncrease}
                                                   onMenuClose={handleHeightDecrease}
                                                   // value={selectedRoom}
                                                   onChange={(values,actionMeta) => handleRoomUpdate(values, actionMeta)}
                                                   options={roomOptions}
                                                   isMulti
                                                   name="room" />}
        <Box className="room-box">
            {selectedRoom.map((room, index) => {
                return <RoomCard
                    materialList={materialList}
                    accessoryList={accessoryList}
                    // onRoomDelete={handleRoomDelete}
                    key={room.value}
                    index={index}
                    room={room} />
            })}
        </Box>
    </Box>
}
const OrderCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const dispatch = useDispatch();
    const record = useRecordContext();
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
    const roomInfo = useSelector((state) => state.order.value)
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

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

    useEffect(() => {
        console.log('init:', roomInfo);
        if (roomInfo && Object.keys(roomInfo)?.length) {
            dispatch(cleanAll());
        }
    }, [1]);
    const handleSave = async (values) => {
        try {
            if (values) {
                const id = generateShortId()
                Object.defineProperty(values, 'stage', { value: 'ordered', enumerable: true })
                Object.defineProperty(values, 'id', { value: id, writable: false, enumerable: true });
                Object.defineProperty(values, 'roomInfo', { value: roomInfo, enumerable: true });
                const jsonData = JSON.stringify(values);
                const res = await dataProvider.create('order', values);
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
        // <Dialog open={true}>
            <Create aaside={!isSmall ? <OrderAside roomInfo={roomInfo} /> : <Fragment/>} actions={<CreateActions />}>
            <SimpleForm toolbar={<CreateToolBar />}
                        className="order-create-simple-form-wrap"
                        warnWhenUnsavedChanges
                        onSubmit={handleSave}>
                <Box className="order-create-form-box-wrap">
                    <Box className="order-create-form-box-item layer-1" >
                        <Typography variant="h6" gutterBottom>
                            Identity
                        </Typography>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput source="name"
                                           validate={[required()]}
                                           variant="standard"
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
                                       source="email"
                                       variant="standard"
                                       fullWidth />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Address
                        </Typography>
                        <TextInput
                            source="address"
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
                        <TextInput source="additional"
                                       sx={{marginTop: '20px'}}
                                       variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                       label="备注" />
                        <DateInput label="Publication date"
                                   variant="standard"
                                   source="published_date"
                                   defaultValue={new Date()} />
                    </Box>
                    <Divider textAlign="center" sx={{margin: '10px 0 50px 0'}}>房间添加</Divider>
                    <RoomSelectBox />
                </Box>
                <Box className="order-create-aside" sx={{flex: isSmall ? '0' : '1'}}></Box>
            </SimpleForm>
        </Create>
        // </Dialog>
    );
}
const CreateActions = () => {
    return (
        <TopToolbar>
            {/*<ShowButton />*/}
            <ListButton />
        </TopToolbar>
    )};

const CreateToolBar = () => {
    return (
        <Toolbar>
            <SaveButton alwaysEnable type="submit" />
        </Toolbar>
    )
}
export default OrderCreate;

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



