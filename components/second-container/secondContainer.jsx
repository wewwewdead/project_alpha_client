import './2ndcontainer.css'

const SecondContainer = () =>{
    return(
        <>
        <div className='second-container'>
        <div className="space-1">
            <h1 style={{color: 'rgb(255, 255, 255)'}} className="heading-1">
                AI for creativity
            </h1>
            
        </div>
        <div className='space-2'>
            <div className='cards-container'>
                <div className='cards'>
                    <div className='card-content'>
                        <h3 style={{color: 'rgb(255, 255, 255)'}}>Webapp architechture</h3>
                        <p className='content-message'>
                            1. User uploads a scanned or written table image.  
                        </p>
                        <p className='content-message'>2. Send the image to the backend.</p>
                        <p className='content-message'>3. Backend sends the image into multimodal LLM(GEMINI PRO 2.5)</p>
                        <p className='content-message'>4. Get the structured data csv then show it to the frontend.</p>
                        <p className='content-message'>5. Show editable table to users and downdload button for CSV and XLSX.</p>
                    </div>
                </div>

                <div className='cards'>
                    <div className='card-content'>
                        <h3 style={{color: 'rgb(255, 255, 255)'}}>GRIDAI</h3>
                        <p className='content-message'>GRIDAI is your smart table extraction assistant, accurately extracting structured data from diverse table formats, including both crisp printed tables and challenging handwritten ones.</p>
                    </div>
                </div>

                <div className='cards'>
                    <div className='card-content'>
                        <h3 style={{color: 'rgb(255, 255, 255)'}}>Real Problems sovled</h3>
                        <p className='content-message'>Manual data entry from paper documents, printed tables, or handwritten forms into spreadsheet or excel.</p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
        </>
    )
}
export default SecondContainer;