import { useEffect, useState } from 'react';
import './App.css';
import Footer from './components/footer';
import Home from './components/home';
import Nav from './components/nav';
// import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";


import { Resizable } from "re-resizable";


const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
};

function App() {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // this is a hook to check the window size
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className="App">
         <div className='flex flex-col  gap-4 m-2'>
            <div className='flex gap-4 flex-col lg:md:xl:flex-row'>
              <Resizable
                style={style}
                size={{
                  width: windowWidth > 1280 ? '12vw' : '100vw', height: windowWidth > 1280 ? '80vh' : '12vh'
                }}>
                  <Nav />
              </Resizable>
              <Resizable
                style={style}
                defaultSize={{  width: windowWidth > 1280 ?  "85vw" : '100vw',  height: '80vh'}}>
                    <Home/>
              </Resizable>
            </div>
              <Resizable
                style={style}
                defaultSize={{width: '98vw',height: '20vh'}}>
                  <Footer/>
              </Resizable>
          </div>
    </div>
  );
}

export default App;
