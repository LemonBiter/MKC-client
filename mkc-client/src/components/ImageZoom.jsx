import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useRecordContext, useTranslate } from 'ra-core';

import Zmage from 'react-zmage';
export const ImageField = (props) => {
    const { className, emptyText, source, src, title, ...rest } = props;
    const record = useRecordContext(props);
    const sourceValue = get(record, source);
    const translate = useTranslate();

    if (!sourceValue) {
        return  (
            <Typography
                component="span"
                variant="body2"
                className={className}
            >
                {emptyText && translate(emptyText, { _: emptyText })}
            </Typography>
        )
    }

    if (Array.isArray(sourceValue)) {
        return (
            <Root className={className}>
                <ul className={ImageFieldClasses.list}>
                    {sourceValue.map((file, index) => {
                        const fileTitleValue = get(file, title) || title;
                        const srcValue = get(file, src) || title;

                        return (
                            <li key={index}>
                                <Zmage
                                    alt={fileTitleValue}
                                    title={fileTitleValue}
                                    src={srcValue}
                                    className={ImageFieldClasses.image}
                                />
                            </li>
                        );
                    })}
                </ul>
            </Root>
        );
    }

    const titleValue = get(record, title)?.toString() || title;

    return (
        <Root className={className}>
            <img
                title={titleValue}
                alt={titleValue}
                src={sourceValue?.toString()}
                className={ImageFieldClasses.image}
            />
        </Root>
    );
};

// What? TypeScript loses the displayName if we don't set it explicitly
ImageField.displayName = 'ImageField';

ImageField.propTypes = {
    src: PropTypes.string,
    title: PropTypes.string,
};

const PREFIX = 'RaImageField';

export const ImageFieldClasses = {
    list: `${PREFIX}-list`,
    image: `${PREFIX}-image`,
};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`& .${ImageFieldClasses.list}`]: {
        display: 'flex',
        listStyleType: 'none',
    },
    [`& .${ImageFieldClasses.image}`]: {
        margin: '0.25rem',
        width: 200,
        height: 100,
        objectFit: 'contain',
    },
});
