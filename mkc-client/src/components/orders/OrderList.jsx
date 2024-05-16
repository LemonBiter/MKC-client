import * as React from 'react';
import {Fragment, useCallback, useEffect, useState} from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Count, Datagrid,
    DatagridConfigurable,
    DateField,
    DateInput, EditButton,
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    NullableBooleanInput,
    NumberField,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    SelectColumnsButton,
    TextField,
    TextInput,
    TopToolbar,
    useListContext, useDataProvider, useTranslate, useGetIdentity,
} from 'react-admin';
import {
    useMediaQuery,
    Button,
    Divider,
    Tabs,
    Tab,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box
} from '@mui/material';

import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../../visitors/CustomerReferenceField';
import AddressField from '../../visitors/AddressField';
import MobileGrid from './MobileGrid';
import '../../css/index.css'
import OrderExtend from "./OrderExtend";
import {OrderListContent} from "./OrderListContent";
import OrderShow from "./OrderShow";
import {useLocation} from "react-router";
import {matchPath} from "react-router-dom";
import OrderEdit from "./OrderEdit";
import OrderDatagrid from "./OrderDatagrid";
const ListActions = ({showList}) => (
    <TopToolbar sx={{ display: 'flex', alignItems: 'center'}}>
        <CreateButton
            variant="contained"
            label="创建订单"
            sx={{ height: '40px'}}
        />
        <Button onClick={showList}>列表展示</Button>
        <FilterButton />
        {/*<SelectColumnsButton />*/}
        <ExportButton />
    </TopToolbar>
);

const OrderList = (props) => {
    const { identity } = useGetIdentity();
    const location = useLocation();
    const matchCreate = matchPath('/order/create', location.pathname);
    const matchShow = matchPath('/order/:id/show', location.pathname);
    const matchEdit = matchPath('/order/:id/edit', location.pathname);
    const [listType, setListType] = useState('card');
    const showList = () => {
        if (listType === 'list') {
            setListType('card');
        } else {
            setListType('list');
        }
    }
    return (
        <>
            <List
                perPage={100}
                sort={{ field: 'index', order: 'ASC' }}
                filters={orderFilters}
                filterDefaultValues={{ sales_id: identity && identity?.id }}
                actions={<ListActions showList={showList} />}
                pagination={false}
                component="div"
            >
                {listType === 'card' ? <OrderListContent /> : <OrderDatagrid />}
            </List>
            <OrderShow open={!!matchShow} id={matchShow?.params.id} />
            {/*<OrderEdit open={!!matchEdit} id={matchEdit?.params.id} />*/}
        </>
)};

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <TextInput source="order_item" label="板材配件" />,
    // <ReferenceInput source="customer_id" reference="customers">
    //     <AutocompleteInput
    //         optionText={(choice) =>
    //             choice?.id // the empty choice is { id: '' }
    //                 ? `${choice.first_name} ${choice.last_name}`
    //                 : ''
    //         }
    //         sx={{ minWidth: 200 }}
    //     />
    // </ReferenceInput>,
    // <DateInput source="date_gte" />,
    // <DateInput source="date_lte" />,
    // <TextInput source="total_gte" />,
    // <NullableBooleanInput source="returned" />,
];

export default OrderList;

