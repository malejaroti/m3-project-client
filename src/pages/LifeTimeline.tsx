import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/config.services";

import type { ITimeline } from "./TimelinesPage";
import type { ITimelineItem } from "./TimelineItemsPage";
import Typography from "@mui/material/Typography";
import { DataSet, DataView } from "vis-data";
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

function getYearStart(todayDate: Date) {
    const year = todayDate.getFullYear()
    const firstDayOfYear = new Date(year, 0, 1, 0, 0, 0, 0)
    return firstDayOfYear
}
function getWeekStart(todayDate: Date) {
    if (todayDate.getDay() === 1) {
        return todayDate;
    } else {
        // Monday.getDay = 1 (day of the week)
        const mondayDate = todayDate.getDate() - todayDate.getDay() + 1
        const weekStartDate = new Date( todayDate.getFullYear(), todayDate.getMonth(), mondayDate )
        // console.log("week start date: ", weekStartDate)
        return weekStartDate;
    }
}
function getWeekEnd(todayDate: Date) {
    if (todayDate.getDay() === 0) {
        // Sunday
        return todayDate;
    } else {
        // Add (7 - day) to get to Sunday
        const sundayDate = todayDate.getDate() + 8 - todayDate.getDay()
        const weekEndDate = new Date( todayDate.getFullYear(), todayDate.getMonth(), sundayDate )
        console.log("week end date: ", weekEndDate)
        return weekEndDate;
    }
}

function getMonthStart(todayDate: Date) {
    return new Date(todayDate.getFullYear(), todayDate.getMonth(), 1, 0, 0, 0, 0);
}
function getMonthEnd(todayDate: Date) {
    return new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0, 23, 59, 59, 999);
}

function LifeTimeline() {
    const [timelinesWithItems, setTimelinesWithItems] = useState<ITimelineWithItems[]>();
    const [timelines, setTimelines] = useState<ITimeline[]>([]);
    const [selectedItem, setSelectedItem] = useState<ITimelineItem | null>(null);
    const [imageItemsVisibility, setImageItemsVisibility] = useState(false);
    const masterTimelineContainerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<Timeline | null>(null);
    const itemsDSRef = useRef<DataSet<VisTimelineItem> | null>(null);
    const itemsViewRef = useRef<DataView<VisTimelineItem> | null>(null);
    const groupsDSRef = useRef<DataSet<DataGroup> | null>(null);
    const rootsMapRef = useRef<Map<Element, Root>>(new Map());
    const currentWindowRef = useRef<{ start: Date; end: Date } | null>(null);

    const navigate = useNavigate()

    const handleSetWindow = (startDate: string | Date, endDate: string | Date) => {
        // console.log("Set window to : ", startDate, "-", endDate)
        timelineRef.current?.setWindow(startDate, endDate)
    }

    useEffect(() => {
        if (!masterTimelineContainerRef.current) return;
        if (!timelinesWithItems || timelinesWithItems.length === 0) return;

        // Create visTimelineItems - flatten all items from all timelines
        const visTimelineItems: VisTimelineItem[] = timelinesWithItems.flatMap((timeline, timelineIndex) =>
            timeline.items.map(item => {
                const startDate = new Date(item.startDate);
                let endDate: Date | undefined;

                // If no endDate provided, EndDate is today.
                if (!item.endDate) {
                    endDate = new Date();
                }
                // Handle one-day events: if endDate is same as startDate, make it a full day block
                else if (item.startDate === item.endDate) {
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 1); // Add one day to make it a block
                } else {
                    endDate = new Date(item.endDate);
                }

                return {
                    ...item,
                    id: item._id, //use MongoDB itemId as id for VisItem
                    content: `<div>${item.title}</div>${imageItemsVisibility && item.images && item.images.length > 0 ? `<img src="${item.images[0]}" style="width:32px; height:32px; border-radius: 4px; margin-top: 4px;">` : ''}`,
                    start: startDate,
                    end: endDate,
                    group: timelineIndex + 1,
                    type: endDate ? 'range' : 'box',
                    style: `--item-color: #e7e4d7; border: 0.5px solid #d4d4d4`,
                };
            })
        );

        // Create groups for each timeline
        const groups: DataGroup[] = timelinesWithItems.map((timeline, index) => ({
            id: index + 1,
            content: timeline.timelineTitle,
        }));

        // Set CSS custom properties for group colors (kept as in your code)
        timelinesWithItems.forEach((timeline, index) => {
            const groupId = index + 1;
            if (masterTimelineContainerRef.current) {
                masterTimelineContainerRef.current.style.setProperty(
                    `--timeline-${groupId}-color`,
                    getTimelineColor(index, { groupId })
                );
                let styleElement = document.getElementById('dynamic-timeline-styles') as HTMLStyleElement;
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'dynamic-timeline-styles';
                    document.head.appendChild(styleElement);
                }
                const cssRules = [
                    `.vis-label.vis-group-level-0:nth-child(${groupId}) { 
                        background-color: var(--timeline-${groupId}-color,  rgba(255, 192, 203, 0.5)) !important;
                        border-radius: 4px !important;
                        padding: 4px 8px !important;
                    }`,
                    `.vis-foreground .vis-group:nth-child(${groupId}) { 
                        background-color: var(--timeline-${groupId}-color,  rgba(255, 192, 203, 0.5)) !important;
                        color: white !important;
                        border-radius: 4px !important;
                        padding: 4px 8px !important;
                    }`
                ];
                if (styleElement.sheet) {
                    cssRules.forEach(cssRule => {
                        try {
                            styleElement.sheet!.insertRule(cssRule, styleElement.sheet!.cssRules.length);
                        } catch { }
                    });
                }
            }
        });

        // Initialize DataSets and DataView (filtered by current window)
        itemsDSRef.current = new DataSet<VisTimelineItem>(visTimelineItems);
        groupsDSRef.current = new DataSet<DataGroup>(groups);

        const initialStart = getYearStart(new Date());
        const initialEnd = new Date();
        currentWindowRef.current = { start: initialStart, end: initialEnd };

        itemsViewRef.current = new DataView(itemsDSRef.current, {
            filter: (item) => {
                const win = currentWindowRef.current;
                if (!win) return true;
                const itemStart = (item.start as Date).getTime();
                const itemEnd = item.end ? (item.end as Date).getTime() : itemStart; // box as point
                // Render only items that intersect the visible window
                return itemStart <= win.end.getTime() && itemEnd >= win.start.getTime();
            }
        });

        // Initialize vis-timeline with explicit start and end
        timelineRef.current = new Timeline(
            masterTimelineContainerRef.current,
            itemsViewRef.current, // use filtered view
            groupsDSRef.current,
            {
                orientation: "top",
                height: "100%",
                stack: true,
                selectable: true,
                zoomKey: "ctrlKey",
                start: initialStart,
                end: initialEnd,
                xss: { disabled: true },
                margin: { item: { horizontal: 10, vertical: 10 } }
            }
        );

        // Keep the view in sync when the window changes (drag, zoom, or setWindow)
        timelineRef.current.on('rangechange', (props: any) => {
            currentWindowRef.current = { start: new Date(props.start), end: new Date(props.end) };
            itemsViewRef.current?.refresh();
        });

        // Selection -> details
        timelineRef.current.on('select', (properties) => {
            if (properties.items.length > 0) {
                const selectedItemId = properties.items[0];
                const foundItem = timelinesWithItems.flatMap(tl => tl.items)
                    .find(item => item._id === selectedItemId);
                setSelectedItem(foundItem ?? null);
            } else {
                setSelectedItem(null);
            }
        });
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
            // DataView will pass through updates automatically
            timelineRef.current.redraw();
        } catch (e) {
            console.warn('Failed to update items content on toggle', e);
        }
    }, [imageItemsVisibility, timelinesWithItems])

    const getTimelinesData = async () => {
        try {
            const response = await api.get("/timelines")
            // console.log("Timelines data: ", response.data)
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
                    // console.log(`response items timeline ${eachTimeline.title}: `, response)
                    return {
                        timelineTitle: eachTimeline.title,
                        timelineColor: eachTimeline.color || 'gray',
                        items: response.data
                    };
                });

                const timelinesWithItemsData = await Promise.all(promises);
                // console.log(timelinesWithItemsData)
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
                <Button
                    variant="outlined"
                    size='small'
                    sx={{
                        fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.8rem" },
                        px: { xs: 1, sm: 2, md: 1 },
                        py: { xs: 0.5, sm: 1, md: 0 },
                        height: '2rem'
                    }}
                    // onClick={() => handleSetWindow("2025-01-01", "2025-09-21" )}
                    onClick={() => handleSetWindow(getYearStart(new Date()), new Date())}
                >
                    This year
                </Button>
                <Button
                    variant="outlined"
                    size='small'
                    sx={{
                        fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.8rem" },
                        px: { xs: 1, sm: 2, md: 1 },
                        py: { xs: 0.5, sm: 1, md: 0 },
                        height: '2rem'
                    }}
                    // onClick={() => handleSetWindow("2025-01-01", "2025-09-21" )}
                    onClick={() => handleSetWindow(getMonthStart(new Date()), getMonthEnd(new Date()))}
                // onClick={() => handleSetWindow(new Date("2025-09-22"), new Date("2025-09-23"))}
                >
                    This month
                </Button>
                <Button
                    variant="outlined"
                    size='small'
                    sx={{
                        fontSize: { xs: "0.7rem", sm: "0.85rem", md: "0.8rem" },
                        px: { xs: 1, sm: 2, md: 1 },
                        py: { xs: 0.5, sm: 1, md: 0 },
                        height: '2rem'
                    }}
                    // onClick={() => handleSetWindow("2025-01-01", "2025-09-21" )}
                    onClick={() => handleSetWindow(getWeekStart(new Date()), getWeekEnd(new Date()))}
                // onClick={() => handleSetWindow(new Date("2025-09-22"), new Date("2025-09-23"))}
                >
                    This week
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