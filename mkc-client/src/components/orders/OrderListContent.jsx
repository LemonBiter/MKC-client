import { DragDropContext } from '@hello-pangea/dnd';
import {Box, useMediaQuery} from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import {useListContext, useTranslate} from "react-admin";
import {OrderColumn} from "./OrderColumn";
import { getDealsByStage, stages } from './stages';
import {dataProvider} from "../../dataProvider";

export const OrderListContent = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const { data: unorderedData, isLoading, refetch } = useListContext();
    const [dealsByStage, setDealsByStage] = useState(
        getDealsByStage([])
    );

    useEffect(() => {
        if (unorderedData) {
            const newDealsByStage = getDealsByStage(unorderedData);
            if (!isEqual(newDealsByStage, dealsByStage)) {
                setDealsByStage(newDealsByStage);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unorderedData]);
    //
    if (isLoading) return null;

    const onDragEnd = result => {
        const { destination, source } = result;
        if (!destination) {
            return;
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;
        const sourceDeal = dealsByStage[sourceStage][source.index];
        const destinationDeal = dealsByStage[destinationStage][
            destination.index
            ] ?? {
            stage: destinationStage,
            index: undefined, // undefined if dropped after the last item
        };
        // compute local state change synchronously
        setDealsByStage(
            updateDealStageLocal(
                sourceDeal,
                { stage: sourceStage, index: source.index },
                { stage: destinationStage, index: destination.index },
                dealsByStage
            )
        );
        //
        // // persist the changes
        updateDealStage(sourceDeal, destinationDeal).then(() => {
            refetch();
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box display="flex" sx={{
                flexDirection: isSmall ? 'column' : 'row'}}>
            {stages.map((stage, index) => (
                <OrderColumn
                    stage={stage}
                    order={dealsByStage[stage]}
                    key={index}
                />
            ))}
            </Box>
        </DragDropContext>
    );
};

const updateDealStageLocal = (
    sourceDeal,
    source,
    destination,
    dealsByStage
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        const column = dealsByStage[source.stage];
        column.splice(source.index, 1);
        column.splice(destination.index ?? column.length + 1, 0, sourceDeal);
        return {
            ...dealsByStage,
            [destination.stage]: column,
        };
    } else {
        // moving deal across columns
        const sourceColumn = dealsByStage[source.stage];
        const destinationColumn = dealsByStage[destination.stage];
        sourceColumn.splice(source.index, 1);
        destinationColumn.splice(
            destination.index ?? destinationColumn.length + 1,
            0,
            sourceDeal
        );
        return {
            ...dealsByStage,
            [source.stage]: sourceColumn,
            [destination.stage]: destinationColumn,
        };
    }
};

const updateDealStage = async (
    source,
    destination,
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        // Fetch all the deals in this stage (because the list may be filtered, but we need to update even non-filtered deals)
        const { data: columnDeals } = await dataProvider.getList('order', {
            sort: { field: 'index', order: 'ASC' },
            pagination: { page: 1, perPage: 100 },
            filter: { stage: source.stage },
        });
        const destinationIndex = destination.index ?? columnDeals.length + 1;

        if (source.index > destinationIndex) {
            // deal moved up, eg
            // dest   src
            //  <------
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between destinationIndex and source.index, increase the index
                ...columnDeals
                    .filter(
                        deal =>
                            deal.index >= destinationIndex &&
                            deal.index < source.index
                    )
                    .map(deal =>
                        dataProvider.update('order', {
                            id: deal.id,
                            data: { index: deal.index + 1 },
                            previousData: deal,
                        }, '?from=update_position')
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('order', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }, '?from=update_position'),
            ]);
        } else {
            // deal moved down, e.g
            // src   dest
            //  ------>
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between source.index and destinationIndex, decrease the index
                ...columnDeals
                    .filter(
                        deal =>
                            deal.index <= destinationIndex &&
                            deal.index > source.index
                    )
                    .map(deal =>
                        dataProvider.update('order', {
                            id: deal.id,
                            data: { index: deal.index - 1 },
                            previousData: deal,
                        }, '?from=update_position')
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('order', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }, '?from=update_position'),
            ]);
        }
    } else {
        // moving deal across columns
        // Fetch all the deals in both stages (because the list may be filtered, but we need to update even non-filtered deals)
        const [
            { data: sourceDeals },
            { data: destinationDeals },
        ] = await Promise.all([
            dataProvider.getList('order', {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: source.stage },
            }),
            dataProvider.getList('order', {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: destination.stage },
            }),
        ]);
        const destinationIndex =
            destination.index ?? destinationDeals.length + 1;
        await Promise.all([
            // decrease index on the deals after the source index in the source columns
            ...sourceDeals
                .filter(deal => deal.index > source.index)
                .map(deal =>
                    dataProvider.update('order', {
                        id: deal.id,
                        data: { index: deal.index - 1 },
                        previousData: deal,
                    }, '?from=update_position')
                ),
            // increase index on the deals after the destination index in the destination columns
            ...destinationDeals
                .filter(deal => deal.index >= destinationIndex)
                .map(deal =>
                    dataProvider.update('order', {
                        id: deal.id,
                        data: { index: deal.index + 1 },
                        previousData: deal,
                    }, '?from=update_position')
                ),
            // change the dragged deal to take the destination index and column
            dataProvider.update('order', {
                id: source.id,
                data: {
                    index: destinationIndex,
                    stage: destination.stage,
                },
                previousData: source,
            }, '?from=update_position'),
        ]);
    }
};
