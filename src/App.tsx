import './App.css'
import { Routes, Route, Link } from 'react-router'
import SignUp from "./sign-up/SignUp.tsx"


import BorderBox from './components/BorderBox'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
// import Link from '@mui/material/Link'


function App() {

  return (
    <>
      <div className="flex min-h-screen bg-white-500 dark:bg-gray-500">
        {/* Navbar */}
        <div className="flex flex-col flex-1">
          {/* <Navbar/> */}
          <nav className="h-[95px] w-full border-2 border-mint-500">
            <ul>
              <Link to={"/sign-up"}>Sign up</Link>
            </ul>
          </nav>
          {/* Main container */}
          <main className='w-full flex-1 bb-red'>
            <div className='central-section bb-black h-full w-[50%] m-auto'>
            <Routes>
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/sign-up" element={<SignUp />} />

              {/* <Route path="/about" element={<AboutPage />} /> */}

              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
            </div>
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
