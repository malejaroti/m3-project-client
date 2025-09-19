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
import { getTimelineColor, defaultTimelineColor } from '../utils/timelineColors';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import Button from "@mui/material/Button";

interface ITimelineWithItems {
    timelineTitle: string,
    timelineColor: string,
    items: ITimelineItem[]
}
type VisTimelineItem = DataItem & ITimelineItem


function LifeTimeline() {
    const [timelinesWithItems, setTimelinesWithItems] = useState<ITimelineWithItems[]>();
    const [timelines, setTimelines] = useState<ITimeline[]>([]);
    const [selectedItem, setSelectedItem] = useState<ITimelineItem | null>(null);
    const [imageItemsVisibility, setImageItemsVisibility] = useState(false);
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
                    // content: `<div class="test"> ${item.title} </div>`,
                    content: `<div>${item.title}</div>${imageItemsVisibility && item.images && item.images.length > 0 ? `<img src="${item.images[0]}" style="width:32px; height:32px; border-radius: 4px; margin-top: 4px;">` : ''}`,

                    start: startDate,
                    end: endDate,
                    group: timelineIndex + 1, // Each timeline gets its own group
                    // className: `timeline-group-${timelineIndex + 1}`, // Add custom class
                    // style: `--item-color: ${timelinesWithItems[timelineIndex].timelineColor}`, // Add inline CSS variable
                    style: `--item-color: #e7e4d7; border: 0.5px solid #d4d4d4`, // Add inline CSS variable

                };
            })
        );

        // Create groups for each timeline
        const groups: DataGroup[] = timelinesWithItems.map((timeline, index) => ({
            id: index + 1,
            content: timeline.timelineTitle,
        }));

        // Set CSS custom properties for each timeline's color AND create dynamic CSS rules
        timelinesWithItems.forEach((timeline, index) => {
            const groupId = index + 1;
            if (masterTimelineContainerRef.current) {
                // Set CSS variable
                masterTimelineContainerRef.current.style.setProperty(
                    `--timeline-${groupId}-color`,
                    getTimelineColor(index, { groupId })
                    // " rgba(255, 192, 203, 0.5)"
                );

                // Check if style element exists, if not create it
                let styleElement = document.getElementById('dynamic-timeline-styles') as HTMLStyleElement;
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-timeline-styles';
                    document.head.appendChild(styleElement);
                }

                // Create dynamic CSS rules for both items and groups
                const cssRules = [

                    // Rule for group labels background
                    `.vis-label.vis-group-level-0:nth-child(${groupId}) { 
                        background-color: var(--timeline-${groupId}-color,  rgba(255, 192, 203, 0.5)) !important;
                        border-radius: 4px !important;
                        padding: 4px 8px !important;
                    }`,
                    // Alternative selector in case the data-group attribute doesn't work
                    `.vis-foreground .vis-group:nth-child(${groupId}) { 
                        background-color: var(--timeline-${groupId}-color,  rgba(255, 192, 203, 0.5)) !important;
                        color: white !important;
                        border-radius: 4px !important;
                        padding: 4px 8px !important;
                    }`
                ];

                // Add all CSS rules
                if (styleElement.sheet) {
                    cssRules.forEach(cssRule => {
                        try {
                            styleElement.sheet!.insertRule(cssRule, styleElement.sheet!.cssRules.length);
                        } catch (e) {
                            // Rule might already exist, that's okay
                            console.log('CSS rule already exists or invalid:', e);
                        }
                    });
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

        // Add selection event handler
        timelineRef.current.on('select', (properties) => {
            if (properties.items.length > 0) {
                const selectedItemId = properties.items[0];
                // Find the selected item in our data
                const foundItem = timelinesWithItems.flatMap(timeline => timeline.items)
                    .find(item => item._id === selectedItemId);
                if (foundItem) {
                    setSelectedItem(foundItem);
                }
            } else {
                setSelectedItem(null);
            }
        });

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

    // Update item content when toggling image visibility
    useEffect(() => {
        if (!itemsDSRef.current || !timelineRef.current || !timelinesWithItems) return;

        const updates = timelinesWithItems.flatMap(tl =>
            tl.items.map(item => ({
                id: item._id,
                content: `<div>${item.title}</div>${imageItemsVisibility && item.images && item.images.length > 0 ? `<img src="${item.images[0]}" style="width:32px; height:32px; border-radius:4px; margin-top:4px;">` : ''}`,
            }))
        );

        try {
            (itemsDSRef.current as any).update(updates);
            timelineRef.current.redraw();
        } catch (e) {
            console.warn('Failed to update items content on toggle', e);
        }
    }, [imageItemsVisibility, timelinesWithItems]);

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
        <main>
            <div className="flex gap-6 mb-8 items-center">
                <Typography variant="h3" className="mb-4">My Life Timeline</Typography>
                <Button
                    variant="outlined"
                    size='small'
                    sx={{
                        fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.8rem" },
                        px: { xs: 1, sm: 2, md: 1 },
                        py: { xs: 0.5, sm: 1, md: 0 },
                        height: '2rem'
                    }}
                    onClick={() => setImageItemsVisibility(s => !s)}
                // onClick={onClick}
                >
                    {imageItemsVisibility ? (
                        <div className=" flex gap-2">
                            <VisibilityOff /> Hide items images
                        </div>
                    ) : (
                        <div className=" flex gap-2">
                            <Visibility /> See items images
                        </div>
                    )}
                </Button>
            </div>

            <div className="flex gap-4 h-[calc(100vh-200px)]">
                {/* Timeline Container */}
                <div
                    className="master-timeline flex-1 bg-gradient-to-b from-blue-500 to-yellow-500 overflow-y-scroll rounded-lg"
                    ref={masterTimelineContainerRef}
                    style={{ minHeight: "600px" }}
                />

                {/* Details Box */}
                <div className="w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-4 overflow-y-auto">
                    <Typography variant="h5" className="mb-3 text-gray-800">
                        {selectedItem ? 'Item Details' : 'Select an Item'}
                    </Typography>

                    {selectedItem ? (
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <Typography variant="h6" className="font-semibold text-gray-900">
                                    {selectedItem.title}
                                </Typography>
                            </div>

                            {/* Image */}
                            {selectedItem.images && selectedItem.images.length > 0 && (
                                <div className="flex justify-center">
                                    <img
                                        src={selectedItem.images[0]}
                                        alt={selectedItem.title}
                                        className="max-w-full h-100 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            {selectedItem.description && (
                                <div>
                                    <Typography variant="subtitle2" className="font-medium text-gray-700 mb-1">
                                        Description:
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {selectedItem.description}
                                    </Typography>
                                </div>
                            )}

                            {/* Dates */}
                            <div>
                                <Typography variant="subtitle2" className="font-medium text-gray-700 mb-1">
                                    Date:
                                </Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    {new Date(selectedItem.startDate).toLocaleDateString()}
                                    {selectedItem.endDate && selectedItem.endDate !== selectedItem.startDate &&
                                        ` - ${new Date(selectedItem.endDate).toLocaleDateString()}`
                                    }
                                </Typography>
                            </div>

                            {/* Tags */}
                            {selectedItem.tags && selectedItem.tags.length > 0 && (
                                <div>
                                    <Typography variant="subtitle2" className="font-medium text-gray-700 mb-2">
                                        Tags:
                                    </Typography>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedItem.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Impact */}
                            {selectedItem.impact && (
                                <div>
                                    <Typography variant="subtitle2" className="font-medium text-gray-700 mb-1">
                                        Impact:
                                    </Typography>
                                    <Typography variant="body2" className="text-gray-600">
                                        {selectedItem.impact}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            <Typography variant="body1">
                                Click on a timeline item to see its details here.
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
export default LifeTimeline