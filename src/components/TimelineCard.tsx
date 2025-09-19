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
import defaultAvatar from "../assets/default-avatar.jpg"


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

type TimelineCardProps =
  | {
    timelineOwner: "loggedUser"
    timeline: ITimeline
    onClickEditButton: () => void
    handleClickOnDeleteButton: () => void
  }
  | {
    timelineOwner: "collaborator"
    timeline: ITimeline
    onClickEditButton: () => void
  }

function TimelineCard(props: TimelineCardProps) {
  if(props.timelineOwner === "collaborator"){
    console.log("props.timeline: ", props.timeline)
    console.log("props.timeline.owner: ", props.timeline.owner)
  }
  // if(props.timelineOwner === "loggedUser"){
  //   console.log("props.timeline.collaborators: ", props.timeline.collaborators)
  // }

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
              {/* Timeline icon */}
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


            <Box sx={{
              display: 'flex',
              // flexGrow: 1,
              height: '100%',
              marginTop: '25px',
              alignSelf: 'flex-end',
              justifyContent: 'space-between',
              // borderTop: '2px dashed gray',
              width: '100%',
              // background: 'red'
            }}
              className=""
            >
              {/* Collaborators box */}
              {
                props.timelineOwner === "loggedUser" && props.timeline.collaborators && props.timeline.collaborators.length > 0 &&
                <div className="collaborators-box flex flex-col gap-3">
                  <Typography sx={{fontSize:{xs:'10px', md:'11px', lg:'13px' }, fontStyle:'italic'}}>
                    Collaborators:
                  </Typography>
                  <div className="flex gap-3 ">
                  {
                    props.timeline.collaborators?.map((collaborator) => (
                      <div key={collaborator.name} className="flex flex-col">
                        <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' } }}>
                          {collaborator.name && (collaborator.name).split(" ", 1)}
                        </Typography>
                        <img src={collaborator?.profilePicture !== ""? collaborator.profilePicture : defaultAvatar } alt="collaborator picture" className="w-[40px] border-1 border-slate-500 aspect-square rounded-full object-cover" />
                      </div>
                    ))
                  }

                  </div>
                </div>
              }

              {/* Owner box */}
              {
                props.timelineOwner === "collaborator" &&
                <div className="">
                  <Typography sx={{fontSize:{xs:'10px', md:'11px', lg:'13px' }, fontStyle:'italic'}}>
                    Owned by:
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' } }}>
                    {(props.timeline.owner?.name ?? 'Unknown owner').trim().split(" ", 1)}
                  </Typography>
                  <img src={props.timeline.owner?.profilePicture? props.timeline.owner?.profilePicture :  defaultAvatar} alt="owner picture" className="w-[40px] border-1 border-slate-500 aspect-square rounded-full object-cover" />
                  {/* <img src={props.timeline.owner?.profilePicture} alt="owner picture" className="w-[40px] border-1 border-slate-500 aspect-square rounded-full object-cover" /> */}
                </div>
              }

              {/* Box with icons */}
              <Box sx={{ mt: 'auto', ml: 'auto' }}>
                {props.timelineOwner === "loggedUser" &&
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

            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  )
}
export default TimelineCard