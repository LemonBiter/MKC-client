import * as React from 'react';
import {
    AutocompleteInput,
    Count, Datagrid,
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
    useListContext, useTranslate, ImageField,
} from 'react-admin';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import '../../css/index.css'
import {useState} from "react";
import {Box} from "@mui/material";
const ListActions = () => (
    <TopToolbar>
        <CreateButton />
        <FilterButton />
        <SelectColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const AccessoryList = (props) => {
    const [imgSrc, setImgSrc] = useState('');
    return (
        <List
            hasCreate={true}
            sort={{ field: 'date', order: 'DESC' }}
            perPage={25}
            filters={orderFilters}
            actions={<ListActions />}
        >
            <DatagridConfigurable
                className="list-header"
                size="medium"
            >
                <TextField className="text-field" source="index" label="Index" />
                <Box className="image-box" label='image'>
                    <Zoom>
                        <ImageField
                            source="base64" />
                    </Zoom>
                </Box>
                <TextField className="text-field" source="detail" label="detail" />
                <EditButton />
            </DatagridConfigurable>
        </List>
    )};

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




export default AccessoryList;

