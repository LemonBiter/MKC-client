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
    useRedirect,
    Edit,
    ImageField,
    SaveButton,
    DeleteButton,
    Toolbar,
    useRefresh,
    useRecordContext,
    NumberInput,
    useEditController,
} from 'react-admin';
import '../../css/accessory.css'
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";
import {Fragment, useEffect, useState} from "react";
import {Box, Card, Typography, useMediaQuery} from "@mui/material";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Zoom from "react-medium-image-zoom";
import CircularProgress from "@mui/material/CircularProgress";


// const EditToolbar = ({ displayImg }) => {
//     const notify = useNotify();
//     const redirect = useRedirect();
//     const refresh = useRefresh();
//     const record = useRecordContext();
//     const currentBase64 = displayImg || record?.base64 || '';
//     const onSuccess = async data => {
//         try {
//             if (data) {
//                 Object.defineProperty(data, 'base64', { value: currentBase64, enumerable: true });
//                 const jsonData = JSON.stringify(data);
//                 const res = await dataProvider.update('accessory', data);
//                 if (res.success) {
//                     notify('更新成功');
//                     redirect('/accessory');
//                     refresh();
//                 }
//             } else {
//                 notify('更新失败，使用了无效字段');
//             }
//         } catch (e) {
//             console.log(e)
//         }
//     };
//
//     return (
//         <Toolbar>
//             <SaveButton alwaysEnable
//                         type="button"
//                         label="保存"
//                         mutationOptions={{ onSuccess }} />
//             <DeleteButton
//                 label="删除"
//             />
//         </Toolbar>
//     )};

const ImageWrap = ({displayUrl}) => {
    return <div className="img-upload">
        {displayUrl ? <img alt='' src={displayUrl} /> : '图片上传(非必需)'}
    </div>;

}
const AccessoryEdit = (props) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const [displayUrl, setDisplayUrl] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
    const { record } = useEditController();
    useEffect(() => {
        if (record?.fileId) {
            const fetchImg = async () => {
                const resp = await dataProvider.getImageBuffer('image', { id: record.fileId }, {responseType: 'blob'});
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                setDisplayUrl(url);
            }
            fetchImg();
        }
    }, [record]);
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
    //             setDisplayUrl(e.target.result)
    //         })
    //     })
    //
    // }
    const handleCapture = (event) => {
        const file = event.target.files[0];
        setImgFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', (e) => {
            setDisplayUrl(e.target.result);
        })
    };
    const handleSave = async (values) => {
        setLoading(true);
        try {
            if (values) {
                const id = generateShortId()
                if (imgFile) {
                    const formData = new FormData();
                    formData.append('image', imgFile);
                    formData.append('fileId', values.fileId);
                    formData.append('from', 'accessory');
                    await dataProvider.updateImage('image', values.fileId, formData, {headers: {
                            'Content-Type': 'multipart/form-data'
                        }});
                    Object.defineProperty(values, 'fileId', { value: values.fileId, enumerable: true });
                }
                const res = await dataProvider.update('accessory', values, '?from=update_info');
                if (res.success) {
                    notify('创建成功');
                    setLoading(false);
                    redirect('/accessory');
                }
            } else {
                setLoading(false);
                notify('创建失败，使用了无效字段');
            }
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    }
    return (
        <Edit>
            <SimpleForm className="simple-form-wrap" onSubmit={handleSave}>
                <Typography variant="h6" gutterBottom>
                    物料详情
                </Typography>
                <Box className="form-box-wrap" sx={{
                    display: 'flex',
                    flexDirection: isSmall? 'column' : 'row',
                }}>
                    <Box className="form-box-item left" >
                        <ImageWrap displayUrl={displayUrl} />
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
        </Edit>
    );
}
export default AccessoryEdit;
