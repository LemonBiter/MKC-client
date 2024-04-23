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
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import CreatableSelect from 'react-select/creatable'
import '../../css/material.css'
import {RichTextInput} from "ra-input-rich-text";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Typography} from "@mui/material";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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


const MaterialCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [displayImg, setDisplayImg] = useState('');
    const handleSave = async (values) => {
        try {
            if (values) {
                const id = generateShortId()
                Object.defineProperty(values, 'id', { value: id, writable: false, enumerable: true });
                Object.defineProperty(values, 'base64', { value: displayImg, enumerable: true });
                const jsonData = JSON.stringify(values);
                const res = await dataProvider.create('material', values);
                if (res.success) {
                    notify('创建成功');
                    redirect('/material');
                }
            } else {
                notify('创建失败，使用了无效字段');
            }
        } catch (e) {

        }

    }
    const handleImgUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.click();
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', (e) => {
                setDisplayImg(e.target.result)
            })
        })

    }
    return (
        <Create>
            <SimpleForm className="simple-form-wrap" onSubmit={handleSave}>
                <Typography variant="h6" gutterBottom>
                    物料详情
                </Typography>
                <Box className="form-box-wrap">
                    <Box className="form-box-item left" >
                        <div className="img-upload">
                            {displayImg ? <img alt='' src={displayImg} /> : '图片上传(非必需)'}
                        </div>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            onClick={handleImgUpload}
                        >
                            Upload file
                        </Button>

                    </Box>
                    <Box className="form-box-item right" >
                        <TextInput source="detail"
                                   validate={[required()]}
                                   fullWidth
                                   multiline
                                   label="物料详情"
                                   isRequired />
                    </Box>
                </Box>
            </SimpleForm>
        </Create>
    );
}
export default MaterialCreate;
