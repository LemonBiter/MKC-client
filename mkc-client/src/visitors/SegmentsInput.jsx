import * as React from 'react';
import { SelectArrayInput } from 'react-admin';

import segments from '../segments/data';

const SegmentsInput = (props) => (
    <SelectArrayInput
        {...props}
        source="groups"
        translateChoice
        choices={segments}
    />
);

export default SegmentsInput;
