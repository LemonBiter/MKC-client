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