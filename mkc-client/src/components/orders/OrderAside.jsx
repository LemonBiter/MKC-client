import {Box, Card, Divider, Grid, Typography, Dialog, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import { calculateCount } from '../utils';
const OrderAside = ({roomInfo}) => {
    // const roomInfo = useSelector((state) => state.order.value)
    const { mArr, aArr } = calculateCount(roomInfo);
    console.log(mArr);
    console.log(aArr);

    if (!mArr.length && !aArr.length) {
        return null;
    }
    return (
    <Box sx={{
        width: '25%',
        position: 'fixed',
        maxHeight: '70%',
        height: 'auto',
        overflow: 'scroll',
        right: '1%',
        top: '20%',
        // border: '1px solid black',
        padding: '10px 20px',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        margin: '1em' }}>
        <Typography variant="h5">板材配件数量统计</Typography>
        <Divider sx={{marginBottom: '10px'}} />
        {mArr.map((each, index) => (
            <Box key={index} marginBottom={2}>
                <Typography variant="h6" sx={{whitespace: 'normal', wordBreak: 'break-all'}}>
                    {each.label}({each.total})
                </Typography>
                {each.position ? <Typography variant="body1">
                    存放: {each.position}
                </Typography> : null}
                <Typography variant="body2" color="textSecondary">
                    {each.text}
                </Typography>
            </Box>
        ))}
        <Divider sx={{marginBottom: '10px'}}>配件</Divider>
        {aArr.map((each, index) => (
            <Box key={index} marginBottom={2}>
                <Typography variant="h6" sx={{whitespace: 'normal', wordBreak: 'break-all'}}>
                    {each.label}({each.total})
                </Typography>
                {each.position ? <Typography variant="body1">
                    存放: {each.position}
                </Typography> : null}
                <Typography variant="body2" color="textSecondary">
                    {each.text}
                </Typography>
            </Box>
        ))}
    </Box>
)};



export default OrderAside;