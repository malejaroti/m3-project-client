// components/TimelineWidget.tsx
import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/standalone";
import type { TimelineOptions, DataItem, DataGroup } from "vis-timeline";

export type VisTimelineItem = DataItem;

type Props = {
    items: VisTimelineItem[];
    groups?: DataGroup[];
    options?: TimelineOptions;
    onSelectIds?: (ids: (string | number)[]) => void;
};

export default function TimelineWidget({ items, groups, options, onSelectIds }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<Timeline | null>(null);
    const itemsDSRef = useRef<DataSet<VisTimelineItem> | null>(null);
    const groupsDSRef = useRef<DataSet<DataGroup> | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // instantiate datasets once
        itemsDSRef.current = new DataSet<VisTimelineItem>(items);
        if (groups) groupsDSRef.current = new DataSet<DataGroup>(groups);

        // IMPORTANT: use 3-arg ctor if no groups
        if (groupsDSRef.current) {
            timelineRef.current = new Timeline(
                containerRef.current,
                itemsDSRef.current,
                groupsDSRef.current,
                {
                    stack: true,
                    zoomable: true,
                    horizontalScroll: true,
                    zoomKey: "ctrlKey",
                    selectable: true,
                    orientation: { axis: "bottom", item: "bottom" },
                    locale: "en",
                    ...(options || {}),
                }
            );
        } else {
            timelineRef.current = new Timeline(
                containerRef.current,
                itemsDSRef.current,
                {
                    stack: true,
                    zoomable: true,
                    horizontalScroll: true,
                    zoomKey: "ctrlKey",
                    selectable: true,
                    orientation: { axis: "bottom", item: "bottom" },
                    locale: "en",
                    ...(options || {}),
                }
            );
        }

        // events
        timelineRef.current.on("select", (e) => onSelectIds?.(e.items));

        // keep it responsive
        const ro = new ResizeObserver(() => timelineRef.current?.redraw());
        ro.observe(containerRef.current);

        return () => {
            ro.disconnect();
            timelineRef.current?.destroy();
            timelineRef.current = null;
            itemsDSRef.current = null;
            groupsDSRef.current = null;
        };
    }, []); // mount once

    // Update items efficiently
    useEffect(() => {
        const ds = itemsDSRef.current;
        if (!ds) return;
        ds.clear();
        ds.add(items);
    }, [items]);

    // Update groups efficiently
    useEffect(() => {
        const tl = timelineRef.current;
        if (!tl) return;

        if (groups && groups.length) {
            if (!groupsDSRef.current) groupsDSRef.current = new DataSet<DataGroup>(groups);
            else {
                groupsDSRef.current.clear();
                groupsDSRef.current.add(groups);
            }
            tl.setGroups(groupsDSRef.current);
        } else {
            groupsDSRef.current = null;
            // @ts-expect-error vis-timeline accepts null to clear groups
            tl.setGroups(null);
        }
    }, [groups]);

    // Update options dynamically
    useEffect(() => {
        if (options && timelineRef.current) {
            timelineRef.current.setOptions(options);
        }
    }, [options]);

    return <div ref={containerRef} style={{ width: "100%", height: 400 }} />;
}
