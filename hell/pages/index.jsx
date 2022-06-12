import { React, useState, useEffect } from "react";


const index = () => {
  const [manga, setManga] = useState([])



  const fetchData = () => {
    fetch("http://localhost:3000/api/text", {

    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log(data);
      let anime = data.result
      setManga(anime)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>

    <div className="my-home">
    <h1>WELCOME TO MY API</h1>

        {/* {manga.map(data => (
          <div className="manga" key={data.id} >
            <img src={data.img} alt={data.title} />
            <h1>{data.title}</h1>
             <h4>{data.episodes}</h4>
            <h4>{data.duration}</h4>
            <h4>{data.year}</h4> 
            <h4>{data.language}</h4> 
          </div>
        ))} */}
   
      </div>
     
    </>
  );
};

export default index;
