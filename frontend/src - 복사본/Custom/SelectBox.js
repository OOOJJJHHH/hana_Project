import React, {useEffect, useState} from "react";
import axios from "axios";

const SelectBox = () => {

    const [show, setShow] = useState(false);

    const [contents, setContents] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/getCity")
            .then(response => {
                setContents(response.data);
            })
            .catch(error => {
                console.error("도시 정보 가져오기 오류", error);
                alert("도시 정보를 가져오는데 실패했습니다");
            })
    }, []);

    const selectBoxStyle = {
        position: 'relative',
        width: '7rem',
        padding: '8px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        alignSelf: 'center',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        cursor: 'pointer',
    };

    const labelStyle = {
        fontSize: '14px',
        marginLeft: '4px',
        textAlign: 'center',
    };

    const selectOptionsStyle = (show) => ({
        position: 'absolute',
        listStyle: 'none',
        top: '18px',
        left: '0',
        width: '100%',
        overflow: 'hidden',
        height: '90px',
        maxHeight: show ? 'none' : '0',
        padding: '0',
        borderRadius: '8px',
        backgroundColor: '#222222',
        color: '#fefefe',
    });

    const optionStyle = {
        fontSize: '14px',
        padding: '6px 8px',
        transition: 'background-color 0.2s ease-in',
    };

    const optionHoverStyle = {
        backgroundColor: '#595959',
    };


    return(
        <div style={selectBoxStyle} onClick={() => setShow(!show)}>
            <label style={labelStyle}>나라 선택</label>
            <ul style={selectOptionsStyle(show)}>
                {contents.map((content, index) => (
                    <li
                        style={optionStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = optionHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '')}
                        key={index}
                    >
                        {content.title}
                    </li>
                ))}
            </ul>
        </div>
    );

};


export default SelectBox;