import './App.css';
import { Routes, Route } from 'react-router';
import SignUp from './sign-up/SignUp.tsx';
import SignIn from './sign-in/SignIn.tsx';

// import BorderBox from './components/BorderBox'
// import Footer from './components/Footer'
import Navbar from './components/Navbar';
import OnlyPrivate from './components/OnlyPrivate.tsx';
import TimelinesPage from './pages/TimelinesPage.tsx';
import TimelineItemsPage from './pages/TimelineItemsPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import Home from './pages/Home.tsx';
import LifeTimeline from './pages/LifeTimeline.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

// import Link from '@mui/material/Link'

function App() {
  return (
    <>
      <div className="flex min-h-screen bg-white-500">
        {/* Navbar */}
        <div className="flex flex-col flex-1">
          {/* <Navbar/> */}
          <Navbar />

          {/* Main container */}
          <main className="w-full flex-1 bb-red px-10">
            {/* <div className='central-section bb-black h-full w-[50%] m-auto'> */}
            <Routes>
              <Route path="/timelines" 
                      element={ <OnlyPrivate> {' '}
                                  <TimelinesPage />{' '}
                                </OnlyPrivate>
                }
              />
              <Route path="/timeline/:timelineId" element={<OnlyPrivate>{' '}<TimelineItemsPage />{' '} </OnlyPrivate>} />
              <Route path="/timeline/:timelineId" element={<OnlyPrivate>{' '}<TimelineItemsPage />{' '} </OnlyPrivate>} />
              <Route path="/lifetimeline" element={<OnlyPrivate> <LifeTimeline /> </OnlyPrivate>} />
              <Route path="/" element={<Home />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />

              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
              {/* <Route path="/about" element={<AboutPage />} /> */}

            </Routes>
            {/* </div> */}
          </main>
          {/* <BorderBox borderColor={"red"}>
            <main className='w-full flex-1 bb'>
            </main>
          </BorderBox> */}
          {/* <Footer/> */}
          <footer className="w-full h-[60px] bb-black"></footer>
        </div>
        {/* Main page */}
        {/* Footer */}
      </div>
    </>
  );
}

export default App;
