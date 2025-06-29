import { useState } from "react";
import { useRef } from "react";
import './home.css';
import NavBar from "./navbar/navbar";
import { uploadImage } from "../api/api";
import Footer from "./footer";
import LoaderComponent from "./loader";
import Loader from 'react-top-loading-bar';
// import { DataGrid } from "react-data-grid";
import 'react-data-grid/lib/styles.css';
import Papa from "papaparse"; // for CSV parsing
import * as XLSX from 'xlsx'; //for parsing objects into xlsx

import { AnimatePresence, motion } from "framer-motion";

import SecondContainer from "./second-container/secondContainer";

// import { AnimatePresence, motion } from "framer-motion";

import { DataGrid } from '@mui/x-data-grid';
import { useEffect } from "react";

const Home = () =>{
    const [errorMessage, setErrorMessage] = useState('')

    const [file, setFile] = useState(null)

    const fileRef = useRef(null);
    const tableRef = useRef(null);

    const [isConverting, setIsConverting] = useState(false);
    const [showSideMssg, setShowSideMssg] = useState(true);

    const [imagePreview, setImagePreview] = useState('')
    const [showCloseBttn, setShowCloseBttn] = useState(false);
    const [rows, setRows] = useState([]); // state for table rows
    const [columns, setColumns] = useState([]); // state for table columns
    const [csvDownload, setCsvDownload] = useState(null)

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const formdata = new FormData();

        if(!file){
            setErrorMessage('Please upload a photo first')
            return;
        }
        setIsConverting(true);
        formdata.append('image', file);
        try {
            // loaderRef.current.continuousStart();

            const data = await uploadImage(formdata)
            if(data && data.csvData){
                console.log(data.csvData)
                console.log("Type of csvData:", typeof data.csvData);
                console.log("Is Blob:", data.csvData instanceof Blob);
                console.log("Is string:", typeof data.csvData === 'string');
                console.log("csvData preview:", data.csvData.slice(0, 100)); 

                //convert blob to text
                const csvData = data.csvData.replace(/^\uFEFF/, '').trim();
                setCsvDownload(csvData); //set csv file to download
                //parse csv data           

                Papa.parse(csvData, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        const parsedData = result.data;

                        if (!parsedData || parsedData.length === 0) {
                            setErrorMessage("CSV is empty or invalid");
                            return;
                        }

                        const firstRow = parsedData[0];
                        const cleanedKeysMap = {};
                        //map original column names to clean keys
                        Object.keys(firstRow).forEach((key) =>{
                            const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
                            cleanedKeysMap[key] = cleanKey
                        })

                        console.log(parsedData)
                        const keys = Object.keys(parsedData[0] || {});

                        console.log("Detected Columns:", keys);
                        if (keys.length === 0) {
                            setErrorMessage("No valid headers detected in CSV");
                            return;
                        }

                        //generate columns froms csc headers
                        const csvColumns = Object.entries(cleanedKeysMap).map(([original, clean]) => ({
                            field: clean,
                            name: original,
                            editable: true,
                            width: 180
                        }));
                        
                        //generate rows from csc headers
                        const cleanedRows = parsedData.map((row, index) => {
                            const newRow = {id: index};
                            for (const key in row) {
                                const cleanKey = cleanedKeysMap[key];
                                newRow[cleanKey] = row[key];
                            }
                            return newRow;
                        });

                        setColumns(csvColumns);
                        setRows(cleanedRows);

                        console.log("Final columns:", csvColumns);
                        console.log("Final rows:", cleanedRows);

                    },
                    error: (error) => {
                        console.error("CSV parsing error:", error);
                        setErrorMessage("Failed to parse CSV data");
                    },
                });

                
            }
        } catch (error) {
            console.error("Upload error:", error.message);
        } finally {
            setErrorMessage('')
            setIsConverting(false)
            // loaderRef.current.complete();
        }
    }

    const handleClickUpload = (e) => {
        e.stopPropagation();
        if(fileRef.current){
            setRows([])
            setColumns([])
            setImagePreview('')
            setErrorMessage('')
            setCsvDownload(null)
            fileRef.current.click();
        }
    }

    const handleImageChange = (e) =>{// handle the file uploaded by the users and this will be triggered by onchange() on input element
        e.preventDefault();
        const selectedFile = e.target.files[0];
        if(selectedFile && selectedFile instanceof File){
            setFile(selectedFile);
            setShowSideMssg(false)
            const reader = new FileReader();
            reader.onloadend = () =>{
                setImagePreview(reader.result)
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setShowSideMssg(true)
            setImagePreview('')
            setFile(null)
        }
    }

    const closeImgPreview = (e) => {
        e.stopPropagation();
        setRows([])
        setColumns([])
        setImagePreview('')
        setFile(null)
        setShowSideMssg(true)
        setCsvDownload(false)
    }

    // const onRowsChange = (newRows) =>{ //handle cell edits
    //     setRows(newRows);
    // }

    const downloadCsv = (e) => {
        e.preventDefault();
        if(!rows || rows.length === 0){
            setErrorMessage('no data to download')
            return;
        }
        const csvString = Papa.unparse(rows);

        const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8'});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.href = url; //set the HTML anchor element to url 
        link.setAttribute("download", 'data.csv');
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url); //explicitly unload the the file after it was downloaded to save memory
    }

    const downloadXlsx = (e) =>{
        e.preventDefault();
        if(!rows || rows.length === 0){
            setErrorMessage('no data to download');
            return
        }
        //convert rows (array of objects) into worksheet
        const worksheet = XLSX.utils.json_to_sheet(rows);

        //append the worksheet into workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "sheet1")

        //generate buffer
        const xlsxBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: "array",
        });

        //trigger download
        const blob = new Blob([xlsxBuffer], {type: "application/octet-stream"})
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.href = url;
        link.setAttribute('download', 'data.xlsx')
        document.body.appendChild(link)

        link.click();

        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }


    useEffect(() =>{
        window.scrollTo(0, 0)
    }, [])

    useEffect(() =>{
        if(csvDownload){
            const timeout = setTimeout(() => {
                tableRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
            }, 200);

            return () => clearTimeout(timeout)
        }
        
    },[csvDownload])

    return(
        <>
        {/* <Loader className="custom-loader" ref={loaderRef} color="#f11946" height={4}/> */}
            {isConverting && (
                <LoaderComponent
                    isConverting={isConverting}
                />
        )}
        <NavBar/>
        <div className="main-container">
            <div className="home-container">
            
            <motion.h2
            initial={{opacity: 0, scale: 0.8}}
            whileInView={{opacity: 1, scale: 1}}
            transition={{duration: 0.5}}
            viewport={{once: true}}
            >
                Upload your image here!
            </motion.h2>
            <motion.form 
            initial={{opacity: 0}}
            whileInView={{opacity:1}}
            transition={{duration: 2}}
            viewport={{once: true}}
            onSubmit={handleSubmit}
            className="upload-image-form">
                <input
                style={{display: 'none'}}
                disabled={isConverting}
                ref={fileRef}
                onChange={(e) =>(handleImageChange(e))}
                type="file"
                name="image"
                accept="image/*"
                />

                <div 
                onClick={(e) => handleClickUpload(e)}
                className="upload-logo-container"
                >
                    <svg className="upload-logo" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(255, 255, 255)"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>
                    {/* <img className="upload-logo" src="../src/assets/upload.svg" alt="" /> */}
                </div>

            <button 
            type="submit"
            disabled={isConverting}
            className={isConverting ? 'disable-bttn' : ''}
            >
                {isConverting ? 'converting...' : 'Convert'}
            </button>
            {errorMessage && (
                <p>{errorMessage}</p>
            )}
            </motion.form>

            {showSideMssg && (
            <motion.div
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.7}}
            viewport={{once:true}}
             className="side-msg"
             >
                GRIDAI the most advance image to excel and spreadsheet converter yet,
                blending with superior GEMINI PRO 2.5 multimodal for extinsive text to image capabilities.
            </motion.div>
            )
            }
            
        </div>
        {imagePreview &&
        (<div onMouseEnter={() => setShowCloseBttn(true)} onMouseLeave={() => setShowCloseBttn(false)} className="img-preview-container">
            {showCloseBttn && (
            <div onClick={(e) => closeImgPreview(e)} className="img-preview-close">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="rgb(255, 255, 255)"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>
            )}
            <img className="img-preview" src={imagePreview} alt="" />

        </div>)
        }
        {rows.length > 0 &&(
            <div ref={tableRef} className="data-grid-container">
                <h3>CHECK YOUR DATA</h3>
                <p style={{fontSize:'0.8rem'}}>NOTE: You can edit the table below.</p>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    onRowEditStop={(params, event) =>{
                        event.defaultMuiPrevented = true; // needed to commit edits on click-out
                    }}
                    processRowUpdate={(newRow) =>{
                        const updatedRow = rows.map((row) => 
                            row.id === newRow.id ? newRow : row
                        );
                        setRows(updatedRow);
                        return newRow;
                    }}
                    experimentalFeatures={{ newEditingApi: true}}
                    pageSize={10}
                    rowsPerPageOptions={[10,25,50]}
                    pagination
                    sx={{width: '70%'}}
                    className='rdg-light'
                />
            </div>
        )}

        {csvDownload && (
        <div className="download-bttn-container">
                <>
                <button
                    className="download-bttn"
                    onClick={(e) => downloadCsv(e)}
                >
                    Download CSV
                </button>

                <button
                className="download-bttn"
                onClick={(e) => downloadXlsx(e)}
                >
                    Download XLSX
                </button>
                </>
        </div>
        )}
        
        <SecondContainer/>

        <Footer/>
        </div>
        </>
    )
}

export default Home;