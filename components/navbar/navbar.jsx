import './navbar.css'
import { useNavigate } from "react-router-dom";

const NavBar = () =>{
    const navigate = useNavigate();

    const navLinks = [
        {path: '/', label: 'home'},
        {path: '/about', label: 'about'},
        {path: '/learnMore', label: 'learnmore'}
    ]
    const handleClickLink = (e, path) =>{
        e.stopPropagation();
        // console.log('clicked')
        navigate(path === '/learnMore' ? '/' : path)
    }
    return(
        <>
        <div className="navbar-container">
            <div className='navbar'>
                {navLinks.map(({path, label}) => (
                    <div 
                    key={label}
                    className={location.pathname === path ? 'navbar-child-box-active' : 'navbar-child-box'}
                    onClick={(e) => handleClickLink(e, path)}
                    >
                        {label}
                    </div>
                ))}
                
            </div>
        </div>
        </>
    )
}
export default NavBar;