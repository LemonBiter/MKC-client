import * as React from 'react';
import { Link, useRecordContext } from 'react-admin';

import FullNameField from './FullNameField';

const CustomerLinkField = (_) => {
    const record = useRecordContext();
    if (!record) {
        return null;
    }
    return (
        <Link to={`/customers/${record.id}`}>
            <FullNameField />
        </Link>
    );
};

export default CustomerLinkField;
