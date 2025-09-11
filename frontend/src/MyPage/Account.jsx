import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../Session/UserContext";
import EditPop from "./PopUp/EditPop";

// 🔧 스타일
const container = {
    position: 'relative',
    padding: '40px',
    fontFamily: "'Noto Sans KR', sans-serif",
    color: '#333',
};

const section = {
    position: 'relative',
    marginBottom: '40px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#fafafa',
};

const title = {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '30px',
};

const userRow = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '18px',
};

const label = {
    width: '140px',
    fontWeight: 'bold',
};

const separator = {
    margin: '0 10px',
};

const value = {
    flex: 1,
};

const editButton = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '8px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.2s ease',
};

const editButtonHover = {
    ...editButton,
    backgroundColor: '#f0f0f0',
};

const tooltipTrigger = {
    display: 'inline-block',
    fontSize: '14px',
    color: '#2196F3',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginBottom: '10px',
    position: 'relative',
};

const tooltipBox = {
    position: 'absolute',
    top: '22px',
    left: '0',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#444',
    zIndex: 100,
    width: '300px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const sectionGroup = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '40px',
};

const switchGroup = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
};

const switchContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const switchLabel = {
    fontSize: '18px',
};

// ✅ 스위치 컴포넌트
const Switch = ({ checked, onChange }) => {
    const switchOuter = {
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '28px',
    };

    const switchInner = {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#2196F3' : '#ccc',
        transition: '.4s',
        borderRadius: '34px',
    };

    const circle = {
        position: 'absolute',
        height: '22px',
        width: '22px',
        borderRadius: '50%',
        left: '3px',
        bottom: '3px',
        backgroundColor: 'white',
        transition: '.4s',
        transform: checked ? 'translateX(22px)' : 'none',
    };

    const hidden = {
        opacity: 0,
        width: 0,
        height: 0,
    };

    return (
        <label style={switchOuter}>
            <input type="checkbox" style={hidden} checked={checked} onChange={onChange} />
            <span style={switchInner}>
                <span style={circle}></span>
            </span>
        </label>
    );
};

const Account = () => {
    const userInfo = useContext(UserContext);
    const [edit, setEdit] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [switches, setSwitches] = useState([false, false, false]);
    const tooltipRef = useRef(null);

    const toggleSwitch = (index) => {
        setSwitches((prev) => {
            const updated = [...prev];
            updated[index] = !updated[index];
            return updated;
        });
    };

    return (
        <div style={container}>
            <div style={section}>
                <h1 style={title}>계정 정보 확인</h1>

                {/* 회원정보 수정 버튼 */}
                <button
                    style={hovered ? editButtonHover : editButton}
                    onClick={() => setEdit(true)}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    회원정보 수정
                </button>

                {/* 계정 타입 */}
                <div style={userRow}>
                    <span style={label}>계정 타입</span>
                    <span style={separator}>:</span>
                    <span style={value}>{userInfo.uUser}</span>
                </div>

                {/* 툴팁 트리거 */}
                <div
                    style={tooltipTrigger}
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                    ref={tooltipRef}
                >
                    계정 타입 자세히 보기
                    {tooltipVisible && (
                        <div style={tooltipBox}>
                            <p><strong>🧑 일반 사용자 (tenant)</strong><br />방 검색 및 예약 가능 (숙소 등록 불가)</p>
                            <hr style={{ margin: '10px 0' }} />
                            <p><strong>🏠 집주인 (landlord)</strong><br />숙소 등록 가능 (방 예약 불가)</p>
                        </div>
                    )}
                </div>

                {/* ID & 이름 */}
                <div style={userRow}>
                    <span style={label}>사용자 아이디</span>
                    <span style={separator}>:</span>
                    <span style={value}>{userInfo.uId}</span>
                </div>

                <div style={userRow}>
                    <span style={label}>사용자 이름</span>
                    <span style={separator}>:</span>
                    <span style={value}>{userInfo.uFirstName}</span>
                </div>

                {edit && <EditPop onClose={() => setEdit(false)} />}
            </div>

            {/* 푸시 & SNS */}
            <div style={sectionGroup}>
                <div style={section}>
                    <h2 style={title}>PUSH 알림 동의</h2>
                    <div style={switchGroup}>
                        <div style={switchContainer}>
                            <span style={switchLabel}>메시지 알림 동의</span>
                            <Switch checked={switches[0]} onChange={() => toggleSwitch(0)} />
                        </div>
                        <div style={switchContainer}>
                            <span style={switchLabel}>이메일 알림 동의</span>
                            <Switch checked={switches[1]} onChange={() => toggleSwitch(1)} />
                        </div>
                    </div>
                </div>

                <div style={section}>
                    <h2 style={title}>SNS 연결 여부</h2>
                    <div style={switchGroup}>
                        <div style={switchContainer}>
                            <span style={switchLabel}>카카오톡 연결</span>
                            <Switch checked={switches[2]} onChange={() => toggleSwitch(2)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
