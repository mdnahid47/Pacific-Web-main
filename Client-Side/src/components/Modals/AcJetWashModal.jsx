import React, { useEffect, useState } from 'react'
import cardImage from '../../assets/ac-service.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBangladeshiTakaSign } from '@fortawesome/free-solid-svg-icons';
import Cards from '../Cards';

const AcJetWashModal = () => {
    const [jetwash, setJetwash] = useState([]);
    useEffect(() => {
        fetch("/menu.json")
            .then((res) => res.json())
            .then((data) => {
                const JetWash = data.filter((item) => item.category === "AC Jet Wash");
                setJetwash(JetWash);
            });
    }, []);
    return (
        <div>

            {
                jetwash.map((item, i) => (

                    <Cards item={item} key={i} />
                ))
            }
        </div>
    )
}

export default AcJetWashModal