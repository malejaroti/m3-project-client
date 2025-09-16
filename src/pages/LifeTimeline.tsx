import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/config.services";

import type { ITimeline } from "./TimelinesPage";
import type { ITimelineItem } from "./TimelineItemsPage";
import Typography from "@mui/material/Typography";
import { DataSet } from "vis-data";
import type { DataGroup, DataItem } from "vis-timeline";
import { Timeline } from "vis-timeline/standalone";
import { createRoot, type Root } from "react-dom/client";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

interface ITimelineWithItems {
    timelineTitle: string,
    items: ITimelineItem[]
}
type VisTimelineItem = DataItem & ITimelineItem


function LifeTimeline() {
    const [timelinesWithItems, setTimelinesWithItems] = useState<ITimelineWithItems[]>();
    const [timelines, setTimelines] = useState<ITimeline[]>([]);
    const masterTimelineContainerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<Timeline | null>(null);
    const itemsDSRef = useRef<DataSet<VisTimelineItem> | null>(null);
    const groupsDSRef = useRef<DataSet<DataGroup> | null>(null);
    const rootsMapRef = useRef<Map<Element, Root>>(new Map());

    const navigate = useNavigate()

    useEffect(() => {
        if (!masterTimelineContainerRef.current) return;
        if (!timelinesWithItems || timelinesWithItems.length === 0) return;

        // Create visTimelineItems - flatten all items from all timelines
        const visTimelineItems: VisTimelineItem[] = timelinesWithItems.flatMap((timeline, timelineIndex) =>
            timeline.items.map(item => ({
                ...item,
                id: item._id, // Map MongoDB _id to vis-timeline id
                content: item.title,
                start: new Date(item.startDate),
                end: item.endDate ? new Date(item.endDate) : undefined,
                group: timelineIndex + 1, // Each timeline gets its own group
            }))
        );

        // Create groups for each timeline
        const groups: DataGroup[] = timelinesWithItems.map((timeline, index) => ({
            id: index + 1,
            content: timeline.timelineTitle
        }));

        // Initialize DataSets
        itemsDSRef.current = new DataSet<VisTimelineItem>(visTimelineItems);
        groupsDSRef.current = new DataSet<DataGroup>(groups);

        // Initialize vis-timeline
        timelineRef.current = new Timeline(
            masterTimelineContainerRef.current,
            itemsDSRef.current,
            groupsDSRef.current,
            {
                orientation: "top",
                height: "100%",
                stack: true,
                selectable: true,
                zoomKey: "ctrlKey",
                margin: {
                    item: {
                        horizontal: 10,
                        vertical: 10
                    }
                }
            }
        );

        // Add resize observer for responsive behavior
        const ro = new ResizeObserver(() => timelineRef.current?.redraw());
        ro.observe(masterTimelineContainerRef.current);

        return () => {
            ro.disconnect();
            timelineRef.current?.destroy();
            timelineRef.current = null;
            for (const [el, root] of rootsMapRef.current.entries()) {
                root.unmount();
                rootsMapRef.current.delete(el);
            }
        };
    }, [timelines, timelinesWithItems])


    useEffect(() => {
        getTimelinesData()
    }, [])

    useEffect(() => {
        if (timelines.length > 0) {
            getItemsData()
        }
    }, [timelines])

    const getTimelinesData = async () => {
        try {
            const response = await api.get("/timelines")
            console.log("Timelines data: ", response.data)
            setTimelines(response.data)
        } catch (error) {
            console.log(error)
            navigate('/error')
        }
    }

    const getItemsData = async () => {
        if (timelines.length > 0) {
            try {
                const promises = timelines.map(async (eachTimeline) => {
                    const response = await api.get(`/timelines/${eachTimeline._id}/items`);
                    console.log(`response items timeline ${eachTimeline.title}: `, response)
                    return {
                        timelineTitle: eachTimeline.title,
                        items: response.data
                    };
                });

                const timelinesWithItemsData = await Promise.all(promises);
                console.log(timelinesWithItemsData)
                setTimelinesWithItems(timelinesWithItemsData);
            } catch (error) {
                console.error('Error fetching timeline items:', error);
                navigate('/error');
            }
        }
    }

    return (
        <>
            <Typography variant="h3">My Life Timeline</Typography>
            <div
                className="master-timeline border mt-5 h-[calc(100vh-250px)]"
                ref={masterTimelineContainerRef}
                style={{ width: "100%", minHeight: "600px" }}
            />
        </>
    )
}
export default LifeTimeline