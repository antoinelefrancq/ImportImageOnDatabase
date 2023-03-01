import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';

function App() {
  const [image, setImage] = useState(null)
  const [imageSrc, setImageSrc] = useState(null);
  



  useEffect(()=>{
    const query = `
      query {
        getImage(id:21) {
          file
        }
      }
    `;
    axios.post('http://localhost:5000/graphql',{query})
    .then(response => {
      const url = response.data.data.getImage.file
      setImageSrc(url)
    })
    .catch(error => {
      console.log(error);
    });
  },[])

  const handleChange = async(e) =>{
    let file = e.target.files[0];
    const img = {
      preview: URL.createObjectURL(file),
      data: file,
    }
    setImage(img)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('file', image.data)
    axios.post('http://localhost:5000/image', formData)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input type="file" accept='image/png, image/jpeg, image/bmp, image/webp, image/x-icon, image/gif' onChange={handleChange} />
          {image && 
            <div>
              <img src={image.preview} alt={image.data.name} />
              <button type="submit">Upload</button>
            </div>
          }         
        </form>
        
        
  
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {imageSrc ? (
          <img src={imageSrc} alt={imageSrc} width="400" height="400" />
        ) : (
          <div>Loading...</div>
        )}
    </div>
  )
}

export default App

