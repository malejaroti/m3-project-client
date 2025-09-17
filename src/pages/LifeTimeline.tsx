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
    timelineColor: string,
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
            timeline.items.map(item => {
                const startDate = new Date(item.startDate);
                let endDate: Date | undefined;


                if (!item.endDate) {
                    endDate = new Date();
                }
                // Handle one-day events: if no endDate is same as startDate, make it a full day block
                else if (item.startDate === item.endDate) {
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 1); // Add one day to make it a block
                } else {
                    endDate = new Date(item.endDate);
                }

                return {
                    ...item,
                    id: item._id, // Map MongoDB _id to vis-timeline id
                    content: `<div class="test"> ${item.title} </div>`,
                    start: startDate,
                    end: endDate,
                    group: timelineIndex + 1, // Each timeline gets its own group
                    className: `timeline-group-${timelineIndex + 1}`, // Add custom class
                    // style: `--item-color: ${timelinesWithItems[timelineIndex].timelineColor}`, // Add inline CSS variable
                    // style: `--item-color: pink}`, // Add inline CSS variable

                };
            })
        );

        // Create groups for each timeline
        const groups: DataGroup[] = timelinesWithItems.map((timeline, index) => ({
            id: index + 1,
            content: timeline.timelineTitle
        }));

        // Set CSS custom properties for each timeline's color AND create dynamic CSS rules
        timelinesWithItems.forEach((timeline, index) => {
            const groupId = index + 1;
            if (masterTimelineContainerRef.current) {
                // Set CSS variable
                masterTimelineContainerRef.current.style.setProperty(
                    `--timeline-${groupId}-color`,
                    timeline.timelineColor
                );

                // Create dynamic CSS rule for this group
                const cssRule = `.vis-item.timeline-group-${groupId} .vis-item-overflow { 
                    background-color: var(--timeline-${groupId}-color, #ccc) !important; 
                }`;

                // Check if style element exists, if not create it
                let styleElement = document.getElementById('dynamic-timeline-styles') as HTMLStyleElement;
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-timeline-styles';
                    document.head.appendChild(styleElement);
                }

                // Add the CSS rule
                if (styleElement.sheet) {
                    try {
                        styleElement.sheet.insertRule(cssRule, styleElement.sheet.cssRules.length);
                    } catch (e) {
                        // Rule might already exist, that's okay
                        console.log('CSS rule already exists or invalid:', e);
                    }
                }
            }
        });

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
                xss: {
                    disabled: true  // Allow HTML content
                },
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
                        timelineColor: eachTimeline.color || 'gray',
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
                className="master-timeline border mt-5 h-[calc(100vh-250px)] overflow-y-scroll"
                ref={masterTimelineContainerRef}
                style={{ width: "100%", minHeight: "600px" }}
            />
        </>
    )
}
export default LifeTimeline