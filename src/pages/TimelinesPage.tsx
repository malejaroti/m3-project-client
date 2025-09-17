import { useCallback, useEffect, useState } from 'react';
import api from '../services/config.services';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import TimelineCard from '../components/TimelineCard';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import AddButton from '../components/AddButton';
import type { DrawerPosition, DrawerState } from './TimelineItemsPage';
import TimelineForm from '../components/TimelineForm';
import type { FormType } from '../components/ItemForm';

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
  const [userTimelines, setUserTimelines] = useState<ITimeline[]>([]);
  const [collaborationTimelines, setCollaborationTimelines] = useState<ITimeline[]>([]);
  const [selectedTimelineItem, setSelectedTimeline] = useState<ITimeline | null>(null);
  const [formType, setFormType] = useState<FormType>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>({
    position: 'right',
    open: false,
  });


  useEffect(() => {
    getUserTimelines();
    getCollaborationTimelines();
  }, []);

  const getUserTimelines = async () => {
    try {
      const response = await api.get('/timelines');
      // console.log("timelines", response)
      setUserTimelines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCollaborationTimelines = async () => {
    try {
      const response = await api.get('/timelines/collaborations');
      console.log('timelines collaborations', response);
      setCollaborationTimelines(response.data);
    } catch (error) {
      console.log(error);
    }
  };
    const openDrawerWithCreateForm = useCallback(() => {
      setFormType('create');
      setSelectedTimeline(null);
      setDrawerState((prev) => ({ ...prev, open: true }));
    }, []);

    const closeDrawer = useCallback(() => {
      setDrawerState((prev) => ({ ...prev, open: false }));
    }, []);

  return (
    <main className='relative'>
      <section className="user-timelines">
        <Typography variant="h4" component="h2">
          My timelines
        </Typography>
        <div className="timelines-container border">
          {userTimelines.map((timeline) => (
            // {console.log(timeline)}
            <TimelineCard timeline={timeline} />
          ))}
        </div>
      </section>
      <section className="collaboration-timelines">
        <Typography variant="h4" component="h2">
          Collaboration timelines
        </Typography>
        <div className="timelines-container">
          {collaborationTimelines.map((timeline) => (
            <TimelineCard timeline={timeline} />
          ))}
        </div>
      </section>
      <AddButton onClick={() => openDrawerWithCreateForm()} buttonLabel='Add new timeline'/>

      <Drawer
        anchor={drawerState.position}
        open={drawerState.open}
        // onClose={closeDrawer}
        onClose={(_, __) => setDrawerState((prev) => ({ ...prev, open: false }))}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '90%', sm: 500, md: 600 },
          },
        }}
      >
        <TimelineForm formType={"create"} onRefresh={getUserTimelines} onSuccess={closeDrawer}/>
        {/* {formType === 'create' && timelineId && (
          <ItemForm
            formType="create"
            timelineId={timelineId.toString()}
            onSuccess={closeDrawer}
            onRefresh={getTimelineItems}
          />
        )}

        {formType === 'edit' && selectedTimelineItem && timelineId && (
          <ItemForm
            formType="edit"
            item={selectedTimelineItem}
            timelineId={timelineId.toString()}
            onSuccess={closeDrawer}
            onRefresh={getTimelineItems}
          />
        )} */}
      </Drawer>
    </main>
  );
}
export default TimelinesPage;
