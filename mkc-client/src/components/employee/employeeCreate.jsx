import {Create, Datagrid, SimpleForm, TextField, TextInput, useRedirect} from "react-admin";
import * as React from "react";
import {Typography} from "@mui/material";

const EmployeeCreate =() => {
    const redirect = useRedirect();
    const onSuccess = () => {
        redirect('/employee');
    }
    return (
        <Create title="创建员工" mutationOptions={{onSuccess}}>
            <SimpleForm>
                <Typography variant="h6" gutterBottom>
                    姓名
                </Typography>
                <TextInput required source='name' label="员工姓名" />
                <Typography variant="h6" gutterBottom>
                    电话
                </Typography>
                <TextInput required source='phone' label="联系方式" />
            </SimpleForm>
        </Create>
    )
}

export default EmployeeCreate;