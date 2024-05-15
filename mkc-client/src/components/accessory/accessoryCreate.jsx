import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    NumberInput,
    required,
    useNotify,
    useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import CreatableSelect from 'react-select/creatable'
import '../../css/accessory.css'
import {RichTextInput} from "ra-input-rich-text";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Typography, useMediaQuery} from "@mui/material";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Compressor from "compressorjs";
import CircularProgress from "@mui/material/CircularProgress";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const AccessoryCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [displayImg, setDisplayImg] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (values) {
                const id = generateShortId()
                Object.defineProperty(values, 'id', { value: id, writable: false, enumerable: true });
                if (imgFile) {
                    const fileSize = Math.round(imgFile.size / 1024 / 1024);
                    const quality = fileSize >= 2 ? 0.4 : 0.6;
                    new Compressor(imgFile, {
                        quality, async success(compressedFile) {
                            const fileId = generateShortId();
                            const formData = new FormData();
                            formData.append('image', compressedFile);
                            formData.append('fileId', fileId);
                            formData.append('from', 'accessory');
                            await dataProvider.create('image',formData, {headers: {
                                    'Content-Type': 'multipart/form-data'
                                }});
                            Object.defineProperty(values, 'fileId', { value: fileId, enumerable: true });
                            const res = await dataProvider.create('accessory', values);
                            if (res.success) {
                                notify('创建成功');
                                setLoading(false);
                                redirect('/accessory');
                            } else {
                                setLoading(false);
                                notify('创建失败');
                            }
                        }});

                } else {
                    const res = await dataProvider.create('accessory', values);
                    if (res.success) {
                        notify('创建成功');
                        setLoading(false);
                        redirect('/accessory');
                    } else {
                        notify('创建失败');
                        setLoading(false);
                    }
                }

            } else {
                notify('创建失败，使用了无效字段');
                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    const handleCapture = (event) => {
        const file = event.target.files[0];
        setImgFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', (e) => {
            setDisplayImg(e.target.result)
        })
    };
    // const handleImgUpload = async () => {
    //     const input = document.createElement('input');
    //     input.type = 'file';
    //     input.click();
    //     input.addEventListener('change', (e) => {
    //         const file = e.target.files[0];
    //         setImgFile(file);
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.addEventListener('load', (e) => {
    //             setDisplayImg(e.target.result)
    //         })
    //     })
    // }
    return (
        <Create>
            <SimpleForm className="simple-form-wrap" onSubmit={handleSave}>
                <Typography variant="h6" gutterBottom>
                    配件详情
                </Typography>
                <Box className="form-box-wrap"
                     sx={{
                         display: 'flex',
                         flexDirection: isSmall? 'column' : 'row',
                     }}>
                    <Box className="form-box-item left" >
                        <div className="img-upload">
                            {displayImg ? <img alt='' src={displayImg} /> : '图片上传(非必需)'}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            // capture="environment"
                            onChange={handleCapture}
                        />
                        <Box sx={{height: '50px'}}>
                            {loading ? <CircularProgress /> : null}
                        </Box>
                        {/*<Button*/}
                        {/*    component="label"*/}
                        {/*    role={undefined}*/}
                        {/*    variant="contained"*/}
                        {/*    tabIndex={-1}*/}
                        {/*    startIcon={<CloudUploadIcon />}*/}
                        {/*    onClick={handleImgUpload}*/}
                        {/*>*/}
                        {/*    Upload file*/}
                        {/*</Button>*/}

                    </Box>
                    <Box className="form-box-item right" >
                        <Box flex>
                            <TextInput source="detail"
                                       variant="filled"
                                       validate={[required()]}
                                       fullWidth
                                       multiline
                                       label="物料名称"
                                       isRequired />
                            <TextInput source="position"
                                       variant="filled"
                                       sx={{marginRight: '10px'}}
                                       validate={[required()]}
                                       label="摆放位置" />
                        </Box>

                    </Box>
                </Box>
            </SimpleForm>
        </Create>
    );
}
export default AccessoryCreate;
