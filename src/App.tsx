import './App.css'
import { Routes, Route, Link } from 'react-router'
import SignUp from "./sign-up/SignUp.tsx"
import SignIn from "./sign-in/SignIn.tsx"


import BorderBox from './components/BorderBox'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import TimelinesPage from './pages/TimelinesPage.tsx'
// import Link from '@mui/material/Link'


function App() {

  return (
    <>
      <div className="flex min-h-screen bg-white-500">
        {/* Navbar */}
        <div className="flex flex-col flex-1">
          {/* <Navbar/> */}
          <nav className="h-[95px] w-full border-2 justify-center items-center  border-mint-500">
            <ul className='flex justify-around border-2'>
              <Link to={"/timelines"}>Timelines</Link>
              <Link to={"/sign-up"}>Sign up</Link>
              <Link to={"/sign-in"}>Sign in</Link>
            </ul>
          </nav>
          {/* Main container */}
          <main className='w-full flex-1 bb-red'>
            {/* <div className='central-section bb-black h-full w-[50%] m-auto'> */}
            <Routes>
              <Route path="/timelines" element={<TimelinesPage />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />

              {/* <Route path="/about" element={<AboutPage />} /> */}

              {/* <Route path="*" element={<NotFoundPage />} /> */}
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
  )
}

export default App
