import React, { useState } from "react";
import SearchPopupContent from "./PopUp/SearchPopupContent";

const CitySearch = ({ onSearch }) => {
    const [cityName, setCityName] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        onSearch(cityName.toLowerCase()); // 부모에 검색어 전달
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
            <div style={{ justifyItems: "center" }}>
                <h1>City Search</h1>
                <div>
                    <input
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Enter city name"
                    />
                    <button onClick={openPopup}>Search</button>
                </div>
            </div>

            {isPopupOpen && (
                <div style={searchPopup}>
                    <SearchPopupContent onclose={closePopup} cityName={cityName} />
                </div>
            )}
        </div>
    );
};

export default CitySearch;
