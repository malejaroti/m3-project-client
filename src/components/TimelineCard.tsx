import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { Link } from "react-router"
import { type ITimeline } from "../pages/TimelinesPage"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

type TimelineCardProps =
  | {
    timelineOnwer: "loggedUser"
    timeline: ITimeline
    onClickEditButton: () => void
    handleClickOnDeleteButton: () => void
  }
  | {
    timelineOnwer: "collaborator"
    timeline: ITimeline
    onClickEditButton: () => void
  }


function TimelineCard(props: TimelineCardProps) {
  return (
    <>
      <Card sx={{ maxWidth: 345 }} key={props.timeline._id}>
        <CardActionArea component={Link} to={`/timeline/${props.timeline._id}`}>
          <CardMedia
            component="img"
            height="140"
            image={props.timeline.icon}
            alt="Timeline image"
            sx={{
              maxHeight: 250,
              objectFit: 'cover', //contain
              backgroundColor: '#f5f5f5',
              padding: '2px 10px'
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.timeline.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {props.timeline.description}
            </Typography>
            <Box sx={{
              display: 'flex',
              marginTop: 'auto',
              alignSelf: 'flex-end',
            }}
              className="">
              {props.timelineOnwer === "loggedUser" &&
                <IconButton
                  aria-label="Edit item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.onClickEditButton();
                  }}
                  size="small"
                  sx={{
                    alignSelf: 'flex-end',
                    justifySelf: 'flex-end',
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              }

              {"handleClickOnDeleteButton" in props &&
                <IconButton
                  aria-label="Delete item"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.handleClickOnDeleteButton();
                  }}
                  size="small"
                  sx={{
                    alignSelf: 'flex-end',
                    justifySelf: 'flex-end',
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              }

            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}
export default TimelineCard