import React, { useContext, useEffect, useState } from 'react'
import Cards from '../Cards';
const BasicServiceModals = () => {

  const [AcService, setAcService] = useState([]);
  useEffect(() => {
    fetch("/menu.json")
      .then((res) => res.json())
      .then((data) => {
        const Basic = data.filter((item) => item.category === "Ac Basic Service");
        setAcService(Basic);
      });
  }, []);

    return (
        <div >
              {
                    AcService.map((item,i) => (
                        <Cards item={item} key={i}/>
                    ))
                }
             

            

            <div>
                
            </div>
        </div>

    )
}

export default BasicServiceModals