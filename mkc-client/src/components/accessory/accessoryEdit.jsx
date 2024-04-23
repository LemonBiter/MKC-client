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
    useRedirect, Edit, ImageField, SaveButton, DeleteButton, Toolbar, useRefresh, useRecordContext,
} from 'react-admin';
import '../../css/accessory.css'
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Zoom from "react-medium-image-zoom";


const EditToolbar = ({ displayImg }) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const record = useRecordContext();
    const currentBase64 = displayImg || record?.base64 || '';
    const onSuccess = async data => {
        try {
            if (data) {
                Object.defineProperty(data, 'base64', { value: currentBase64, enumerable: true });
                const jsonData = JSON.stringify(data);
                const res = await dataProvider.update('accessory', data);
                if (res.success) {
                    notify('更新成功');
                    redirect('/accessory');
                    refresh();
                }
            } else {
                notify('更新失败，使用了无效字段');
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
    <Toolbar>
        <SaveButton alwaysEnable
                    type="button"
                    label="保存"
                    mutationOptions={{ onSuccess }} />
        <DeleteButton
            label="删除"
        />
    </Toolbar>
)};

const ImageWrap = ({ displayImg }) => {
    const record = useRecordContext();
    const originSrc = record?.base64 || '';
    return <img alt='' src={displayImg ? displayImg : originSrc} />

}
const AccessoryEdit = () => {

    const notify = useNotify();
    const redirect = useRedirect();
    const [displayImg, setDisplayImg] = useState('');
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
        <Edit>
            <SimpleForm className="edit simple-form-wrap"
                        toolbar={<EditToolbar displayImg={displayImg} />}
            >
                <Typography variant="h6" gutterBottom>
                    物料详情
                </Typography>
                <Box className="form-box-wrap">
                    <Box className="form-box-item left" >
                        <Box className="img-upload">
                            <ImageWrap displayImg={displayImg} />
                        </Box>
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
        </Edit>
    );
}
export default AccessoryEdit;
