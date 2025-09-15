import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import type { ITimelineItem } from '../pages/TimelineItemsPage';
import { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { AuthContext } from '../context/auth.context';
import ImageUploader from './ImageUploader';
import CloudinaryImageUploader from './CloudinaryImageUploader';


const FormGrid = styled(Grid)(() => ({
    display: 'flex',
    flexDirection: 'column',
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export type FormType = "edit" | "create" | null; //union

// discriminated union
type ItemFormProps =
  | { formType: "create"; timelineId: string; item?: never }
  | { formType: "edit"; item: ITimelineItem; timelineId: string };

export default function ItemForm(props: ItemFormProps) {
    const authContext = useContext(AuthContext)

    if (!authContext) {
        throw new Error('Item creation must be done within an AuthWrapper')
    }
    const { loggedUserId } = authContext

    const defaultFormData = {
    creator: loggedUserId,
    kind: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    images: [],
    impact: "",
    tags: [],
    isApproved: true,
    comments: [],
    };

    // const editFormData = {
    // _id: item._id,
    // timeline: item.timeline,
    // creator: item.creator,
    // kind: item.kind,
    // title: item.title,
    // description: item.description,
    // startDate: item.startDate,
    // endDate: item.endDate,
    // images: item.images,
    // impact: item.impact,
    // tags: item.tags,
    // isApproved: item.isApproved,
    // comments: item.comments,
    // createdAt: item.createdAt,
    // updatedAt: item.updatedAt,
    // };

    const [formData, setFormData] = useState(
    props.formType === "edit" && props.item
        ? { ...props.item }
        : { ...defaultFormData, timeline: props.timelineId }
    );

    const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
    const [allDayEvent, setAllDayEvent] = useState(formData.startDate === formData.endDate);

    return (
        <main className='m-5'>
            <Typography gutterBottom variant="h4" component="div">
                {props.formType === "create"? "Add a new item" : "Edit item"} 
            </Typography>
            <Grid container spacing={3}>
                <FormGrid size={{ xs: 12, md: 6 }}>
                    <FormLabel htmlFor="first-name" required>
                        Item title
                    </FormLabel>
                    <OutlinedInput
                        id="title"
                        name="title"
                        type="name"
                        placeholder="Title"
                        autoComplete="first name"
                        required
                        size="small"
                        value={formData.title}
                    />
                </FormGrid>

                <FormGrid size={{ xs: 12 }}>
                    <FormLabel htmlFor="description" required>
                        Description
                    </FormLabel>
                    <OutlinedInput
                        id="description"
                        name="description"
                        type="description"
                        placeholder="Item description"
                        autoComplete="shipping address-line1"
                        required
                        size="small"
                        value={formData.description}
                        multiline
                    />
                </FormGrid>
                <FormGrid>
                    <FormLabel htmlFor="start-date" required>
                        Start Date
                    </FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            // label="Start date"
                            value={formData.startDate ? dayjs(formData.startDate) : null}
                            onChange={(newValue) => setDateValue(newValue)}
                            slotProps={{ textField: { fullWidth: true, id: 'start-date' } }}
                        />
                    </LocalizationProvider>
                    <FormControlLabel control={<Checkbox
                        checked={allDayEvent}
                        onChange={(event, checked) => setAllDayEvent(checked)}
                    // sx={allDayEvent ? { display: "inline-block" } : { display: "none" }}
                    />}
                        label="One day event"
                    />
                </FormGrid>
                {
                    !allDayEvent &&
                    <FormGrid>
                        <FormLabel htmlFor="end-date" required>
                            End Date
                        </FormLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                // label="End date"
                                value={formData.endDate ? dayjs(formData.endDate) : null}
                                onChange={(newValue) => setDateValue(newValue)}
                                slotProps={{ textField: { fullWidth: true, id:'end-date'} }}
                            />
                        </LocalizationProvider>
                    </FormGrid>
                }

                {/* <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: { xs: 2, sm: 5, md: 10 },
                    }}
                >
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<PhotoCamera />}
                    >
                        Upload cover picture
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => console.log(event.target.files)}
                            multiple
                        />
                    </Button>
                </Box> */}
                {/* <ImageUploader /> */}
                <CloudinaryImageUploader />

                {/* <FormGrid >
                    <TextField
                        
                        required
                        multiline
                        id="outlined-required"
                        label="Moment title"
                        defaultValue="Hello World"
                        value={formData.description}
                    />
                </FormGrid> */}

            </Grid>
{/* 
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: { xs: 2, sm: 5, md: 10 },
                }}
            >
                <Button variant="contained" type="submit" size='medium'>
                    Save changes
                </Button>
            </Box> */}
        </main>
    );
}
