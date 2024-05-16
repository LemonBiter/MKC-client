export const calculateCount = (roomInfo) => {
    const mObj = {};
    const aObj = {};
    for (let room in roomInfo) {
        for (let id in roomInfo[room].material) {
            if (!mObj?.[id]) {
                mObj[id] = {total: 0, text: '', label: '', position: ''};
            }
            mObj[id].label = roomInfo[room].material[id]?.label;
            mObj[id].total += parseInt(roomInfo[room].material[id]?.count);
            if (room && roomInfo[room].material[id]?.count) {
                mObj[id].text = mObj[id].text + (mObj[id].text ? ',' : '') + `${room}(${roomInfo[room].material[id]?.count})`
            }
            mObj[id].position = roomInfo[room].material[id]?.position || '';
        }
        for (let id in roomInfo[room].accessory) {
            if (!aObj?.[id]) {
                aObj[id] = {total: 0, text: '', label: '', position: ''};
            }
            aObj[id].label = roomInfo[room].accessory[id]?.label;
            aObj[id].total += parseInt(roomInfo[room].accessory[id]?.count);
            if (room && roomInfo[room].accessory[id]?.count) {
                aObj[id].text = aObj[id].text + (aObj[id].text ? ',' : '') + `${room}(${roomInfo[room].accessory[id]?.count})`
            }
            aObj[id].position = roomInfo[room].accessory[id]?.position || '';
        }
    }
    return { mArr: Object.values(mObj), aArr: Object.values(aObj) };
}

export const parseOrderDataToCSV = (data) => {
    delete data?.index;

    // const transformDataForVerticalCSV = (initData) => {
    //     const initDataArr = [initData];
    //     const keys = Object.keys(initDataArr[0]); // 获取键名作为标题
    //     console.log(keys);
    //     const transformedData = keys.map(key => ({
    //         property: key,
    //         ...initDataArr.reduce((acc, cur, index) => ({ ...acc, [`value${index + 1}`]: cur[key] }), {})
    //     }));
    //     return transformedData;
    // };
    //
    // const verticalData = transformDataForVerticalCSV(data);
    //
    // console.log(verticalData);
    // name, phone, email, address, stage, roomInfo, additional, id
    // let roomInfoExist = false;
    // let additionalExist = false;

    // const titles = [];
    // const values = [];
    // for(let i in data) {
    //     if (i === 'published_date') {
    //         data[i] = new Date(data[i]).toLocaleString();
    //     }
    //     if (i === 'roomInfo') {
    //         if (Object.values(data['roomInfo'])?.length) {
    //             roomInfoExist = true;
    //         }
    //         continue;
    //     }
    //     if (i === 'additional') {
    //         if (Object.values(data['additional'])?.length) {
    //             additionalExist = true;
    //         }
    //         continue;
    //     }
    //     titles.push(i);
    //     values.push(data[i]);
    // }
    // if (additionalExist) {
    //     const notes = data['additional'];
    //     console.log(notes);
    //     let index = 1;
    //     notes.forEach(({ type, value }) => {
    //         if (type === 'text') {
    //             titles.push('备注信息-' + (index++));
    //             values.push(value);
    //         }
    //     })
    // }
    // if (roomInfoExist) {
    //     const roomInfoData = data['roomInfo'];
    // }
    // finalArray.push(titles)
    // finalArray.push(values)
    const finalArray = [data];
    return finalArray;
}