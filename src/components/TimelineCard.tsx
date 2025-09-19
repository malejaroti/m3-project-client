import { useEffect, useState } from "react"
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import defaultAvatar from "../assets/default-avatar.jpg"
import Modal from "@mui/material/Modal"
import Fade from "@mui/material/Fade"
import Backdrop from "@mui/material/Backdrop"
import Button from "@mui/material/Button"
import Select, { type SelectChangeEvent } from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import OutlinedInput from "@mui/material/OutlinedInput"
import Chip from "@mui/material/Chip"
import MenuItem from "@mui/material/MenuItem"
import api from "../services/config.services"
import type { IUser } from "../pages/UserProfilePage"
import { FormHeader } from "./Forms/FormSubcomponents/FormStyledSubcomponents"
import Tooltip from "@mui/material/Tooltip"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
const styleModalBox = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type TimelineCardProps =
  | {
    timelineOwner: "loggedUser"
    timeline: ITimeline
    onClickEditButton: () => void
    handleClickOnDeleteButton: () => void
    allUsers: IUser[]
  }
  | {
    timelineOwner: "collaborator"
    timeline: ITimeline
    onClickEditButton: () => void
    allUsers: IUser[]

  }

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function TimelineCard(props: TimelineCardProps) {
  // if(props.timelineOwner === "collaborator"){
  //   console.log("props.timeline: ", props.timeline)
  //   console.log("props.timeline.owner: ", props.timeline.owner)
  // }
  // if(props.timelineOwner === "loggedUser"){
  //   console.log("props.timeline.collaborators: ", props.timeline.collaborators)
  // }

  const [openModal, setOpenModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);


  const collaboratorsNames = (props.timeline.collaborators ?? []).map(collaborator => collaborator.name);

  const usersToShowInSelect = props.allUsers
    .filter((user) => !(user.name === props.timeline.owner.name))
    .filter((user) => {
      // console.log(user.name, collaboratorsNames, collaboratorsNames.includes(user.name))
      return !collaboratorsNames.includes(user.name)
    })


  const handleAddCollaborator = async () => {
    // console.log(personName)
    const newCollaborators = props.allUsers.filter(user => selectedUsers.includes(user.name))
    console.log("new collaborators to be added:", newCollaborators)

    try {
      for (const collaborator of newCollaborators) {
        console.log("Collaborator ", collaborator)
        const response = await api.post(`timelines/${props.timeline._id}/collaborators`, { "_id": collaborator._id })
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const handleSelectChange = (event: SelectChangeEvent<typeof selectedUsers>) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Card sx={{ width: 300 }} key={props.timeline._id}>
        <CardActionArea component={Link} to={`/timeline/${props.timeline._id}`} sx={{ height: '100%' }} >
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
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', backgroundColor: '#e2e8f0' }}>
            <div className="flex items-center gap-[8px] mb-[10px] ">
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
                  <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' }, fontStyle: 'italic' }}>
                    Collaborators:
                  </Typography>
                  <div className="flex gap-3 ">
                    {
                      props.timeline.collaborators?.map((collaborator) => (
                        <div key={collaborator.name} className="flex flex-col">
                          <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' } }}>
                            {collaborator.name && (collaborator.name).split(" ", 1)}
                          </Typography>
                          <img src={collaborator?.profilePicture !== "" ? collaborator.profilePicture : defaultAvatar} alt="collaborator picture" className="w-[40px] border-1 border-slate-500 aspect-square rounded-full object-cover" />
                        </div>
                      ))
                    }
                  </div>
                </div>
              }
              {props.timelineOwner === "loggedUser" &&
              <Tooltip title="Add collaborator" arrow>
                <IconButton
                  aria-label="Add Collaborator"
                  // onMouseEnter={}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenModal(true);
                  }}
                  size="small"
                  sx={{
                    alignSelf: 'flex-end',
                    justifySelf: 'flex-end',
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
                </Tooltip>
              }

              {/* Owner box */}
              {
                props.timelineOwner === "collaborator" &&
                <div className="">
                  <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' }, fontStyle: 'italic' }}>
                    Owned by:
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '10px', md: '11px', lg: '13px' } }}>
                    {(props.timeline.owner?.name ?? 'Unknown owner').trim().split(" ", 1)}
                  </Typography>
                  <img src={props.timeline.owner?.profilePicture ? props.timeline.owner?.profilePicture : defaultAvatar} alt="owner picture" className="w-[40px] border-1 border-slate-500 aspect-square rounded-full object-cover" />
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
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        disableRestoreFocus
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={styleModalBox} className='flex flex-col items-center gap-5'>
            <div>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                ➕ Add Collaborator
              </Typography>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="users-selector-multiple-chip"
                  multiple
                  value={selectedUsers}
                  onChange={handleSelectChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {(usersToShowInSelect ?? []).map((user) => (
                    <MenuItem
                      key={user._id}
                      value={user.name}
                    // style={getStyles(name, personName, theme)}
                    >
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography id="transition-modal-description" sx={{ textAlign: 'left', ml: 2 }}>
                Are you sure you want to <b>add</b> these collaborators?<br />
              </Typography>
            </div>

            <div className='flex gap-10 mt-2 '>
              <Button variant='outlined' onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button variant='contained' onClick={handleAddCollaborator}>Add</Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}
export default TimelineCard