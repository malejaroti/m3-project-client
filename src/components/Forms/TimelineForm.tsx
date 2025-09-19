import Typography from "@mui/material/Typography"
import { FormContainer, FormHeader } from "./FormSubcomponents/FormStyledSubcomponents"
import type { ITimeline, TimelineCreatePayload } from "../../pages/TimelinesPage"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { responsiveStyles } from "../../shared-theme/themePrimitives"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/auth.context"
import api from "../../services/config.services"
import Alert from '@mui/material/Alert';
import FormHelperText from "@mui/material/FormHelperText"
// Removed unused MUI inputs

type TimelineFormProps =
    | {
        formType: "create";
        timeline?: never;
        onSuccess: () => void;
        onCancel: () => void;
        onRefresh: () => void
    }
    | {
        formType: "edit";
        timeline: ITimeline
        onSuccess: () => void;
        onCancel: () => void;
        onRefresh: () => void
    }

function TimelineForm(props: TimelineFormProps) {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('Timeline creation must be done within an AuthWrapper');
    }
    const { loggedUserId } = authContext;

    const newTimelineData: TimelineCreatePayload = {
        owner: loggedUserId !== null ? loggedUserId : '',
        title: '',
        description: '',
        icon: '',
        collaborators: [],
        isPublic: false,
        color: "gray"
    };

    // In create mode, formData matches TimelineCreatePayload (ids only)
    // In edit mode, we keep the populated ITimeline in state but only edit common fields
    const [formData, setFormData] = useState<TimelineCreatePayload | ITimeline>(
        props.formType === "create" ? { ...newTimelineData } : { ...props.timeline }
    );
    const [errorMessageServer, setErrorMessageServer] = useState<string>("");
    const [helperTextTitleInput, setHelperTextTitleInput] = useState<string | null>(null);
    // const navigate = useNavigate(); // navigation not used within this form currently

    const handleFormDataChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTimelineUpdate = async (event: React.FormEvent) => {
        event.preventDefault();
        // Build a minimal update object using fields editable in this form
        const updatedTimeline: Partial<Pick<ITimeline, 'title' | 'description' | 'icon' | 'isPublic' | 'color'>> = {
            title: (formData as ITimeline).title,
            description: (formData as ITimeline).description,
            icon: (formData as ITimeline).icon,
            isPublic: (formData as ITimeline).isPublic,
            color: (formData as ITimeline).color,
        };
        console.log('Updates for timeline: ', updatedTimeline);

        try {
            const response = await api.put(`/timelines/${props.timeline?._id}`, updatedTimeline);
            console.log('Res PUT updated timeline: ', response);

            // Call the success callbacks
            props.onRefresh(); // Refresh the timelines
            props.onSuccess(); // Close the drawer
        } catch (error: any) {
            if (error.response?.status === 400) {
                console.log('Error', error);
                console.log('Server says: Bad request:', error.response.data.errorMessage);
                setErrorMessageServer(error.response.data.errorMessage)
                // Handle validation error - could show user-friendly message
            } else {
                console.log('Unexpected error:', error);
            }
        }
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (formData.title === "") {
            setHelperTextTitleInput("Timeline name is required")
            return
        }
        // POST expects ids (owner, collaborators)
        const newTimeline: TimelineCreatePayload = {
            owner: (formData as TimelineCreatePayload).owner,
            title: (formData as TimelineCreatePayload).title,
            description: (formData as TimelineCreatePayload).description,
            icon: (formData as TimelineCreatePayload).icon,
            collaborators: (formData as TimelineCreatePayload).collaborators ?? [],
            isPublic: (formData as TimelineCreatePayload).isPublic,
            color: (formData as TimelineCreatePayload).color,
        };
        console.log('new timeline: ', newTimeline);

        try {
            const response = await api.post(`/timelines`, newTimeline);
            console.log('Res POST new timeline: ', response);

            // Call the success callbacks
            props.onRefresh(); // Refresh the timelines to show the new timeline
            props.onSuccess(); // Close the drawer
        } catch (error: any) {
            if (error.response?.status === 400) {
                console.log('Error', error);
                console.log('Server says: Bad request:', error.response.data.errorMessage);
                setErrorMessageServer(error.response.data.errorMessage)
                // Handle validation error - could show user-friendly message
            } else {
                console.log('Unexpected error:', error);
            }
        }
    };

    return (
        <>
            <FormHeader>
                <Typography gutterBottom variant="h4" component="div">
                    {props.formType === 'create' ? '➕ Add a new timeline' : '✒️ Edit Timeline'}
                </Typography>
            </FormHeader>
            <FormContainer>
                <FormControl fullWidth error={helperTextTitleInput !== null}>
                    <FormLabel htmlFor="title" required >
                        Timeline name
                    </FormLabel>
                    <OutlinedInput
                        id="title"
                        name="title"
                        type="text"
                        placeholder="e.g., Books, Vacations, Career"
                        autoFocus={props.formType === "create"}
                        autoComplete="off"
                        required
                        size="small"
                        sx={responsiveStyles.formInput}
                        value={formData.title}
                        onChange={handleFormDataChange}
                        aria-describedby="timeline-name-helper-text"
                    />
                    <FormHelperText id="timeline-name-helper-text">{helperTextTitleInput !== null ? helperTextTitleInput : "Name must be unique across your timelines"}</FormHelperText>
                </FormControl>
                <FormControl fullWidth >
                    <FormLabel htmlFor="description">
                        Description
                    </FormLabel>
                    <OutlinedInput
                        id="description"
                        name="description"
                        type="description"
                        placeholder="What is this timeline about?"
                        size="small" //makes the placeholder look closer to the top border of the input
                        multiline
                        rows={4}
                        sx={responsiveStyles.formInput}
                        value={formData.description}
                        onChange={handleFormDataChange}
                    // error={true}
                    />
                </FormControl>
                {errorMessageServer !== ""
                    ? <Alert severity="error"> {errorMessageServer} </Alert>
                    : null
                }

                <Box
                    // component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                    className=''
                >
                    <Button
                        variant="outlined"
                        type="button"
                        size="medium"
                        sx={responsiveStyles.formInput}
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        size="medium"
                        sx={responsiveStyles.formInput}
                        onClick={props.formType === "create" ? handleSubmit : handleTimelineUpdate}
                    >
                        {props.formType === 'create' ? 'Create Timeline' : 'Save changes'}
                    </Button>
                </Box>
            </FormContainer>
        </>
    )
}
export default TimelineForm