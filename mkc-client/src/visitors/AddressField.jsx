import * as React from 'react';
import { useRecordContext } from 'react-admin';

const AddressField = () => {
    const record = useRecordContext();

    return record ? (
        <span>
            {record.address}, {record.city}, {record.stateAbbr} {record.zipcode}
        </span>
    ) : null;
};

export default AddressField;
