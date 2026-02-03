import {useEffect, useState} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [backendData, setBackendData] = useState([{}])
  const [j, setJ] = useState(0) 

  useEffect(()=>{
    try {
      fetch("/api").then(
          response => response.json()
      ).then(
        data => {
          setBackendData(data)
          console.log(data)
        }
      )
      
    } catch (error) {
      console.log("failed to load the json")
    }
  },[])
  
  return (
    <>
      {/* Ton app */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  );
}

export default App
