import * as React from 'react';
import {
    AutocompleteInput,
    Datagrid,
    DatagridConfigurable,
    DateField,
    DateInput, EditButton,
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    NullableBooleanInput,
    ReferenceInput,
    SearchInput,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
    useListContext, useTranslate, ImageField, RecordContextProvider, useCreatePath, useRecordContext, SelectField,
} from 'react-admin';
import 'react-medium-image-zoom/dist/styles.css'
import {Box, Paper, Typography,  Link as MuiLink } from "@mui/material";
import { Link } from 'react-router-dom';
import Zoom from "react-medium-image-zoom";
import '../../css/index.css'
import {useState} from "react";

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

const MaterialList = (props) => {
    const [imgSrc, setImgSrc] = useState('');
    return (
        <List
            hasCreate={true}
            sort={{ field: 'date', order: 'DESC' }}
            perPage={25}
            filters={orderFilters}
            actions={<ListActions />}
        >
            <ImageList />
            {/*<DatagridConfigurable*/}
            {/*    className="list-header"*/}
            {/*    size="medium"*/}
            {/*>*/}
            {/*    <TextField className="text-field" source="index" label="Index" />*/}
            {/*    <Box className="image-box" label='image'>*/}
            {/*        <Zoom>*/}
            {/*            <ImageField*/}
            {/*                source="base64" />*/}
            {/*        </Zoom>*/}
            {/*    </Box>*/}
            {/*    <TextField className="text-field" source="detail" label="detail" />*/}
            {/*    <EditButton />*/}
            {/*</DatagridConfigurable>*/}
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
    const createPath = useCreatePath();
    const record = useRecordContext(props);
    if (!record) return null;
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
                    width: 195,
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
                {record?.base64 ? (
                <Box display="flex" flexDirection="column" alignItems="center" className="material-list-img-display">
                    <img src={record.base64} alt='img' />
                </Box>
                ) : null}
                <Box display="flex" justifyContent="center" width="100%"  marginTop={1}>
                        <Typography variant="subtitle2" sx={{ mb: -1 }}>
                            {record.detail}
                        </Typography>
                </Box>
            </Paper>
        </MuiLink>
    );
};

const ImageList = () => {
    const { isLoading } = useListContext();
    return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};




export default MaterialList;

