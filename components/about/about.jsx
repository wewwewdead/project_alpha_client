import NavBar from "../navbar/navbar";
import './about.css'
import Footer from "../footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const About = () =>{
    const navigate = useNavigate()
    const clickLink = (e) =>{
        e.stopPropagation();
        navigate('/')
    }

    useEffect(() =>{
        window.scrollTo(0, 0)
    }, [])

    return(
        <>
        <NavBar/>
        <div className="about-main-container">
            <div className="about-header">
                <h1 className="header-text">
                    Turn Paper into Data.
                </h1>
                <h1 className="header-text">Instantly</h1>
            </div>

            <div onClick={(e) => {clickLink(e)}} className="try-bttn">
                TRY GRIDAI NOW 
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"/></svg>
            </div>

            <div className="arrow-down">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#ffffff"><path d="M480-240 240-480l56-56 144 144v-368h80v368l144-144 56 56-240 240Z"/></svg>
            </div>

            <div className="about-page-content">
                <div className="about-cards">
                    <h2>[ WHY I BUILT THIS ]</h2>

                    <p>This project was born from a real problem.</p>
                    <p>My brother is a engineer and working on a documents with machine logs, he asked if there's any tools available to extract
                    the image of a tabulated data into a spreadsheet.
                    </p>
                    <p>I realized: <span>This is a job for AI.</span></p>
                    <p>I set out to build something that is SIMPLE, ACCESSIBLE AND POWERFUL.</p>
                </div>
                <div className="about-cards">
                    <h2>[ MISSION AND VISION ]</h2>
                    <p style={{fontWeight: 'bold'}}>MISSION</p>
                    <p>To empower individuals and businesses to reclaim their time, reduce errors, and unlock the value
                        of their offline data using POWERFUL AI MODELS.
                    </p>
                    <p style={{fontWeight: 'bold'}}>VISION</p>
                    <p>A world where AI bridges the gap between the physical and digital, removing tedious and boring tasks.
                    </p>
                </div>
                <div className="about-cards">
                    <h2>[ WHO IT'S FOR ]</h2>
                    <p>1. Teachers encoding grades.</p>
                    <p>2. Students doing research</p>
                    <p>3. Small businesses processing forms</p>
                    <p>4. Maintenance teams updating checklist</p>
                    <p>5. Anyone tired of typing tables manually.</p>
                </div>
            </div>
            <Footer/>
        </div>
        </>
    )
}
export default About;