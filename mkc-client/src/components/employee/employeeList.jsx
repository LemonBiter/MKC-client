import {BooleanField, Datagrid, DateField,TextField, List, useNotify, useRecordContext, useRefresh} from "react-admin";
import {Box, Button, useMediaQuery} from "@mui/material";
import {Fragment, useCallback, useEffect, useState} from "react";
import {dataProvider} from "../../dataProvider";
import * as React from "react";
import ImageViewer from "react-simple-image-viewer";

const EmployeeList = () => {
    return (
        <List title="消息列表">
            <Datagrid>
                <TextField source="name" />
                <TextField source="phone" />
            </Datagrid>
        </List>
    )
}

export default EmployeeList;