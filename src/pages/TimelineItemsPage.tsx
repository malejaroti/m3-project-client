import { useEffect, useState, Fragment, useCallback, useMemo } from 'react';
import api from '../services/config.services';
import { Link, useNavigate, useParams } from 'react-router';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import type { ITimeline } from './TimelinesPage';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ItemForm, { type FormType } from '../components/Forms/ItemForm';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import TimelineWidget, { type VisTimelineItem } from "../components/vis-timeline/VisTimelineWidget"
import FleetTimeline from "../components/vis-timeline/FleetTimeline";
import SimplerTimelineWidget from '../components/vis-timeline/simplerTimelineGptEx';
import AddButton from '../components/AddButton';
import DeleteModal from '../components/DeleteModal';



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

// Server timeline item model (normalized). Dates are ISO strings; arrays are plain string arrays.
export interface ITimelineItem {
  //Full server model
  _id: string;
  timeline: string;
  creator: string;
  // kind: string;
  title: string;
  description?: string;
  startDate: string; // ISO 8601 string
  endDate?: string; // ISO 8601 string
  images: string[]; // always an array; empty if none
  impact?: string;
  tags: string[]; // empty array if none
  isApproved: boolean; // server controlled
  comments: string[]; // empty array if none
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// DTO for creating a new item (exclude server-managed fields)
export type TimelineItemCreateDTO = Omit<
  ITimelineItem,
  '_id' | 'createdAt' | 'updatedAt' | 'isApproved' | 'comments'
>;

// DTO for updating an existing item (partial fields allowed)
export type TimelineItemUpdateDTO = Partial<TimelineItemCreateDTO>;

export type DrawerPosition = 'top' | 'left' | 'bottom' | 'right';
export interface DrawerState {
  position: DrawerPosition;
  open: boolean;
}
function TimelineItemsPage() {
  const [timelineDetails, setTimelineDetails] = useState<ITimeline>();
  const [timelineItems, setTimelineItems] = useState<ITimelineItem[]>([]);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<ITimelineItem | null>(null);
  const { timelineId } = useParams<{ timelineId: string }>();
  const [formType, setFormType] = useState<FormType>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    position: 'right',
    open: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const navigate = useNavigate()

  useEffect(() => {
    getTimelineDetails();
    getTimelineItems();
  }, []);

  const getTimelineDetails = async () => {
    try {
      const response = await api.get(`/timelines/${timelineId}`);
      console.log('timeline details', response);
      setTimelineDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTimelineItems = async () => {
    try {
      const response = await api.get(`/timelines/${timelineId}/items`);
      console.log('timeline items', response);
      setTimelineItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // useCallback keeps handler refs stable so children (e.g. <Button/Drawer>) don’t re-render unnecessarily
  // Without useCallback, a new function would be created on every render, which could cause avoidable updates.
  const openDrawerCreate = useCallback((position: DrawerPosition) => {
    setFormType('create');
    setSelectedTimelineItem(null);
    setDrawerState((prev) => ({ ...prev, position, open: true }));
  }, []);

  const openDrawerEdit = useCallback(
    (item: ITimelineItem, position: DrawerPosition) => {
      setFormType('edit');
      setSelectedTimelineItem(item);
      setDrawerState((prev) => ({ ...prev, position, open: true }));
    },
    []
  );

  const closeDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, open: false }));
  }, []);


  const handleClickOnTrashIcon = (item: ITimelineItem) => {
    setSelectedTimelineItem(item)
    setOpenModal(true)
  }

  const handleItemDelete = async () => {
    try {
      const response = await api.delete(`/timelines/${timelineId}/items/${selectedTimelineItem?._id}`);
      console.log('Res DELETE item: ', response);
      getTimelineItems()
      setOpenModal(false)
    } catch (error) {
      navigate('/error');
    }
  }

  let newArr = timelineItems.map((item, index) => (
    {
      id: index,
      content: item.title,
      start: item.startDate,
      end: item.startDate === item.endDate ? "" : item.endDate,
      group: timelineDetails?.title
    }
  ))
  // console.log("array items for timeline widget:", newArr)

  return (
    <>
      <main className="relative">
        <section className="gallery-timeline-items m-5">
          <Typography variant="h3" component="h2">
            {timelineDetails?.title}
          </Typography>
          <Typography variant="h5" color='' component="h2">
            {timelineDetails?.description}
          </Typography>
          {/* <Grid container spacing={3} sx={{ border: '1px black solid' }}>

          </Grid> */}

          <div className="flex flex-wrap justify-center gap-20 mt-10 lg:flex-row sm:flex-col">
            {timelineItems.map((timelineItem) => (
              <Card sx={{ maxWidth: 300, display: 'flex', flexDirection: 'column' }} key={timelineItem._id} className='p-5'>
                {/* <CardActionArea> */}
                {timelineItem.images.length !== 0 ?
                  <CardMedia
                    component="img"
                    image={
                      timelineItem.images && timelineItem.images.length > 0
                        ? timelineItem.images[0]
                        : undefined
                    }
                    alt="Timeline image"
                    sx={{
                      minHeight: 400,
                      objectFit: 'cover', //contain
                      backgroundColor: '#f5f5f5',
                      padding: '2px 10px'
                    }}
                  />
                  : ""
                }
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} className="">
                  <Typography gutterBottom variant="h5" component="div">
                    {timelineItem.title}
                  </Typography>
                  <Typography variant="body1"
                    sx={{
                      color: 'text.secondary',
                      paddingBottom: '5px'
                    }}>
                    {`${new Intl.DateTimeFormat('en-GB').format(
                      new Date(timelineItem.startDate)
                    )}`}
                    {timelineItem.startDate === timelineItem.endDate ? "" :
                      timelineItem.endDate
                        ? ` - ${new Intl.DateTimeFormat('en-GB').format(
                          new Date(timelineItem.endDate)
                        )}`
                        : ' - Present'}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: 'text.secondary',
                    // display: '-webkit-box',
                    // WebkitLineClamp: 2,
                    // WebkitBoxOrient: 'vertical',
                    // // overflowY: 'scroll',
                    // overflow: 'hidden',
                    // textOverflow: 'ellipsis'
                  }}>
                    {timelineItem.description}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    marginTop: 'auto',
                    alignSelf: 'flex-end',
                  }}
                    className="">
                    <IconButton
                      aria-label="Edit item"
                      onClick={() => openDrawerEdit(timelineItem, 'right')}
                      size="small"
                      sx={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="Delete item"
                      onClick={() => handleClickOnTrashIcon(timelineItem)}
                      size="small"
                      sx={{
                        alignSelf: 'flex-end',
                        justifySelf: 'flex-end',
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>

                  </Box>
                </CardContent>
                {/* </CardActionArea> */}
              </Card>
            ))}
          </div>
        </section>
        {/* <section>
          <h2>Timeline</h2>
          <TimelineWidget
              items={[...items]}
              // items={[...items, ...groupedItems]}
              // groups={groups}
              options={{
                  // Example: focus initial window
                  start: "2025-08-10",
                  end: "2025-09-10",
                  tooltip: { followMouse: true },
              }}
              onSelectIds={setSelected}
          />
          <p>Selected IDs: {selected.join(", ") || "none"}</p>
        </section> */}
        <section>
          {/* <h1>Timeline simpler</h1> */}
          {/* <FleetTimeline items={timelineItems} timelineTitle={timelineDetails?.title} /> */}
          {/* <SimplerTimelineWidget items={newArr} title={timelineDetails?.title ?? 'test'}/> */}
        </section>
        <AddButton onClick={() => openDrawerCreate('right')} buttonLabel='Add new item' />


        <div>
          <Drawer
            anchor={drawerState.position}
            open={drawerState.open}
            onClose={closeDrawer}
            sx={{
              '& .MuiDrawer-paper': {
                width: { xs: '90%', sm: 500, md: 600 },
              },
            }}
          >
            {formType === 'create' && timelineId && (
              <ItemForm
                formType="create"
                timelineId={timelineId.toString()}
                onSuccess={closeDrawer}
                onRefresh={getTimelineItems}
                onCancel={closeDrawer}
              />
            )}

            {formType === 'edit' && selectedTimelineItem && timelineId && (
              <ItemForm
                formType="edit"
                item={selectedTimelineItem}
                timelineId={timelineId.toString()}
                onSuccess={closeDrawer}
                onRefresh={getTimelineItems}
                onCancel={closeDrawer}
              />
            )}
          </Drawer>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openModal}
            onClose={() => setOpenModal(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={openModal}>
              <Box sx={styleModalBox} className='flex flex-col gap-5'>
                <div>
                  <Typography id="transition-modal-title" variant="h6" component="h2">
                    Are you sure?
                  </Typography>
                  <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    Are you sure you want to delete this item?
                    This action cannot be undone.
                  </Typography>
                </div>

                <div className='flex gap-10 '>
                  <Button variant='outlined' onClick={() => setOpenModal(false)}>Cancel</Button>
                  <Button variant='contained' onClick={handleItemDelete}>Delete</Button>
                </div>
                {/* <Box>
                    <Button>Cancel</Button>
                    <Button>Delete</Button>
                  </Box> */}
              </Box>
            </Fade>
          </Modal>
          {/* <DeleteModal modalState={openModal}  modalStateSetter={setOpenModal} handleDelete={handleItemDelete}/> */}
        </div>
      </main>
    </>
  );
}
export default TimelineItemsPage;
