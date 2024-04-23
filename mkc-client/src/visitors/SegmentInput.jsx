import * as React from 'react';
import { SelectInput } from 'react-admin';

import segments from '../segments/data';

const SegmentInput = (props) => (
    <SelectInput
        {...props}
        source="groups"
        translateChoice
        choices={segments}
    />
);

export default SegmentInput;
