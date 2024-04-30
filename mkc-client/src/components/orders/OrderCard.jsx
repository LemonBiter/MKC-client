import * as React from 'react';
import {ShowButton, ReferenceField, useRedirect, Datagrid, EditButton, Show} from 'react-admin';
import {Box, Button, Card, Typography} from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';

export const OrderCard = ({ order, index }) => {
    const stage = order?.stage || 'ordered';
    const redirect = useRedirect();
    if (!order) return null;
    const handleOrderShow = (e) => {
        e.stopPropagation();
        e.preventDefault();
        redirect(`/order/${order.id}/show`);

    };
    const handleOrderEdit = (e) => {
        e.stopPropagation();
        redirect(`/order/${order.id}/edit`);
    }

    return (
        <Draggable draggableId={String(order.id)} index={index}>
            {(provided, snapshot) => (
                <Box
                    sx={{ marginBottom: 1 }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={handleOrderShow}
                >
                        <Card
                            style={{
                                position: "relative",
                                opacity: snapshot.isDragging ? 0.9 : 1,
                                transform: snapshot.isDragging
                                    ? 'rotate(-2deg)'
                                    : '',
                            }}
                            elevation={snapshot.isDragging ? 3 : 1}
                        >
                                <Box padding={1} display="flex">
                                    <ReferenceField
                                        source="company_id"
                                        record={order}
                                        reference="companies"
                                    >
                                    </ReferenceField>
                                    <Box sx={{ marginLeft: 1 }}>
                                        <Typography variant="body2" gutterBottom>
                                            {order.name}
                                        </Typography>
                                        <Box className={"stage-ball " + stage}></Box>
                                        <Typography variant="body2" gutterBottom>
                                            {order.phone}
                                        </Typography>
                                        <ShowButton />
                                        <Typography variant="subtitle2"
                                            // color="textSecondary"
                                        >
                                             {order.address}
                                        </Typography>
                                        <Typography variant="caption"
                                                    color="textSecondary"
                                                    gutterBottom>
                                            {new Date(order.published_date).toLocaleString()}
                                        </Typography>
                                    </Box>


                                </Box>
                                <Button sx={{float: 'right'}}
                                         onClick={handleOrderEdit}>
                                    Edit</Button>
                        </Card>
                </Box>
            )}
        </Draggable>
    );
};

const CommentEditButton = () => <EditButton label="Edit comment" />;