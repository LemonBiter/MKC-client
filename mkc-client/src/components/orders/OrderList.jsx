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
    useListContext, useDataProvider, useTranslate,
} from 'react-admin';
import {useMediaQuery, Divider, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';

import NbItemsField from './NbItemsField';
import CustomerReferenceField from '../../visitors/CustomerReferenceField';
import AddressField from '../../visitors/AddressField';
import MobileGrid from './MobileGrid';
import '../../css/index.css'
import OrderExtend from "./OrderExtend";
const ListActions = () => (
    <TopToolbar>
        <CreateButton />
        <FilterButton />
        <SelectColumnsButton />
        <ExportButton />
    </TopToolbar>
);

const OrderList = (props) => {
    return (
    <List
        hasCreate={true}
        filterDefaultValues={{ status: 'ordered' }}
        sort={{ field: 'date', order: 'DESC' }}
        perPage={25}
        filters={orderFilters}
        actions={<ListActions />}
    >
        <TabbedDatagrid />
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



const TabbedDatagrid = () => {
    const translate = useTranslate();
    const tabs = [
        { id: 'ordered', name: translate('resources.order.tabs.ordered') },
        { id: 'preparing', name: translate('resources.order.tabs.preparing') },
        { id: 'delivered', name: translate('resources.order.tabs.delivered') },
        { id: 'cancelled', name: translate('resources.order.tabs.cancelled') },
    ];
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery(theme =>
        theme.breakpoints.down('sm')
    );
    const handleChange = useCallback(
        (event, value) => {
            setFilters &&
                setFilters(
                    { ...filterValues, status: value },
                    displayedFilters,
                    false // no debounce, we want the filter to fire immediately
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    return (
        <Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            <span>
                                {choice.name} (
                                <Count
                                    filter={{
                                        ...filterValues,
                                        status: choice.name,
                                    }}
                                    sx={{ lineHeight: 'inherit' }}
                                />
                                )
                            </span>
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {isXSmall ? (
                <MobileGrid />
            ) : (
                <>
                    {filterValues.status === 'ordered' && (
                        <DatagridConfigurable
                            expand={OrderExtend}
                            rowClick="expand"
                            sx={{
                                "& .RaDatagrid-row": {
                                },
                            }}
                            size="medium"
                            omit={['total_ex_taxes', 'delivery_fees', 'taxes']}
                        >
                            <TextField className="text-field" source="id" label="reference" />
                            <TextField className="text-field"  source="name" />
                            <TextField className="text-field"  source="address" />
                            <TextField className="text-field"  source="phone" />
                            <DateField className="text-field"  source="published_date" showTime />
                            <EditButton />
                        </DatagridConfigurable>
                    )}
                    {filterValues.status === 'preparing' && (
                        <DatagridConfigurable
                            expand={OrderExtend}
                            rowClick="expand"
                            sx={{
                                "& .RaDatagrid-row": {
                                },
                            }}
                            size="medium"
                            omit={['total_ex_taxes', 'delivery_fees', 'taxes']}
                        >
                            <TextField className="text-field" source="id" label="reference" />
                            <TextField className="text-field"  source="name" />
                            <TextField className="text-field"  source="address" />
                            <TextField className="text-field"  source="phone" />
                            <DateField className="text-field"  source="published_date" showTime />
                            <EditButton />
                        </DatagridConfigurable>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <DatagridConfigurable
                            expand={OrderExtend}
                            rowClick="expand"
                            sx={{
                                "& .RaDatagrid-row": {
                                },
                            }}
                            size="medium"
                            omit={['total_ex_taxes', 'delivery_fees', 'taxes']}
                        >
                            <TextField className="text-field" source="id" label="reference" />
                            <TextField className="text-field"  source="name" />
                            <TextField className="text-field"  source="address" />
                            <TextField className="text-field"  source="phone" />
                            <DateField className="text-field"  source="published_date" showTime />
                            <EditButton />
                        </DatagridConfigurable>
                    )}
                </>
            )}
        </Fragment>
    );
};

export default OrderList;

