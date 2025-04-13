import React, {useEffect, useState} from "react";
import axios from "axios";
import DataFetcher from "../../dbLogic/DataFetcher";

const SelectBox = () => {

    const [show, setShow] = useState(false);

    const [cityContents, setcityContents] = useState([]);
    const [lodContents, setlodContents] = useState([]);

    // 버튼 클릭 시 해당 title을 가져옴
    const handleClick = (cityName) => {
        // PUT 요청을 보내는 함수
        console.log('Clicked item index:', cityName);

        const update = async (cityName) => {
            try {
                console.log('Clicked item ind4545ex:', cityName);
                //실질적 데이터 저장을 요청하는 코드
                const response = await axios.patch(
                    `http://localhost:8080/updateCity/${cityName}`
                );

                console.log('Response:', response.data);
            } catch (error) {
                console.error('There was an error updating the city!', error);
            }
        };

        update(cityName);
        window.location.reload();  // 페이지 새로 고침
    };

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
    });

    const optionStyle = {
        fontSize: '14px',
        padding: '6px 8px',
        transition: 'background-color 0.2s ease-in',
    };

    const optionHoverStyle = {
        backgroundColor: '#b8b8b8',
    };


    return(
        <div style={selectBoxStyle} onClick={() => setShow(!show)}>
            <DataFetcher
                fetchCity={1}
                fetchLod={0}
                setCityContents={setcityContents}
                setLodContents={setlodContents}
            />
            <label style={labelStyle}>나라 선택</label>
            <ul style={selectOptionsStyle(show)}>
                {cityContents.map((content, index) => (
                    <li
                        style={optionStyle}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = optionHoverStyle.backgroundColor)}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '')}
                        key={index}
                        onClick={() => handleClick(content.cityName)}
                    >
                        {content.cityName}
                    </li>
                ))}
            </ul>
        </div>
    );

};


export default SelectBox;


// const encodedTitle = encodeURIComponent(title);