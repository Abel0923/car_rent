import './App.css';
import Footer from './components/footer';
import Home from './components/home';
import Nav from './components/nav';

function App() {
  return (
    <div className="App">
      <div className='flex gap-4 flex-col md:flex-row lg:flex-row'>
        <Nav/>
        <Home/>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
