import React, { useState } from "react";
import SearchPopupContent from "./PopUp/SearchPopupContent";

const CitySearch = () => {
    const [cityName, setCityName] = useState("");  // 사용자 입력값
    const[isPopupOpen, setIsPopupOpen] = useState(false);


    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const searchPopup = {
        display: "flex",
        justifyContent: "center",
    };

    return (
        <div>
            <div style={{justifyItems: "center"}}>
                <h1>City Search</h1>
                <div>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}  // 입력값 업데이트
                        placeholder="Enter city name"
                    />
                    <button onClick={openPopup}>Search</button>
                </div>
            </div>

            {isPopupOpen && (
                <div style={searchPopup}>
                    <SearchPopupContent onclose={closePopup} cityName={cityName}/>
                </div>
            )
            }
        </div>
    );
};

export default CitySearch;
