import React, { useState, useEffect } from "react";
import axios from "axios";

const SelectBox = ({ cityList, onCityChange }) => {
    const [show, setShow] = useState(false);

    const selectBoxStyle = {
        position: 'relative',
        width: '12rem',
        height: "3rem",
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
        textAlign: 'center',
        padding: "7% 0 0 0",
        marginLeft: "auto",
        marginRight: "auto"
    };

    const labelStyle = {
        fontSize: '20px',
        color: "#000000"
    };

    const selectOptionsStyle = (show) => ({
        position: 'absolute',
        listStyle: 'none',
        top: '100%',
        left: '0',
        width: '100%',
        overflow: 'hidden',
        maxHeight: show ? 'none' : '0',
        padding: '0',
        borderRadius: '8px',
        backgroundColor: '#595959',
        color: '#ffffff',
        zIndex: 5
    });

    const optionStyle = {
        fontSize: '14px',
        padding: '6px 8px',
        transition: 'background-color 0.2s ease-in',
    };

    const optionHoverStyle = {
        backgroundColor: '#b8b8b8',
    };

    return (
        <div style={selectBoxStyle} onClick={() => setShow(!show)}>
            <label style={labelStyle}>도시 선택</label>
            <ul style={selectOptionsStyle(show)}>
                {cityList.map((content, index) => (
                    <li
                        onClick={() => {
                            onCityChange(content.cityName); // ✅ 이 함수 호출
                            setShow(false);
                        }}
                    >
                        {content.cityName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectBox;
