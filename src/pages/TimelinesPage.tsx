import { useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/config.services';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';
import TimelineCard from '../components/TimelineCard';
import Drawer from '@mui/material/Drawer';
import AddButton from '../components/AddButton';
import type { DrawerState } from './TimelineItemsPage';
import TimelineForm from '../components/Forms/TimelineForm';
import type { FormType } from '../components/Forms/ItemForm';
import { AuthContext } from '../context/auth.context';
import DeleteModal from '../components/DeleteModal';
import { CardsContainer } from '../components/styled/CardsContainer'
import type { IUser } from './UserProfilePage';
export interface ITimeline {
  _id: string;
  owner: IUser;
  title: string;
  icon?: string;
  description?: string;
  startDate?: string; // calculated in backend
  endDate?: string;   // calculated in backend
  collaborators?: IUser[];
  isPublic: boolean;
  color?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Payload for creating a new timeline (server expects ids, not populated objects)
export type TimelineCreatePayload = {
  owner: string;               // owner id
  title: string;
  icon?: string;
  description?: string;
  collaborators?: string[];    // collaborator ids
  isPublic: boolean;
  color?: string;
};

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
  const [usersData, setUsersData] = useState<IUser[] | null>(null);
  const navigate = useNavigate()
    
    
  useEffect(() => {
    getUserTimelines();
    getCollaborationTimelines();
    getUsersData();

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

  const getUsersData = async () => {
      try {
      const response = await api.get('/users');
      console.log("All users data", response)
      setUsersData(response.data);
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
    <main className='relative flex flex-col gap-8 m-auto'>
      <section className="user-timelines">
        <Typography variant="h3" component="h2">
          My timelines
        </Typography>
        <CardsContainer>
          {userTimelines.map((timeline) => (
            // {console.log(timeline)}
            <TimelineCard
              key={timeline._id}
              timelineOwner={timeline.owner._id === loggedUserId ? "loggedUser" : "collaborator"}
              timeline={timeline}
              onClickEditButton={() => openDrawerWithEditForm(timeline)}
              handleClickOnDeleteButton={() => openDeleteModal(timeline)}
              allUsers={usersData ?? []}
            />
          ))}
        </CardsContainer>
      </section>
      <section className="collaboration-timelines">
        <Typography variant="h3" component="h2">
          Collaboration timelines
        </Typography>
        <CardsContainer>
          {collaborationTimelines.map((timeline) => (
            <TimelineCard
              key={timeline._id}
              timelineOwner="collaborator"
              timeline={timeline}
              onClickEditButton={() => openDrawerWithEditForm(timeline)} 
              allUsers={usersData ?? []}

            />
          ))}
        </CardsContainer>
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
