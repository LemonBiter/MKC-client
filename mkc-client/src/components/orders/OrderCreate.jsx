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
    getRecordFromLocation,
    Toolbar,
    Button,
    PasswordInput,
    ReferenceArrayInput,
    NumberInput,
    TextField,
    useRecordContext,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import CreatableSelect from 'react-select/creatable'
import '../../css/order.css'
import {RichTextInput} from "ra-input-rich-text";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Divider, Grid, Typography} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, update } from '../../app/order'

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


const MaterialItem = ({ onMaterialCountUpdate, room, m, index }) => {
    const [fileUrl, setFileUrl] = useState('');
    const handleCountChange = (event) => {
        onMaterialCountUpdate(m, event.target.value);
    }
    // const countSource = `room.${room.label}.material.m.${m.label}link${m.value}`;
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
        <Grid item xs={6} name="material">
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
                        min={1}
                        sx={{ width: 'auto' }}
                        source={"material-" + m.id }
                        onChange={(value) => handleCountChange(value)}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

const AccessoryItem = ({ onAccessoryCountUpdate, room, m }) => {
    const [fileUrl, setFileUrl] = useState('');
    // const countSource = `room.${room.label}.accessory.${m.id}`;

    const handleCountChange = (event) => {
        onAccessoryCountUpdate(m, event.target.value);
    }

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
                        min={1}
                        sx={{ width: 'auto' }}
                        source={"accessory-" + m.id }
                        onChange={(value) => handleCountChange(value)}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}
const RoomCard = ({ materialList, accessoryList, onRoomDelete, room, index }) => {
    const [selectedMaterial, setSelectedMaterial] = useState([]);
    const [selectedAccessory, setSelectedAccessory] = useState([]);
    const dispatch = useDispatch();
    const roomInfo = useSelector((state) => state.order.value)
    const materialListOptions = materialList.map(material => {
        return { value: material.id, label: material.detail, fileExist: material.fileExist }
    })

    const accessoryListOptions = accessoryList.map(accessory => {
        return { value: accessory.id, label: accessory.detail, fileExist: accessory.fileExist }
    })

    useEffect(() => {
        dispatch(update({ room: room.value, type: 'material', value: selectedMaterial  }));
        dispatch(update({ room: room.value, type: 'accessory', value: selectedAccessory  }));
    }, [selectedMaterial, selectedAccessory]);

    const onMaterialCountUpdate = (obj, value) => {
        if (obj && value) {
            const updateSelectedMaterial = selectedMaterial.map(each => {
                if (each.id === obj.id) {
                    const objCopy = _.cloneDeep(each);
                    const newObj = { count: parseInt(value) };
                    Object.assign(objCopy, newObj);
                    return objCopy;
                }
                return each;
            });
            setSelectedMaterial(updateSelectedMaterial);
        }
    }

    const onAccessoryCountUpdate = (obj, value) => {
        if (obj && value) {
            const updateAccessoryMaterial = selectedAccessory.map(each => {
                if (each.id === obj.id) {
                    const objCopy = _.cloneDeep(each);
                    const newObj = { count: parseInt(value) };
                    Object.assign(objCopy, newObj);
                    return objCopy;
                }
                return each;
            });
            setSelectedAccessory(updateAccessoryMaterial);
        }
    }

    const removeRoom = (value) => {
        onRoomDelete(value);
    }

    return (
    <Card
        sx={{boxShadow: 'none', borderRadius: '0'}}
        className="room-card">
        <Box className="top">
            {/*<TextInput source="room.name" defaultValue={room.label} disabled />*/}
            <CloseIcon onClick={() => removeRoom(room.value)} className="close" />
        </Box>
        <Box className="middle">
            <Box className="middle-1">
                <CreatableSelect
                    className="material-select"
                    onChange={(value) => setSelectedMaterial(value)}
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
                    onChange={(value) => setSelectedAccessory(value)}
                    options={accessoryListOptions}
                    isMulti
                    name="material" />
                <Typography className="title" variant="subtitle2" gutterBottom>
                    添加配件
                </Typography>
            </Box>
        </Box>
        <Grid container spacing={2} className="bottom">
            {selectedMaterial ? selectedMaterial.map((m, i) => (
                <MaterialItem onMaterialCountUpdate={onMaterialCountUpdate} className="material-item" room={room} m={m} key={i} />
            )) : null}
        </Grid>
        <Grid container spacing={2} className="bottom">
            {selectedAccessory ? selectedAccessory.map((m, i) => (
                <AccessoryItem onAccessoryCountUpdate={onAccessoryCountUpdate} className="accessory-item" room={room} m={m} key={i} />
            )) : null}
        </Grid>
    </Card>
    )
}

const RoomSelectBox = () => {
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
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
                    // source="room"
                    materialList={materialList}
                    accessoryList={accessoryList}
                    onRoomDelete={handleRoomDelete}
                    key={index}
                    index={index}
                    room={room} />
            })}
        </Box>
    </Box>
}
const OrderCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const record = useRecordContext();
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [accessoryList, setAccessoryList] = useState([]);
    const roomInfo = useSelector((state) => state.order.value)
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
                const id = generateShortId()
                Object.defineProperty(values, 'type', { value: 'ordered', enumerable: true })
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
        <Create>
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
        </Create>
    );
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



