import { useEffect, useState } from "react";
import api from "../services/config.services";
import { Link, useParams } from "react-router";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import type { ITimeline } from "./TimelinesPage";

export interface ITimelineItem{
  _id: string;
  timeline: string;
  creator: string;
  kind: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  images?: [string]
  impact?: string;
  tags?: [string];
  isApproved?: Boolean,
  comments?: [string],  
  createdAt: Date; // added automatically
  updatedAt: Date; // added automatically
}

function TimelineItemsPage() {
    const [timelineDetails, setTimelineDetails] = useState<ITimeline>();
    const [timelineItems, setTimelineItems] = useState<ITimelineItem[]>([]);
    const { timelineId } = useParams<{ timelineId: string }>();
    useEffect(() => {
    getTimelineDetails()
    getTimelineItems()
    }, [])

    const getTimelineDetails = async () => {
      try {       
          const response = await api.get(`/timelines/${timelineId}`)
          console.log("timeline details", response)
          setTimelineDetails(response.data)
      } catch (error) {
          console.log(error)
      }
    }
    
    const getTimelineItems = async () => {
      try {
          
          const response = await api.get(`/timelines/${timelineId}/items`)
          console.log("timeline items", response)
          setTimelineItems(response.data)
      } catch (error) {
          console.log(error)
      }
    }

  return (
    <>
    <section className="user-timelines">
        <Typography variant="h4" component="h2">
          { timelineDetails.title}
        </Typography>
        <div className="flex gap-4 mt-5">
          { timelineItems.map((timelineItem) => (
            <Card sx={{ maxWidth: 345 }} key={timelineItem._id}>
              <CardActionArea component={Link} to="/timeline/:timelineId">
                <CardMedia
                  component="img"
                  height="140"
                  image={timelineItem.images && timelineItem.images.length > 0 ? timelineItem.images[0] : undefined}
                  alt="Timeline image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {timelineItem.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {timelineItem.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        }
        </div>
      </section>
    </>
  )
}
export default TimelineItemsPage