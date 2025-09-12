import './App.css'
import BorderBox from './components/BorderBox'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <div className="flex min-h-screen bg-white-500 dark:bg-gray-500">
        {/* Navbar */}
        <div className="flex flex-col flex-1">
          {/* <Navbar/> */}
          <nav className="h-[95px] w-full border-2 border-mint-500"></nav>
          {/* Main container */}
          <main className='w-full flex-1 bb-red'>
            <div className='central-section bb-black h-full w-[50%] m-auto'>

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
