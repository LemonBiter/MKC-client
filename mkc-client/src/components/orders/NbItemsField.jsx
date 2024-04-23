import * as React from 'react';
import { FunctionField } from 'react-admin';

const NbItemsField = () => (
    <FunctionField render={record => record.basket.length} />
);

export default NbItemsField;
