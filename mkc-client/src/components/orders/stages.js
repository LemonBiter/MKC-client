
export const stages = ['ordered', 'preparing', 'delivered', 'assembling', 'ending', 'completed']


export const stageNames = {
    ordered: 'ordered',
    'preparing-sent': 'Proposal Sent',
    'in-negociation': 'In Negociation',
    won: 'Won',
    lost: 'Lost',
    delayed: 'Delayed',
};

export const stageChoices = stages.map(type => ({
    id: type,
    /* @ts-ignore */
    name: type,
}));

export const getDealsByStage = (unorderedDeals) => {

    const dealsByStage = unorderedDeals.reduce(
        (acc, deal) => {
            acc[deal.stage].push(deal);
            return acc;
        },
        stages.reduce(
            (obj, stage) => ({ ...obj, [stage]: [] }),
            {}
        )
    );
    // order each column by index
    stages.forEach(stage => {
        dealsByStage[stage] = dealsByStage[stage].sort(
            (recordA, recordB) => recordA.index - recordB.index
        );
    });
    return dealsByStage;
};
