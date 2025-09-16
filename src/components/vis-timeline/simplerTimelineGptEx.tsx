import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Timeline } from "vis-timeline/standalone";
import type { DataItem, DataGroup, TimelineOptions } from "vis-timeline";
import { createRoot, type Root } from "react-dom/client";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

type TimelineItem = DataItem & {
    impact?: string;
    tags?: string[];
};

function GroupTemplate({ group }: { group: DataGroup }) {
    return (
        <div style={{
            padding: "4px 8px",
            // padding: "12px 16px",
            // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            // color: "white",
            // borderRadius: "8px",
            // fontWeight: "600",
            // fontSize: "14px",
            // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            // textAlign: "center",
            // letterSpacing: "0.5px"
        }}>
            {typeof group.content === "string" ? group.content : String(group.content)}
        </div>
    );
}

function ItemTemplate({ item }: { item: TimelineItem }) {
  return <div style={{ padding: '4px 8px' }}><label>{item.content}</label></div>;
}
// function ItemTemplate({ item }: { item: TimelineItem }) {
//     return (
//         <div style={{
//             padding: "12px 16px",
//             // background: "white",
//             // borderRadius: "12px",
//             // border: "1px solid #e1e5e9",
//             // boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
//             // fontSize: "13px",
//             // fontWeight: "500",
//             // color: "#2d3748",
//             // transition: "all 0.2s ease",
//             // cursor: "pointer",
//             // position: "relative",
//             // minHeight: "60px", // Increased minimum height for wrapped text
//             // height: "auto", // Allow height to expand automatically
//             // display: "flex",
//             // alignItems: "flex-start"
//         }}>
//             <div style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 width: "4px",
//                 height: "100%",
//                 background: "linear-gradient(to bottom, #4299e1, #3182ce)",
//             }} />
//             <div style={{
//                 marginLeft: "8px",
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "flex-start"
//             }}>
//                 <div style={{
//                     wordWrap: "break-word",
//                     overflowWrap: "break-word",
//                     whiteSpace: "normal",
//                     lineHeight: "1.4",
//                     width: "100%",
//                     height: "2.8em", // Fixed height for exactly 2 lines
//                     overflow: "visible" // Hide any overflow beyond the fixed height
//                 }}>
//                     {item.content}
//                 </div>
//                 {item.impact && (
//                     <div style={{
//                         marginTop: "4px",
//                         fontSize: "11px",
//                         color: "#718096",
//                         fontStyle: "italic"
//                     }}>
//                         Impact: {item.impact}
//                     </div>
//                 )}
//                 {item.tags && item.tags.length > 0 && (
//                     <div style={{ marginTop: "6px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
//                         {item.tags.map((tag, index) => (
//                             <span
//                                 key={index}
//                                 style={{
//                                     backgroundColor: "#edf2f7",
//                                     color: "#4a5568",
//                                     padding: "2px 6px",
//                                     borderRadius: "4px",
//                                     fontSize: "10px",
//                                     fontWeight: "500"
//                                 }}
//                             >
//                                 {tag}
//                             </span>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

type Props = {
    title: string;              // timeline title (used as group content)
    items: TimelineItem[];      // your real items
    options?: TimelineOptions;  // extra vis options
};

export default function SimplerTimelineWidget({ title, items, options }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<Timeline | null>(null);
    const itemsDSRef = useRef<DataSet<TimelineItem> | null>(null);
    const groupsDSRef = useRef<DataSet<DataGroup> | null>(null);
    const rootsMapRef = useRef<Map<Element, Root>>(new Map());

    useEffect(() => {
        if (!containerRef.current) return;

        // Dataset from your items
        itemsDSRef.current = new DataSet<TimelineItem>(
            items.map((it) => ({ ...it, group: 1 })) // assign group = 1
        );

        // Single group with the title
        groupsDSRef.current = new DataSet<DataGroup>([
            { id: 1, content: title },
        ]);

        timelineRef.current = new Timeline(
            containerRef.current,
            itemsDSRef.current,
            groupsDSRef.current,
            {
                orientation: "top",
                // maxHeight: 600,
                height: 600,
                stack: true,
                selectable: true,
                zoomKey: "ctrlKey",
                margin: {
                    item: {
                        horizontal: 10,
                        vertical: 10
                    }
                },
                ...(options || {}),
                template: (item, el) => {
                    if (!item || !el) return "";
                    let root = rootsMapRef.current.get(el);
                    if (!root) {
                        root = createRoot(el);
                        rootsMapRef.current.set(el, root);
                    }
                    root.render(<ItemTemplate item={item as TimelineItem} />);
                    return "";
                },
                groupTemplate: (group, el) => {
                    if (!group || !el) return "";
                    let root = rootsMapRef.current.get(el);
                    if (!root) {
                        root = createRoot(el);
                        rootsMapRef.current.set(el, root);
                    }
                    root.render(<GroupTemplate group={group} />);
                    return "";
                },
            }
        );

        const ro = new ResizeObserver(() => timelineRef.current?.redraw());
        ro.observe(containerRef.current);

        return () => {
            ro.disconnect();
            timelineRef.current?.destroy();
            timelineRef.current = null;
            for (const [el, root] of rootsMapRef.current.entries()) {
                root.unmount();
                rootsMapRef.current.delete(el);
            }
        };
    }, [title, items, options]);

    return <div ref={containerRef} style={{ width: "100%", height: 700, border: '2px red solid' }} />;
}
