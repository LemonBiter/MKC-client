import * as React from 'react';
import { Avatar } from '@mui/material';
import { useRecordContext } from 'react-admin';

const AvatarField = ({ size = '25', sx }) => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        <Avatar
            src={`${record.avatar}?size=${size}x${size}`}
            style={{ width: parseInt(size, 10), height: parseInt(size, 10) }}
            sx={sx}
            alt={`${record.first_name} ${record.last_name}`}
        />
    );
};

export default AvatarField;
