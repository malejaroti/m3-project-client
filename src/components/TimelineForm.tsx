import Typography from "@mui/material/Typography"
import { FormContainer, FormGrid } from "./FormSubcomponents/FormGrid"
import type { ITimeline, TimelineCreateDTO } from "../pages/TimelinesPage"
import FormLabel from "@mui/material/FormLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { responsiveStyles } from "../shared-theme/themePrimitives"
import { useContext, useState } from "react"
import { AuthContext } from "../context/auth.context"
import api from "../services/config.services"
import { useNavigate } from "react-router"

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

        const newTimelineData: TimelineCreateDTO = {
        owner: loggedUserId !== null ? loggedUserId : '',
        title: '',
        description: '',
        icon: '',
        collaborators: [],
        isPublic: false,
        color: "gray"
        };

        const [formData, setFormData] = useState<TimelineCreateDTO>( 
            props.formType === "create"
            ? {...newTimelineData}
            : {...props.timeline}
        );
        const navigate = useNavigate();

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
            const updatedTimeline = {
            ...formData,
            };
            console.log('Updates for timeline: ', updatedTimeline);

            try {
            const response = await api.put(`/timelines/${props.timeline?._id}`, updatedTimeline );
            console.log('Res PUT updated timeline: ', response);

            // Call the success callbacks
            props.onRefresh(); // Refresh the timelines
            props.onSuccess(); // Close the drawer
            } catch (error) {
            navigate('/error');
            }
        };
        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            const newTimeline = {
            ...formData,
            };
            console.log('new timeline: ', newTimeline);

            try {
            const response = await api.post(`/timelines`, newTimeline );
            console.log('Res POST new timeline: ', response);

            // Call the success callbacks
            props.onRefresh(); // Refresh the timelines
            props.onSuccess(); // Close the drawer
            } catch (error) {
            navigate('/error');
            }
        };
        
    return (
        <>
            <div className="bg-slate-300 h-[100px] flex items-center p-[10px]">
                <Typography gutterBottom variant="h4" component="div">
                    {props.formType === 'create' ? '➕ Add a new timeline' : '✒️ Edit Timeline'}
                </Typography>
            </div>
            <FormContainer>
                <Grid container spacing={3} className="">
                    <FormGrid size={{ xs: 12, md: 6 }}>
                        <FormLabel htmlFor="first-name" required sx={responsiveStyles.formLabel}>
                            Timeline title
                        </FormLabel>
                        <OutlinedInput
                            id="title"
                            name="title"
                            type="name"
                            placeholder="Timeline title"
                            autoComplete="off"
                            required
                            size="small"
                            sx={responsiveStyles.formInput}
                            value={formData.title}
                            onChange={handleFormDataChange}
                        />
                    </FormGrid>


                    <FormGrid size={{ xs: 12 }}>
                        <FormLabel htmlFor="description" required sx={responsiveStyles.formLabel}>
                            Description
                        </FormLabel>
                        <OutlinedInput
                            id="description"
                            name="description"
                            type="description"
                            placeholder=" What is this timeline about?"
                            autoComplete="off"
                            required
                            size="small"
                            multiline
                            sx={responsiveStyles.formInput}
                            value={formData.description}
                            onChange={handleFormDataChange}
                        />
                    </FormGrid>
                </Grid>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        // marginTop: { xs: 2, sm: 5, md: 10 },
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
                    // loading={isUploading}
                    >
                        {props.formType === 'create' ? 'Create item' : 'Save changes'}
                    </Button>
                </Box>
            </FormContainer>
        </>
    )
}
export default TimelineForm