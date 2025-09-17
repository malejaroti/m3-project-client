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


const responsiveFontSize = {
  // fontStyle: 'italic',
  fontSize: '1rem',
  '@media (min-width: 1800px)': {
    fontSize: '1.2rem', // Dell monitor (1920px+)
  },
  '@media (max-width: 1799px) and (min-width: 1536px)': {
    fontSize: '1.1rem', // HP laptop (1706px)
  },
}

function TimelineCard(props: TimelineCardProps) {
  return (
    <>
      <Card sx={{ width: 300 }} key={props.timeline._id}>
        <CardActionArea component={Link} to={`/timeline/${props.timeline._id}`}>
          {/* { props.timeline.icon === "" 
            ? <CardMedia
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
            : ""
        } */}
          <CardContent>
            <div className="flex items-center gap-[8px] mb-[10px]">
              {props.timeline.icon && props.timeline.icon !== ""
                ? <img src={props.timeline.icon} alt="timeline icon" className="size-[50px]" />
                : null
              }
              <Typography variant="h4" className="self-center">
                {props.timeline.title}
              </Typography>

            </div>
            <Typography variant="body1"
              sx={responsiveFontSize}
            >
              {props.timeline.description}
            </Typography>

            {/* Icon buttons section  */}
            <Box sx={{
              display: 'flex',
              marginTop: 'auto',
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              // border:1
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