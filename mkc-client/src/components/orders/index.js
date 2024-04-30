import ListAltIcon from '@mui/icons-material/ListAlt';
import * as React from 'react';
import OrderList from './OrderList';
import OrderEdit from './OrderEdit';
import OrderCreate from './OrderCreate';
import OrderShow from './OrderShow';

// const OrderList = React.lazy(() => import('./OrderList'));
//
// export default {
//     list: OrderList,
// };

export default {
    list: OrderList,
    show: OrderList,
    edit: OrderEdit,
    create: OrderCreate,
    icon: ListAltIcon,
    recordRepresentation: 'reference',
};
