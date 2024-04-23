import * as React from 'react';
import {
    BooleanInput,
    DateField, DateInput,
    Edit,
    Form,
    Labeled, NumberInput,
    PrevNextButtons,
    ReferenceField, required,
    SelectInput, SimpleForm,
    TextField, TextInput,
    Toolbar, useNotify,
    useRecordContext, useRedirect,
    useTranslate,
} from 'react-admin';
import { Link as RouterLink } from 'react-router-dom';
import {Card, CardContent, Box, Grid, Typography, Link, Divider} from '@mui/material';
import Basket from './Basket';
import Totals from './Totals';
import {RichTextInput} from "ra-input-rich-text";
import CreatableSelect from "react-select/creatable";
import {useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import Zoom from "react-medium-image-zoom";
import ClearIcon from "@mui/icons-material/Clear";
import {useDispatch, useSelector} from "react-redux";
import {update} from "../../app/order";
import CloseIcon from "@mui/icons-material/Close";
import generateShortId from "ssid";
import {FormProvider, useFormContext} from "react-hook-form";
import {findItemById} from "../../utils";

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
const MaterialItem = ({ room, m }) => {
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        if (m.fileExist) {
            m.id = m.value;
            const fetchFile = async () => {
                const result = await dataProvider.getOne('material', m);
                const base64 = result.data.base64 || '';
                setFileUrl(base64);
            }
            fetchFile();
        }
    }, []);

    return (
        <Grid item xs={6} name="accessory">
            <Grid container spacing={1} className="material-item">
                <Grid className="detail" item xs={7}>
                    {fileUrl ? <Zoom>
                        <img src={fileUrl} alt='' />
                    </Zoom> : null}
                    {m.label}
                </Grid>
                <Grid item xs={1}>
                    <ClearIcon />
                </Grid>
                <Grid item xs={2}>
                    <NumberInput
                        defaultValue={1}
                        name={m.value} min={1}
                        sx={{ width: 'auto' }}
                        source="materialItem.count" />
                </Grid>
            </Grid>
        </Grid>
    )
}

const AccessoryItem = ({ room, m }) => {
    const [fileUrl, setFileUrl] = useState('');
    useEffect(() => {
        if (m.fileExist) {
            m.id = m.value;
            const fetchFile = async () => {
                const result = await dataProvider.getOne('accessory', m);
                const base64 = result.data.base64 || '';
                setFileUrl(base64);
            }
            fetchFile();
        }

    }, []);
    return (
        <Grid item xs={6}>
            <Grid container spacing={1} className="accessory-item">
                <Grid className="detail" item xs={7}>
                    {fileUrl ? <Zoom>
                        <img src={fileUrl} alt='' />
                    </Zoom> : null}
                    {m.label}
                </Grid>
                <Grid item xs={1}>
                    <ClearIcon />
                </Grid>
                <Grid item xs={2}>
                    <NumberInput
                        defaultValue={1}
                        name={m.value} min={1}
                        sx={{ width: 'auto' }}
                        source="accessoryItemm.count" />
                </Grid>
            </Grid>
        </Grid>
    )
}
const RoomCard = ({ materialList, accessoryList, onRoomDelete, room, roomDetail }) => {
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState([]);
    // useEffect(() => {
    //         const {material, accessory} = roomDetail;
    //         const currentMaterialItem = Object.keys(material).filter((m) => m !== 'undefined')
    //         const selectedMaterialArr = materialList.filter(each => currentMaterialItem.includes(each.id));
    //         setSelectedMaterial(selectedMaterialArr);
    // }, [materialList]);


    const materialListOptions = materialList.map(material => {
        return { value: material.id, label: material.detail, fileExist: material.fileExist }
    })

    const accessoryListOptions = accessoryList.map(accessory => {
        return { value: accessory.id, label: accessory.detail, fileExist: accessory.fileExist }
    })

    const updateSelectedMaterial = (value) => {
        console.log(value)
        setSelectedMaterial(value);
    }
    const updateSelectedAccessory = (value) => {
        setSelectedAccessory(value);
    }
    const removeRoom = (value) => {
        onRoomDelete(value);
    }
    return (
        <Card
            sx={{boxShadow: 'none', borderRadius: '0'}}
            className="room-card">
            <Box className="top">
                <Typography variant="subtitle1" gutterBottom>
                    {room.label}
                </Typography>
                <CloseIcon onClick={() => removeRoom(room.value)} className="close" />
            </Box>
            <Box className="middle">
                <Box className="middle-1">
                    <CreatableSelect
                        className="material-select"
                        onChange={(value) => updateSelectedMaterial(value)}
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
                        onChange={(value) => updateSelectedAccessory(value)}
                        options={accessoryListOptions}
                        isMulti
                        name="material" />
                    <Typography className="title" variant="subtitle2" gutterBottom>
                        添加配件
                    </Typography>
                </Box>
            </Box>
            <Grid container spacing={2} className="bottom">
                {selectedMaterial.map((m, i) => (
                    <MaterialItem className="material-item" room={room} m={m} key={i} />
                ))}
            </Grid>
            <Grid container spacing={2} className="bottom">
                {selectedAccessory.map((m, i) => (
                    <AccessoryItem className="accessory-item" room={room} m={m} key={i} />
                ))}
            </Grid>
        </Card>
    )
}



const OrderEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const roomInfo = useSelector((state) => state.order.value)

    const handleSave = async (values) => {
        try {
            if (values) {
                const id = generateShortId()
                Object.defineProperty(values, 'type', { value: 'ordered', enumerable: true })
                Object.defineProperty(values, 'id', { value: id, writable: false, enumerable: true });
                // Object.defineProperty(values, 'roomInfo', { value: roomInfo, enumerable: true });
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
        <Edit>
            <SimpleForm className="order-create-simple-form-wrap" warnWhenUnsavedChanges onSubmit={handleSave}>
                <Box className="order-create-form-box-wrap">
                    <Box className="order-create-form-box-item layer-1" >
                        <Typography variant="h6" gutterBottom>
                            Identity
                        </Typography>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput source="name"
                                           validate={[required()]}
                                           label="姓名"
                                           isRequired />
                            </Box>
                            <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="phone"
                                    label="电话"
                                    isRequired />
                            </Box>
                        </Box>
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <TextInput type="email" source="email" fullWidth />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Address
                        </Typography>
                        <TextInput
                            source="address"
                            multiline
                            fullWidth
                            helperText={false}
                        />
                        <Box display={{ xs: 'block', sm: 'flex' }}>
                            <Box flex={2} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput source="city" fullWidth helperText={false} />
                            </Box>
                            <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
                                <TextInput
                                    source="stateAbbr"
                                    fullWidth
                                    helperText={false}
                                />
                            </Box>
                            <Box flex={2}>
                                <TextInput source="zipcode" fullWidth helperText={false} />
                            </Box>
                        </Box>
                        <RichTextInput source="additional" label="备注" />
                        <DateInput label="Publication date" source="published_date" defaultValue={new Date()} />
                    </Box>
                    <Divider textAlign="center" sx={{margin: '10px 0'}}>房间添加</Divider>
                    <RoomSelectBox />
                </Box>
                <Box className="order-create-aside"></Box>
            </SimpleForm>
        </Edit>
    )
};

const RoomSelectBox = () => {
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
    const [roomDetail, setRoomDetail] = useState({});
    const record = useRecordContext();
    console.log(record)

    useEffect(() => {
        if (record && record?.room) {
            const rooms = Object.keys(record.room);
            if (Array.isArray(rooms) && rooms.length > 0) {
                const historyRooms = rooms.map(r => { return { value: r, label: r }});
                setSelectedRoom(historyRooms);
            }
            const roomArr = rooms.reduce((pre, roomName) => {
                pre[roomName] = record.room[roomName]
                return pre;
            }, {})
            setRoomDetail(roomArr);
        }
    }, []);

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

    const handleRoomDelete = (value) => {
        const roomSet = selectedRoom.filter(room => room.value !== value);
        setSelectedRoom(roomSet);
    }

    const handleHeightIncrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.add('room-box-on-click');
    }
    const handleHeightDecrease = () => {
        const roomBoxEl = document.getElementsByClassName('room-box')[0];
        roomBoxEl.classList.remove('room-box-on-click');
    }
    return <Box className="order-create-form-box-item layer-2">
        {loading ? 'loading...' : <CreatableSelect value={selectedRoom}
                                                   onMenuOpen={handleHeightIncrease}
                                                   onMenuClose={handleHeightDecrease}
                                                   onChange={(values) => setSelectedRoom(values)}
                                                   options={roomOptions}
                                                   isMulti
                                                   name="room" />}
        <Box className="room-box">
            {selectedRoom.map((room, index) => {
                return <RoomCard
                    source={room.label}
                    materialList={materialList}
                    accessoryList={accessoryList}
                    onRoomDelete={handleRoomDelete}
                    roomDetail={roomDetail[room.label]}
                    key={index}
                    room={room} />
            })}
        </Box>
    </Box>
}

export default OrderEdit;
