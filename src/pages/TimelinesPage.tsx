import { useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/config.services';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router';
import TimelineCard from '../components/TimelineCard';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import AddButton from '../components/AddButton';
import type { DrawerPosition, DrawerState } from './TimelineItemsPage';
import TimelineForm from '../components/TimelineForm';
import type { FormType } from '../components/Forms/ItemForm';
import { AuthContext } from '../context/auth.context';
import DeleteModal from '../components/DeleteModal';

export interface ITimeline {
  _id: string;
  owner: string;
  title: string;
  icon?: string;
  description?: string;
  startDate?: string; // calculated in backend
  endDate?: string;   // calculated in backend
  collaborators?: string[];
  isPublic: boolean;
  color?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// DTO for creating a new item (exclude server-managed fields)
export type TimelineCreateDTO = Omit<
  ITimeline,
  '_id' | 'startDate' | 'endDtate' | 'startDate' | 'createdAt' | 'updatedAt'
>;

function TimelinesPage() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('Timeline creation must be done within an AuthWrapper');
  }
  const { loggedUserId } = authContext;
  const [userTimelines, setUserTimelines] = useState<ITimeline[]>([]);
  const [collaborationTimelines, setCollaborationTimelines] = useState<ITimeline[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<ITimeline | null>(null);
  const [formType, setFormType] = useState<FormType>(null);
  const [openModal, setOpenModal] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    position: 'right',
    open: false,
  });
  const navigate = useNavigate()


  useEffect(() => {
    getUserTimelines();
    getCollaborationTimelines();
  }, []);

  const getUserTimelines = async () => {
    try {
      const response = await api.get('/timelines');
      // console.log("user timelines", response)
      setUserTimelines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCollaborationTimelines = async () => {
    try {
      const response = await api.get('/timelines/collaborations');
      // console.log('timelines collaborations', response);
      setCollaborationTimelines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const openDeleteModal = useCallback((timeline: ITimeline) => {
    setSelectedTimeline(timeline);
    setOpenModal(true)
  }, []);

  const openDrawerWithCreateForm = useCallback(() => {
    setFormType('create');
    setSelectedTimeline(null);
    setDrawerState((prev) => ({ ...prev, open: true }));
  }, []);

  const openDrawerWithEditForm = useCallback(
    (timeline: ITimeline) => {
      setFormType('edit');
      setSelectedTimeline(timeline);
      setDrawerState((prev) => ({ ...prev, open: true }));
    },
    []
  );

  const closeDrawer = useCallback(() => {
    setDrawerState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleTimelineDelete = async () => {
    try {
      const response = await api.delete(`/timelines/${selectedTimeline?._id}`);
      console.log('Res DELETE item: ', response);
      getUserTimelines()
      setOpenModal(false)
    } catch (error) {
      navigate('/error');
    }
  }

  return (
    <main className='relative'>
      <section className="user-timelines">
        <Typography variant="h4" component="h2">
          My timelines
        </Typography>
        <div className="timelines-container border">
          {userTimelines.map((timeline) => (
            // {console.log(timeline)}
            <TimelineCard
              key={timeline._id}
              timelineOnwer={timeline.owner === loggedUserId ? "loggedUser" : "collaborator"}
              timeline={timeline}
              onClickEditButton={() => openDrawerWithEditForm(timeline)}
              handleClickOnDeleteButton={() => openDeleteModal(timeline)}
            />
          ))}
        </div>
      </section>
      <section className="collaboration-timelines">
        <Typography variant="h4" component="h2">
          Collaboration timelines
        </Typography>
        <div className="timelines-container">

          {collaborationTimelines.map((timeline) => (
            <TimelineCard
              key={timeline._id}
              timelineOnwer="collaborator"
              timeline={timeline}
              onClickEditButton={() => openDrawerWithEditForm(timeline)} />
          ))}
        </div>
      </section>
      <AddButton onClick={() => openDrawerWithCreateForm()} buttonLabel='Add new timeline' />

      <Drawer
        anchor={drawerState.position}
        open={drawerState.open}
        onClose={(_, __) => setDrawerState((prev) => ({ ...prev, open: false }))}
        // onClose={closeDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90%', sm: 500, md: 600 },
          },
        }}
      >
        {formType === 'create' && (
          <TimelineForm
            formType="create"
            onSuccess={closeDrawer}
            onRefresh={getUserTimelines}
            onCancel={closeDrawer}
          />
        )}

        {formType === 'edit' && selectedTimeline && (
          <TimelineForm
            formType="edit"
            timeline={selectedTimeline}
            onSuccess={closeDrawer}
            onRefresh={getUserTimelines}
            onCancel={closeDrawer}

          />
        )}
      </Drawer>
      <DeleteModal modalState={openModal} modalStateSetter={setOpenModal} handleDelete={handleTimelineDelete} modalMessage={"timeline"} />
    </main>
  );
}
export default TimelinesPage;
