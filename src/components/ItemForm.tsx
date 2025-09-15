import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import TextField from "@mui/material/TextField";
// import FormGroup from "@mui/material/FormGroup";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";

import React, { useContext, useState } from "react";
import type { ITimelineItem, TimelineItemCreateDTO } from "../pages/TimelineItemsPage";
import { AuthContext } from "../context/auth.context";
import ImageUploader from "./ImageUploader";
import CloudinaryImageUploader from "./CloudinaryImageUploader";
import api from "../services/config.services";
import { useNavigate } from "react-router";
import dayjs, { Dayjs } from "dayjs";


const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export type FormType = "edit" | "create" | null; //union

// discriminated union
type ItemFormProps =
  | { formType: "create"; timelineId: string; item?: never }
  | { formType: "edit"; item: ITimelineItem; timelineId: string };

export default function ItemForm(props: ItemFormProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("Item creation must be done within an AuthWrapper");
  }
  const { loggedUserId } = authContext;

  const defaultFormData: TimelineItemCreateDTO = {
    creator: loggedUserId !== null ? loggedUserId : "",
    timeline: props.timelineId,
    // kind: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    images: [],
    impact: "",
    tags: [],
  };

  const [formData, setFormData] = useState<TimelineItemCreateDTO>(
    props.formType === "edit" && props.item
      ? { ...props.item }
      : { ...defaultFormData },
  );
  // console.log("props.item: ", props.item)
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // for a loading animation effect while image uploads to cloudinary and URL is generated
  const [startDateValue, setStartDateValue] = useState<Dayjs | null>(
    props.formType === "edit" && props.item?.startDate
      ? dayjs(props.item.startDate)
      : dayjs()
  );
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(
    props.formType === "edit" && props.item?.endDate
      ? dayjs(props.item.endDate)
      : dayjs()
  );
  const [allDayEvent, setAllDayEvent] = useState(formData.startDate === formData.endDate);
  const navigate = useNavigate();

  const handleFormDataChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file: File) => {
    console.log("The file to be uploaded is: ", file);
    setIsUploading(true); // to start the loading animation
    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append("image", file);
    console.log("The upload data to be passed to Backend is: ", uploadData);

    try {
      const response = await api.post("/upload", uploadData);
      // backend sends the image to the frontend => res.json({ imageUrl: req.file.path });
      console.log("response to POST upload: ", response);
      setIsUploading(false); // to stop the loading animation
      setFormData(
        {
          ...formData,
          images: [...formData.images, response.data.imageUrl] // add new file
        }
      )
    } catch (error) {
      navigate("/error");
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (file !== null) {
      handleFileUpload(file)
    }
    const newItem = {
      ...formData,
      startDate: startDateValue ? startDateValue.format('YYYY-MM-DD') : '',
      endDate: allDayEvent
        ? (startDateValue ? startDateValue.format('YYYY-MM-DD') : '')
        : (endDateValue ? endDateValue.format('YYYY-MM-DD') : ''),
      impact: "positive"
    };
    console.log("new item: ", newItem)
    isUploading 
    try {
      const response = api.post(`/timelines/${formData.timeline}/items`, newItem);
      console.log("Res POST new item: ", response);
    } catch (error) { 
      navigate("/error");
    }
  };

  return (
    <main className="m-5">
      <Typography gutterBottom variant="h4" component="div">
        {props.formType === "create" ? "Add a new item" : "Edit item"}
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
            autoComplete="item title"
            required
            size="small"
            value={formData.title}
            onChange={handleFormDataChange}
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
            autoComplete="description"
            required
            size="small"
            multiline
            value={formData.description}
            onChange={handleFormDataChange}
          />
        </FormGrid>
        <FormGrid>
          <FormLabel htmlFor="start-date" required>
            {allDayEvent ? "Date" : "Start Date"}
          </FormLabel>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              // label="Start date"
              name="startDate"
              value={startDateValue}
              onChange={(newValue) => setStartDateValue(newValue)}
              // onChange={handleFormDataChange}
              slotProps={{ textField: { fullWidth: true, id: "start-date" } }}
            />
          </LocalizationProvider>
          <FormControlLabel
            control={
              <Checkbox
                checked={allDayEvent}
                onChange={(_event, checked) => setAllDayEvent(checked)}
              // sx={allDayEvent ? { display: "inline-block" } : { display: "none" }}
              />
            }
            label="One day event"
          />
        </FormGrid>
        {!allDayEvent && (
          <FormGrid>
            <FormLabel htmlFor="end-date" required>
              End Date
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                // label="End date"
                name="EndDate"
                value={endDateValue}
                onChange={(newValue) => setEndDateValue(newValue)}
                slotProps={{ textField: { fullWidth: true, id: "end-date" } }}
              // sx={allDayEvent ? { display: "inline-block" } : { display: "none" }}
              />
            </LocalizationProvider>
          </FormGrid>
        )}
        <FormGrid size={{ xs: 12 }}>
          <ImageUploader
            onFileSelect={setFile}
          />
        </FormGrid>
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

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: { xs: 2, sm: 5, md: 10 },
        }}
      >
        <Button
          variant="contained"
          type="submit"
          size="medium"
          onClick={handleSubmit}
        >
          {props.formType === "create" ? "Create item" : "Save changes"}
        </Button>
      </Box>
    </main>
  );
}
