import {Datagrid, DateField, TextField, useRecordContext} from "react-admin";
import {Fragment} from "react";
import {Box} from "@mui/material";
const OrderDatagrid = () => {
    return (
        <Datagrid sx={{
            "& .RaDatagrid-rowCell": {
                // backgroundColor: "#fee",
                padding: '20px',
            },
            "& .RaDatagrid-headerCell": {
                    // backgroundColor: "#fee",
                    padding: '20px',
                },
        }}>
            {/*<OrderItem />*/}
             <TextField source="name" />
             <TextField source="phone" />
             <TextField source="address" />
             {/*<TextField source="email" />*/}
             <DateField source="published_date" />
             {/*<TextField source="stage" />*/}
             <StageField label='stage' />
            {/*<h1>ha</h1>*/}
        </Datagrid>
    )
}

const StageField = () => {
    const record = useRecordContext();
    const obj = {
        ordered: '#ff9a9e',
        preparing: '#fee140',
        delivered: '#a1c4fd',
        assembling: '#1abc9c',
        ending: '#FFA500',
        completed: '#bdc3c7',
    }
    return (<Box display='flex' alignItems="center">
        <div style={{
            width: '15px',
            height: '15px',
            marginRight: '10px',
            borderRadius: '50%',
            background: obj[record.stage],
        }}></div>
        <span style={{
            width: '80px',
            textAlign: 'left',
        }}>
            {record.stage}
        </span>

    </Box>)
}

// const OrderItem = () => {
//     const { name, email, address, phone, published_date, stage } = useRecordContext();
//
//     return (
//
//         // <tbody>
//         // <tr>
//         //     <td>
//         //         姓名
//         //     </td>
//         //     <td>
//         //         电话
//         //     </td>
//         //     <td>
//         //         地址
//         //     </td>
//         //     <td>
//         //         下单时间
//         //     </td>
//         //     <td>
//         //         状态
//         //     </td>
//         // </tr>
//         // </tbody>
//         // <Box sx={{
//         //     padding: '20px 0',
//         //     display: 'flex',
//         //     justifyContent: 'flex-start'
//         // }}>
//         //     <Box sx={{
//         //         display: 'flex',
//         //         flexDirection: 'column'
//         //     }}>
//         //         <TextField source="name" />
//         //         <TextField source="phone" />
//         //         <TextField source="email" />
//         //     </Box>
//         //
//         //
//         //     <TextField source="address" />
//
//     )
// }

export default OrderDatagrid;