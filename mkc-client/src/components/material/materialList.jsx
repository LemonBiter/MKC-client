import * as React from 'react';
import {
    AutocompleteInput,
    Datagrid,
    DatagridConfigurable,
    DateField,
    DateInput,
    EditButton,
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    NullableBooleanInput,
    ReferenceInput,
    SearchInput,
    SelectColumnsButton,
    TextInput,
    TopToolbar,
    useListContext,
    useTranslate,
    ImageField,
    RecordContextProvider,
    useCreatePath,
    useRecordContext,
    SelectField, useNotify,
} from 'react-admin';
import 'react-medium-image-zoom/dist/styles.css'
import {Button, Box, Paper, Typography, TextField, Link as MuiLink, Dialog, DialogTitle, DialogActions, DialogContent} from "@mui/material";
import { Link } from 'react-router-dom';
import Zoom from "react-medium-image-zoom";
import '../../css/index.css'
import {useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import{ apiUrl } from "../../const";
import generateShortId from "ssid";
import {useDispatch, useSelector} from "react-redux";
import {update} from "../../app/message";

const ListActions = () => (
    <TopToolbar>
        <CreateButton />
        <FilterButton />
        <SelectColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <ReferenceInput source="customer_id" reference="customers">
        <AutocompleteInput
            optionText={(choice) =>
                choice?.id // the empty choice is { id: '' }
                    ? `${choice.first_name} ${choice.last_name}`
                    : ''
            }
            sx={{ minWidth: 200 }}
        />
    </ReferenceInput>,
    <DateInput source="date_gte" />,
    <DateInput source="date_lte" />,
    <TextInput source="total_gte" />,
    <NullableBooleanInput source="returned" />,
];

const MaterialList = () => {
    return (
        <List
            hasCreate={true}
            sort={{ field: 'date', order: 'DESC' }}
            perPage={25}
            filters={orderFilters}
            actions={<ListActions />}
        >
            <ImageList />
        </List>
    )};

const times = (nbChildren, fn) =>
    Array.from({ length }, (_, key) => fn(key));

const LoadingGridList = () => (
    <Box display="flex" flexWrap="wrap" width={1008} gap={1}>
        {times(15, key => (
            <Paper
                sx={{
                    height: 200,
                    width: 194,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey[200]',
                }}
                key={key}
            />
        ))}
    </Box>
);

const LoadedGridList = () => {
    const { data, isLoading } = useListContext();
    if (isLoading) return null;
    return (
        <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <MaterialItem />
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export const MaterialItem = (props) => {
    const [elevation, setElevation] = useState(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const createPath = useCreatePath();
    const record = useRecordContext(props);
    if (!record) return null;
    const fetchImgUrl = useCallback(async () => {
        if (record.fileId) {
            const resp = await dataProvider.getImageBuffer('image', { id: record.fileId }, {responseType: 'blob'});
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            setImgUrl(url);
        }
    }, []);

    useEffect(() => {
        fetchImgUrl();
    }, []);



    const handleSupply = (e) => {
        e.preventDefault();
        setOpenDialog(true);
    };
    const handleCloseDialog = (e) => {
        setOpenDialog(false);
    };
    return (
        <MuiLink
            component={Link}
            to={createPath({
                resource: 'material',
                id: record.id,
                type: 'edit'
            })}
            underline="none"
            onMouseEnter={() => setElevation(3)}
            onMouseLeave={() => setElevation(1)}
        >
            <Paper
                sx={{
                    height: '240px',
                    width: '175px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1em',
                }}
                elevation={elevation}
            >
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box textAlign="center">
                        <Typography variant="h6">
                            {record.position}
                        </Typography>
                    </Box>
                </Box>
                {imgUrl ? (
                <Box display="flex" flexDirection="column" alignItems="center" className="material-list-img-display">
                    <img src={imgUrl} alt='img' />
                </Box>
                ) : null}
                <Box display="flex" justifyContent="center" width="100%"  marginTop={1}>
                        <Typography variant="subtitle2" sx={{ mb: -1 }}>
                            {record.detail}
                        </Typography>
                </Box>
                <Button variant="text"
                        mt={2}
                        onClick={handleSupply}>补货申请</Button>
                <SupplyDialog open={openDialog} info={{
                    id: record.id,
                    detail: record.detail,
                    fileId: record.fileId
                }} handleCloseDialog={handleCloseDialog} />
            </Paper>
        </MuiLink>
    );
};

const SupplyDialog = ({ open, info, handleCloseDialog }) => {
    const dispatch = useDispatch();
    const notify = useNotify();
    const [postedBy, setPostedBy] = useState('');

    const { id, detail, fileId } = info;
    const handleClick = (e) => {
        e.preventDefault();
    }
    const handleDialogClose = (e, reason) => {
        console.log(reason)
    }
    const handleDisagree = () => {
        handleCloseDialog();
    }
    const handlePostedBy = (event) => {
        const value = event.target.value;
        setPostedBy(value);
    }
    const handleAgree = async () => {
        const messageId = generateShortId();
        if (!postedBy) {
            notify('请填写提交人员姓名');
            return;
        }
        const res = await dataProvider.create('message', { title: 'supply', postedBy, id: messageId, fileIds: [fileId], detail});
        if (res?.success) {
            dispatch(update());
            handleCloseDialog();
        }
    }
    return (<Dialog open={open} onClick={handleClick} onClose={handleDialogClose} >
        <DialogTitle id="alert-dialog-title">
            确认提交 ({detail}) 的补货申请?
        </DialogTitle>
        <DialogContent>
            {/*提交后申请将被等待确认*/}
            <TextField  onChange={handlePostedBy}
                        label="提交人员" />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDisagree}>取消</Button>
            <Button onClick={handleAgree}>提交</Button>
        </DialogActions>
    </Dialog>)
}

const ImageList = () => {
    const { isLoading } = useListContext();
    return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};




export default MaterialList;

