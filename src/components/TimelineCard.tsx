import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"
import {type ITimeline } from "../pages/TimelinesPage"

type TimelineCardProps = {
    timeline: ITimeline
}
function TimelineCard({timeline} : TimelineCardProps) {
  return (
    <>
        <Card sx={{ maxWidth: 345 }} key={timeline._id}>
            <CardActionArea component={Link} to={`/timeline/${timeline._id}`}>
            <CardMedia
                component="img"
                height="140"
                image={timeline.icon}
                alt="Timeline image"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {timeline.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {timeline.description}
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
    </>
  )
}
export default TimelineCard