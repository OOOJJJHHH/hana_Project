import React, { useContext, useState } from "react";
import { UserContext } from "../Session/UserContext";
import EditPop from "./PopUp/EditPop";

// 스위치 스타일들
const switchCon = {
    display: 'inline-block',
    position: 'relative',
    width: '60px',
    height: '34px',
};

const hiddenCheckbox = {
    opacity: 0,
    width: 0,
    height: 0,
};

const slider = {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '0.4s',
    borderRadius: '34px',
};

const sliderBefore = {
    position: 'absolute',
    content: '""',
    height: '26px',
    width: '26px',
    borderRadius: '50%',
    left: '4px',
    bottom: '4px',
    backgroundColor: 'white',
    transition: '0.4s',
};

const Switch = ({ checked, onChange }) => {
    const dynamicSlider = {
        ...slider,
        backgroundColor: checked ? '#2196F3' : '#ccc', // 켜짐 시 파란색
    };

    const dynamicSliderBefore = {
        ...sliderBefore,
        transform: checked ? 'translateX(26px)' : 'none',
    };

    return (
        <label style={switchCon}>
            <input
                type="checkbox"
                style={hiddenCheckbox}
                checked={checked}
                onChange={onChange}
            />
            <span style={dynamicSlider}>
                <span style={dynamicSliderBefore}></span>
            </span>
        </label>
    );
};

const Account = () => {
    const userInfo = useContext(UserContext);

    const [edit, setEdit] = useState(false);
    const openPopup = () => setEdit(true);
    const closePopup = () => setEdit(false);

    const [hovered, setHovered] = useState(false);

    // 스위치 상태
    const [switches, setSwitches] = useState([false, false, false]);

    const toggleSwitch = (index) => {
        setSwitches((prev) => {
            const newSwitches = [...prev];
            newSwitches[index] = !newSwitches[index];
            return newSwitches;
        });
    };

    const mainContent = {
        display: "flex",
        flexDirection: "row",
    };

    const detailContent = {
        marginTop: "20px",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "row",
        fontSize: "25px",
        lineHeight: '5',
        gap: "30px"
    };

    const editArea = {
        marginLeft: "auto"
    };

    const buttonStyle = {
        padding: '8px 16px',
        backgroundColor: hovered ? 'yellow' : 'white',
        border: '1px solid #ccc',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        borderRadius: "5px"
    };

    const pushMain = {
        display: "flex",
        flexDirection: "row",
    };

    const pushCheck = {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        fontSize: "25px",
        lineHeight: '1',
        gap: "30px",
    };

    return (
        <div>
            <h1>계정 정보 확인</h1>
            <div style={mainContent}>

                <div style={detailContent}>
                    <div>
                        <p>현재 접속한 계정 타입</p>
                        <p>사용자 아이디</p>
                        <p>사용자 이름</p>
                    </div>
                    <div>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                    </div>
                    <div>
                        <p>{userInfo.uUser}</p>
                        <p>{userInfo.uId}</p>
                        <p>{userInfo.uFirstName}</p>
                    </div>
                </div>

                <div style={editArea}>
                    <button
                        type="submit"
                        style={buttonStyle}
                        onClick={openPopup}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        회원정보 수정
                    </button>
                    {edit && (
                        <div>
                            <EditPop uId={userInfo.uId} onClose={closePopup} />
                        </div>
                    )}
                </div>
            </div>

            <div style={pushMain}>
                <div>
                    <h1>PUSH 알림 동의</h1>
                    <div style={pushCheck}>
                        <p>메시지 알림동의</p>
                        <Switch checked={switches[0]} onChange={() => toggleSwitch(0)} />

                        <p>이메일 알림동의</p>
                        <Switch checked={switches[1]} onChange={() => toggleSwitch(1)} />
                    </div>
                </div>

                <div>
                    <h1>SNS 연결 여부</h1>
                    <div style={pushCheck}>
                        <p>카카오톡 연결</p>
                        <Switch checked={switches[2]} onChange={() => toggleSwitch(2)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
