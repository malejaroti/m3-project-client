import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/config.services";

import type { ITimeline } from "./TimelinesPage";
import type { ITimelineItem } from "./TimelineItemsPage";
import Typography from "@mui/material/Typography";

interface ITimelineWithItems {
    timelineTitle: string,
    items: ITimelineItem[]
}
function LifeTimeline() {
    const [timelinesWithItems, setTimelinesWithItems] = useState<ITimelineWithItems[]>();
    const [timelines, setTimelines] = useState<ITimeline[]>([]);
    const [state, setState] = useState("");
    const navigate = useNavigate()

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
            {timelinesWithItems?.map(element => {
                return (
                    <div key={element.timelineTitle}>
                        <h1>{element.timelineTitle}</h1>
                        {element.items.map((item) => (
                            <p key={item._id}>{item.title}</p>
                        ))}
                    </div>
                );
            })}
        </>
    )
}
export default LifeTimeline