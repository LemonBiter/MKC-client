import {Box, Dialog, DialogActions, Button, DialogContent, DialogTitle, Typography} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import multiMonthPlugin from '@fullcalendar/multimonth'
import {Fragment, useCallback, useEffect, useRef, useState} from "react";
import {
    SimpleForm,
    DateInput,
    useTranslate,
    TextInput,
    SaveButton,
    useNotify,
    useRefresh,
    useRedirect, Edit
} from "react-admin";
import * as React from "react";
import generateShortId from "ssid";
import {dataProvider} from "../../dataProvider";

const CalendarShow = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const translate = useTranslate();
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState([]);

    const fetchEvents = useCallback(async () => {
        const res = await dataProvider.getList('event');
        setEvents(res.data);
    }, [])
    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);

    }
    const createButton = {
        text: ` + ${translate(`resources.calendar.create`, {
            smart_count: 2,
        })}`,
        click(event) {
            if (!openCreateDialog) {
                setOpenCreateDialog(true);
            }
        }
    }
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [eventInfo, setEventInfo] = useState(null);
    const handleSubmit = async (value) => {
        value.id = generateShortId();
        if (!value.start) {
            const today = new Date();
            const year = today.getFullYear();
            let month = '' + (today.getMonth() + 1);
            if (month.length < 2) month = '0' + month;
            let date = '' + today.getDate();
            if (date.length < 2) date = '0' + date;
            value.start = `${year}-${month}-${date}`
        }
        const res = await dataProvider.create('event', value);
        if (res.success) {
            notify('创建成功');
            // redirect('/calendar');
            fetchEvents();
        } else {
            notify('创建失败，使用了无效字段');
        }
        if (openCreateDialog) {
            setOpenCreateDialog(false);
        }
    };

    const handleDelete = async (deleteId) => {
        await dataProvider.delete('event', { id: deleteId });
        setOpenInfoDialog(false);
        fetchEvents();
    }
    const handleClose = () => {
        setOpenCreateDialog(false);
    };
    const handleInfoDialogClose = () => {
        setOpenInfoDialog(false);
    };

    const handleEventDrop = useCallback(async (eventInfo) => {
        if (eventInfo) {
            const { event: { startStr, endStr, id }} = eventInfo;
            await dataProvider.update('event', {id, start: startStr, end: endStr })
        }

    }, [eventInfo]);

    const handleEventClick = useCallback((info) => {
            setEventInfo(info.event);
            setOpenInfoDialog(true);
            console.log(info.event);
    }, []);

    // plugins={[ multiMonthPlugin, dayGridPlugin, interactionPlugin ]}
    // initialView="multiMonthYear"
    // multiMonthMaxColumns={1}
    return (
        <Box sx={{
            background: '#ffffff',
            padding: '10px 50px'
        }}>
            <FullCalendar
                plugins={[ multiMonthPlugin, dayGridPlugin, interactionPlugin ]}
                initialView="dayGridMonth"
                multiMonthMaxColumns={1}
                dayMaxEvents={true}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                customButtons={{createButton}}
                headerToolbar={{right: 'createButton dayGridMonth,multiMonthYear prev,next today'}}
                events={events}
                eventDrop={handleEventDrop}
                selectable={true}
                editable={true}
            />
            <CreateDialog
                openCreateDialog={openCreateDialog}
                selectedDate={selectedDate}
                handleClose={handleClose}
                handleSubmit={handleSubmit} />
            <InfoDialog
                eventInfo={eventInfo}
                openInfoDialog={openInfoDialog}
                handleDelete={handleDelete}
                handleInfoDialogClose={handleInfoDialogClose}
                selectedDate={selectedDate}
                handleClose={handleClose}
                handleSubmit={handleSubmit} />
        </Box>
    )
};
const CreateDialog = ({ openCreateDialog, selectedDate, handleClose, handleSubmit }) => {
    return (
        <Dialog
            open={openCreateDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"创建事项"}
            </DialogTitle>
            <DialogContent>
                <SimpleForm onSubmit={handleSubmit}
                            defaultValues={{start: selectedDate}}
                            sx={{width: '450px', padding: '30px'}}
                            toolbar={<Fragment>
                                <SaveButton>确认</SaveButton>
                                <Button onClick={handleClose}>取消</Button>
                            </Fragment>} >
                    <Box>
                        <p>标题：</p>
                        <TextInput required variant="standard" source="title" />
                    </Box>
                    <Box sx={{ width: '80%', display: 'flex', justifyContent: 'space-between'}}>

                        <Box><p>开始日期</p>
                            <DateInput source="start"  />
                        </Box>
                        <Box><p>结束日期</p>
                            <DateInput source="end"  />
                        </Box>
                    </Box>
                    <Box sx={{width: '100%'}}>
                        备注：<TextInput multiple fullWidth variant="standard" source="description"  name='description'/>
                    </Box>
                </SimpleForm>
            </DialogContent>
        </Dialog>
    );
}

const InfoDialog = ({ eventInfo, handleDelete, openInfoDialog, handleInfoDialogClose, handleSubmit }) => {
    return (
        <Dialog
            open={openInfoDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"查看事项"}
            </DialogTitle>
            <DialogContent sx={{width: '450px', padding: '30px'}}>
                <Typography variant="h6" flex="1">
                    标题: {eventInfo?.title}
                </Typography>
                <Typography variant="body1" flex="1">
                    备注: {eventInfo?.extendedProps.description}
                </Typography>
                <Typography variant="subtitle1" flex="1">
                    开始时间: {eventInfo?.startStr}
                </Typography>
                {eventInfo?.endStr ? <Typography variant="subtitle1" flex="1">
                    结束时间: {eventInfo?.endStr}
                </Typography> : null }

            </DialogContent>
            <DialogActions>
                <Button color="error"
                        variant="outlined"
                        onClick={() =>handleDelete(eventInfo?.id)}>
                    删除此事项
                </Button>
                <Button variant="outlined"
                        onClick={handleInfoDialogClose}
                        autoFocus>
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CalendarShow;