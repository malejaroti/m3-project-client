import { useEffect, useState, Fragment, useCallback } from "react";
import api from "../services/config.services";
import { Link, useParams } from "react-router";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import type { ITimeline } from "./TimelinesPage";
import Edit from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import ItemForm, { type FormType } from "../components/ItemForm";

// Server timeline item model (normalized). Dates are ISO strings; arrays are plain string arrays.
export interface ITimelineItem { //Full server model
  _id: string;
  timeline: string;
  creator: string;
  // kind: string;
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
  images: string[]; // always an array; empty if none
  impact?: string;
  tags: string[]; // empty array if none
  isApproved: boolean; // server controlled
  comments: string[]; // empty array if none
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// DTO for creating a new item (exclude server-managed fields)
export type TimelineItemCreateDTO = Omit<
  ITimelineItem,
  "_id" | "createdAt" | "updatedAt" | "isApproved" | "comments"
>;

// DTO for updating an existing item (partial fields allowed)
export type TimelineItemUpdateDTO = Partial<TimelineItemCreateDTO>;

type DrawerPosition = "top" | "left" | "bottom" | "right";
interface DrawerState {
  position: DrawerPosition;
  open: boolean;
}
function TimelineItemsPage() {
  const [timelineDetails, setTimelineDetails] = useState<ITimeline>();
  const [timelineItems, setTimelineItems] = useState<ITimelineItem[]>([]);
  const [selectedTimelineItem, setSelectedTimelineItem] =
    useState<ITimelineItem | null>(null);
  const { timelineId } = useParams<{ timelineId: string }>();
  const [formType, setFormType] = useState<FormType>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    position: "right",
    open: false,
  });

  useEffect(() => {
    getTimelineDetails();
    getTimelineItems();
  }, []);

  const getTimelineDetails = async () => {
    try {
      const response = await api.get(`/timelines/${timelineId}`);
      console.log("timeline details", response);
      setTimelineDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTimelineItems = async () => {
    try {
      const response = await api.get(`/timelines/${timelineId}/items`);
      console.log("timeline items", response);
      setTimelineItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  /* const toggleDrawer =
    (position: DrawerPosition, open: boolean, formType: FormType) =>
      (event: React.MouseEvent) => {
        event.stopPropagation();
        // if (
        //   event.type === 'keydown' &&
        //   ((event as React.KeyboardEvent).key === 'Tab' ||
        //     (event as React.KeyboardEvent).key === 'Shift')
        // ) {
        //   return;
        // }

        setDrawerState({ ...drawerState, position: position, open: open, formType: formType });
      };
  */

  // useCallback keeps handler refs stable so children (e.g. <Button/Drawer>) don’t re-render unnecessarily
  // Without useCallback, a new function would be created on every render, which could cause avoidable updates.
  const openDrawerCreate = useCallback((position: DrawerPosition) => {
    setFormType("create");
    setSelectedTimelineItem(null);
    setDrawerState((prev) => ({ ...prev, position, open: true }));
  }, []);

  const openDrawerEdit = useCallback(
    (item: ITimelineItem, position: DrawerPosition) => {
      setFormType("edit");
      setSelectedTimelineItem(item);
      setDrawerState((prev) => ({ ...prev, position, open: true }));
    },
    [],
  );

  const closeDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <>
      <main className="relative">
        <section className="gallery-timeline-items m-5 border">
          <Typography variant="h4" component="h2">
            {timelineDetails?.title}
          </Typography>
          <div className="flex gap-4 mt-5">
            {timelineItems.map((timelineItem) => (
              <Card sx={{ maxWidth: 345 }} key={timelineItem._id}>
                {/* <CardActionArea> */}
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    timelineItem.images && timelineItem.images.length > 0
                      ? timelineItem.images[0]
                      : undefined
                  }
                  alt="Timeline image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {timelineItem.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {new Intl.DateTimeFormat("en-GB").format(
                      new Date(timelineItem.startDate),
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {timelineItem.description}
                  </Typography>
                  <IconButton
                    aria-label="Edit item"
                    onClick={() => openDrawerEdit(timelineItem, "right")}
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </CardContent>
                {/* </CardActionArea> */}
              </Card>
            ))}
          </div>
        </section>
        <Button
          variant="contained"
          sx={{
            position: "absolute",
            top: 16, // equivalente a theme.spacing(2)
            right: 16,
            bgcolor: "primary.main", // use theme's color
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          onClick={() => openDrawerCreate("right")}
        // onClick={toggleDrawer('right', true, "create")}
        >
          Add a new moment
        </Button>

        <div>
          <Drawer
            anchor={drawerState.position}
            open={drawerState.open}
            onClose={closeDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "90%", sm: 500, md: 600 },
              },
            }}
          >
            {formType === "create" && timelineId && (
              <ItemForm formType="create" timelineId={timelineId.toString()} />
            )}

            {formType === "edit" && selectedTimelineItem && timelineId && (
              <ItemForm
                formType="edit"
                item={selectedTimelineItem}
                timelineId={timelineId.toString()}
              />
            )}
          </Drawer>
        </div>
      </main>
    </>
  );
}
export default TimelineItemsPage;
