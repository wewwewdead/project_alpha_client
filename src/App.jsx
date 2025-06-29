import './App.css'
import Home from '../components/home'
import About from '../components/about/about'
import { Routes, Route, useLocation} from 'react-router-dom'
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  
  useEffect(() =>{
    //add or remove the about-bg class based on the current route location 
    if(location.pathname === '/about'){
      document.body.classList.add('about-bg')
    } else {
      document.body.classList.remove('about-bg');
    }
  }, [location])

 return(
  <>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
  </Routes>
  </>
 )
}
export default App
