import * as React from 'react';
import { Stack, Chip } from '@mui/material';
import { useTranslate, useRecordContext } from 'react-admin';
import segments from '../segments/data';

const segmentsById = segments.reduce((acc, segment) => {
    acc[segment.id] = segment;
    return acc;
}, {});

const SegmentsField = (_) => {
    const translate = useTranslate();
    const record = useRecordContext();
    if (!record || !record.groups) {
        return null;
    }
    return (
        <Stack direction="row" gap={1} flexWrap="wrap">
            {record.groups.map(segmentId => (
                <Chip
                    size="small"
                    key={segmentId}
                    label={translate(segmentsById[segmentId].name)}
                />
            ))}
        </Stack>
    );
};

export default SegmentsField;
