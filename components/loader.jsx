import { useEffect } from 'react';
import { useRef } from 'react';
import Loader from 'react-top-loading-bar';

const LoaderComponent = ({isConverting}) =>{
    const loaderRef = useRef(null)

    useEffect(() => {
        if(!isConverting){
            loaderRef.current.complete();
        } else {
            loaderRef.current.continuousStart();
        }
    }, [isConverting])
    return(
        <>
        <div className="loader-container">
            <Loader className="custom-loader" ref={loaderRef} color="#f11946" height={4}/>
            <div className='loader-message-container'>
                <p>Please wait!! The AI is converting your image into csv and xlsx...</p>
            </div>     
        </div>
        </>
    )
}
export default LoaderComponent;