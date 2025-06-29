const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const uploadImage = async(body) =>{
    console.log(' api hit!')
    try {
        const response = await fetch(`${BASE_URL|| 'http://localhost:8080'}/convert`, {
            method: 'POST',
            body: body
        });

        if(!response.ok){
            const error = await response.json();
            throw new Error(`SERVER ERROR: ${error}` )
        }
        const data = await response.json();
        return data
    } catch (error) {
       console.error("Upload failed:", error.message);
        throw error; 
    }
}