import { Droppable } from '@hello-pangea/dnd';
import { Box, Typography } from '@mui/material';
import {useTranslate} from "react-admin";
import { OrderCard } from "./OrderCard";
// import { stageNames } from './stages';

export const OrderColumn = ({
    stage,
    order,
}) => {
    const translate = useTranslate();
    const title = translate(`resources.order.tabs.${stage}`);
    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(e.target.value);
    }
    return (
    <Box
        sx={{
            flex: 1,
            paddingTop: '8px',
            paddingBottom: '16px',
            bgcolor: '#eaeaee',
            '&:first-child': {
                paddingLeft: '5px',
                borderTopLeftRadius: 5,
            },
            '&:last-child': {
                paddingRight: '5px',
                borderTopRightRadius: 5,
            },
        }}
    >
        <Typography align="center" variant="subtitle1">
            {title}
        </Typography>
        <Droppable droppableId={stage}>
            {(droppableProvided, snapshot) => (
                <Box
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    className={snapshot.isDraggingOver ? ' isDraggingOver' : ''}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 5,
                        padding: '5px',
                        '&.isDraggingOver': {
                            bgcolor: '#dadadf',
                        },
                    }}
                >
                    {order.map((o, index) => (
                        <OrderCard className="order-card" key={o.id} order={o} index={index} />
                    ))}
                    {droppableProvided.placeholder}
                </Box>
            )}
        </Droppable>
    </Box>
)};
