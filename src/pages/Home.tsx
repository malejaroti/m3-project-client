import { useMemo, useState } from "react";
import TimelineWidget, { type VisTimelineItem } from "../components/vis-timeline/VisTimelineWidget"

// import TimelineWidget, { TimelineItem } from "../components/TimelineWidget";


function Home() {

    const [selected, setSelected] = useState<(string | number)[]>([]);

    const items = useMemo<VisTimelineItem[]>(
        () => [
            { id: 1, content: "Item 1", start: "2025-08-22" },
            { id: 2, content: "Item 2", start: "2025-08-17" },
            { id: 3, content: "Multi-day", start: "2025-08-16", end: "2025-08-19" },
            { id: 4, content: "Point", start: "2025-08-25", type: "point" },
        ],
        []
    );

    // Optional groups
    const groups = useMemo(
        () => [
            { id: "people", content: "People" },
            { id: "events", content: "Events" },
        ],
        []
    );

    const groupedItems = useMemo<VisTimelineItem[]>(
        () => [
            { id: 5, content: "Birthday", start: "2025-08-27", group: "people" },
            { id: 6, content: "Launch", start: "2025-09-01", group: "events" },
        ],
        []
    );
    return (
        <>
            <h2>Timeline</h2>
            {/* <FleetTimeline /> */}
            <TimelineWidget
                items={[...items, ...groupedItems]}
                groups={groups}
                options={{
                    // Example: focus initial window
                    start: "2025-08-10",
                    end: "2025-09-10",
                    tooltip: { followMouse: true },
                }}
                onSelectIds={setSelected}
            />
            <p>Selected IDs: {selected.join(", ") || "none"}</p>
        </>
    )
}
export default Home