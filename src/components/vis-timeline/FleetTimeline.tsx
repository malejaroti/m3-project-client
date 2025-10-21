// src/components/FleetTimeline.tsx
import { useEffect, useMemo, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/standalone";
import type { DataItem, DataGroup, TimelineOptions } from "vis-timeline";
import { createRoot, type Root } from "react-dom/client";
import type { ITimelineItem } from "../../pages/TimelineItemsPage";
// import "vis-timeline/styles/vis-timeline-graph2d.min.css";

type FleetItem = DataItem & {
  // add your own extra fields if needed
  truckId?: number;
};

function GroupTemplate({ group }: { group: DataGroup }) {
  return (
    <div className="px-2 py-1">
      <label>{String(group.content)}</label>
    </div>
  );
}

function ItemTemplate({ item }: { item: FleetItem }) {
  return (
    <div className="px-2 py-1">
      <label>{item.content}</label>
    </div>
  );
}

type FleetTilineProps = {
    items: ITimelineItem[],
    timelineTitle: string
}

export default function FleetTimeline( props: FleetTilineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const itemsDSRef = useRef<DataSet<FleetItem> | null>(null);
  const groupsDSRef = useRef<DataSet<DataGroup> | null>(null);

  // Keep a map of DOM element -> React Root so we can re-render efficiently and unmount on cleanup
  const rootsMapRef = useRef<Map<Element, Root>>(new Map());

  // ------- Demo data (same spirit as your snippet) -------
  const { items, groups } = useMemo(() => {
    const numberOfGroups = 25;
    const numberOfItems = 1000;
    const groupsArr: DataGroup[] = [];
    for (let i = 0; i < numberOfGroups; i++) {
      groupsArr.push({ id: i, content: `Truck ${i}` });
    }

    // const itemsPerGroup = Math.round(numberOfItems / numberOfGroups);
    let newArr = props.items.map((item, index)=> (
        { id:index,
            content: item.title,
            start: item.startDate,
            end: item.endDate,
            group: props.timelineTitle
        }
    ))
    const itemsArr =  newArr
    // const itemsArr: FleetItem[] = [];
    // for (let truck = 0; truck < numberOfGroups; truck++) {
    //   let date = new Date();
    //   for (let order = 0; order < itemsPerGroup; order++) {
    //     // 20% chance to add a 4h gap
    //     date.setHours(date.getHours() + (Math.random() < 0.2 ? 4 : 0));
    //     const start = new Date(date);
    //     // duration 2–5 hours
    //     date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
    //     const end = new Date(date);

    //     itemsArr.push({
    //       id: order + itemsPerGroup * truck,
    //       group: truck,
    //       start,
    //       end,
    //       content: `Order ${order}`,
    //       truckId: truck,
    //     });
    //   }
    // }
    return { items: itemsArr, groups: groupsArr };
  }, []);

  const options = useMemo<TimelineOptions>(
    () => ({
      orientation: "top",
      maxHeight: 400,
      start: new Date(),
      end: new Date(Date.now() + 1000 * 60 * 60 * 24), // +1 day
      editable: true,
      stack: true,
      horizontalScroll: true,
      zoomKey: "ctrlKey",
      selectable: true,

      // React-driven item template
      template: (item, element) => {
        if (!item || !element) return "";
        let root = rootsMapRef.current.get(element);
        if (!root) {
          root = createRoot(element);
          rootsMapRef.current.set(element, root);
        }
        root.render(<ItemTemplate item={item as FleetItem} />);
        // Return empty string so vis-timeline doesn’t overwrite our DOM
        return "";
      },

      // React-driven group template
      groupTemplate: (group, element) => {
        if (!group || !element) return "";
        let root = rootsMapRef.current.get(element);
        if (!root) {
          root = createRoot(element);
          rootsMapRef.current.set(element, root);
        }
        root.render(<GroupTemplate group={group} />);
        return "";
      },
    }),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;

    itemsDSRef.current = new DataSet<FleetItem>(items);
    groupsDSRef.current = new DataSet<DataGroup>(groups);

    timelineRef.current = new Timeline(
      containerRef.current,
      itemsDSRef.current,
      groupsDSRef.current,
      options
    );

    const ro = new ResizeObserver(() => timelineRef.current?.redraw());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      timelineRef.current?.destroy();
      timelineRef.current = null;

      // Unmount all React roots we created inside vis templates
      for (const [el, root] of rootsMapRef.current.entries()) {
        root.unmount();
        rootsMapRef.current.delete(el);
      }
    };
  }, [items, groups, options]);

  return (
    <div>
      <h2 className="mb-2">Vis Timeline with React templates</h2>
      <div ref={containerRef} style={{ width: "100%", height: 400 }} />
    </div>
  );
}
