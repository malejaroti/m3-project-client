import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/config.services';
import { Link, useNavigate, useParams } from 'react-router';
import Typography from '@mui/material/Typography';
import type { ITimeline } from './TimelinesPage';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import ItemForm, { type FormType } from '../components/Forms/ItemForm';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import TimelineWidget, { type VisTimelineItem } from "../components/vis-timeline/VisTimelineWidget"
import FleetTimeline from "../components/vis-timeline/FleetTimeline";
import SimplerTimelineWidget from '../components/vis-timeline/simplerTimelineGptEx';
import AddButton from '../components/AddButton';
import DeleteModal from '../components/DeleteModal';
import TimelineItemCard from '../components/TimelineItemCard';



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
  const visTimelineContainerRef =  useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate()

  useEffect(() => {
    getTimelineDetails();
    getTimelineItems();
  }, []);

  useEffect(() => {
    const visTimelineContainer = visTimelineContainerRef.current;
    console.log(visTimelineContainer)

  }, [])
  

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
      <main className="relative h-full flex flex-col  py-2 px-5 gap-10">
        <section className="gallery-timeline-items">
          <Box sx={{
            display:'flex',
            justifyContent:'space-between'
          }}>
            <Stack>
              <Typography variant="h4">
                {timelineDetails?.title.toUpperCase()}
              </Typography>
              <Typography variant="h6">
                {timelineDetails?.description}
              </Typography>
            </Stack>

            <Stack direction={"row"} spacing={2} sx={{ alignItems: 'center'}} >
              <Box borderRadius={1} 
                   sx={{ p: 1, display:'flex', alignItems:'center', textAlign:'center', border: '1px solid grey' }}
              >
                {`${timelineItems.length} items`}
              </Box>

              <AddButton onClick={() => openDrawerCreate('right')} buttonLabel='Add new item' />

            </Stack>

          </Box>

          <div className=" max-w-full flex overflow-x-scroll justify-left gap-10 mt-5 lg:flex-row sm:flex-col max-h-[600px] rounded-md border-1 border-slate-200 p-2 ">
            {timelineItems.map((timelineItem) => (
              <TimelineItemCard
                timelineItem={timelineItem}
                callbackOnClickEdit={() => openDrawerEdit(timelineItem, 'right')}
                callbackOnClickTrash={() => handleClickOnTrashIcon(timelineItem)}
              ></TimelineItemCard>
            ))}
          </div>
        </section>


        <section className='border flex-1 '>
            <div ref={visTimelineContainerRef} className=' border bg-sky-300'>
              
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
      </main>

      <div>
          <Drawer
            anchor={drawerState.position}
            open={drawerState.open}
            onClose={closeDrawer}
            sx={{
              '& .MuiDrawer-paper': {
                overflowY:'scroll',
                // minHeight:'1600px',
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
    </>
  );
}
export default TimelineItemsPage;
