import { useEffect, useState } from 'react';
import api from '../services/config.services';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Link } from 'react-router';
import TimelineCard from '../components/TimelineCard';

export interface ITimeline {
  _id: string;
  owner: string;
  title: string;
  icon?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  collaborators?: string[];
  isPublic: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

function TimelinesPage() {
  const [userTimelines, setUserTimelines] = useState<ITimeline[]>([]);
  const [collaborationTimelines, setCollaborationTimelines] = useState<
    ITimeline[]
  >([]);

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

  return (
    <>
      <section className="user-timelines">
        <Typography variant="h4" component="h2">
          My timelines
        </Typography>
        <div className="flex gap-4 mt-5 border">
          {userTimelines.map((timeline) => (
            // {console.log(timeline)}
            <TimelineCard timeline={timeline}/>
          ))}
        </div>
      </section>
      <section className="collaboration-timelines">
        <Typography variant="h4" component="h2">
          Collaboration timelines
        </Typography>
        <div className="flex gap-4 mt-5">
          {collaborationTimelines.map((timeline) => (
            <TimelineCard timeline={timeline}/>
          ))}
        </div>
      </section>
    </>
  );
}
export default TimelinesPage;
