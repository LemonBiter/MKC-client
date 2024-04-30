import * as React from 'react';
import {
    SimpleForm,
    Create,
    ReferenceInput,
    TextInput,
    DateInput,
    AutocompleteInput,
    useListContext,
    required,
    useNotify,
    useRedirect, Edit, ImageField, SaveButton, DeleteButton, Toolbar, useRefresh, useRecordContext, NumberInput,
} from 'react-admin';
import '../../css/material.css'
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
                const res = await dataProvider.update('material', data);
                if (res.success) {
                    notify('更新成功');
                    redirect('/material');
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

const ImageWrap = ({displayImg}) => {
    const record = useRecordContext();
    const originSrc = record?.base64 || '';
    if (displayImg) {
        return <div className="img-upload">
            <img alt='' src={displayImg} />
        </div>;
    } else {
        return <div className="img-upload">
            {originSrc ? <img alt='' src={originSrc} /> : '图片上传(非必需)'}
        </div>;
    }

}
const MaterialEdit = (props) => {
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
    const handleSave = async (values) => {
        console.log(values)
        try {
            if (values) {
                const id = generateShortId()
                if (displayImg) {
                    Object.defineProperty(values, 'base64', { value: displayImg, enumerable: true });
                }
                const res = await dataProvider.update('material', values, '?from=update_info');
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
    return (
        <Edit>
            <SimpleForm className="simple-form-wrap" onSubmit={handleSave}>
                <Typography variant="h6" gutterBottom>
                    物料详情
                </Typography>
                <Box className="form-box-wrap">
                    <Box className="form-box-item left" >
                        <ImageWrap displayImg={displayImg} />
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
                                       label="摆放位置"
                                       isRequired />
                        </Box>

                    </Box>
                </Box>
            </SimpleForm>
        </Edit>
    );
}
export default MaterialEdit;
