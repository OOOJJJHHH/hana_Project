import React, {useEffect, useState} from "react";
import axios from "axios";

const EditPop = ({onClose}) => {
    const [userProfile, setUserProfile] = useState([]);
    const [formData, setFormData] = useState([]);
    const [hoveredButton, setHoveredButton] = useState(null); // 'save', 'cancel', 또는 null

    const formContent = {
        uFirstName : "이름",
        uId : "아이디",
        uIdEmail : "이메일",
        uLastName : "성",
        uPassword : "비밀번호",
    };

    useEffect(() => {
        axios.get("http://localhost:8080/getOneUser", {
            withCredentials: true
        })
            .then(response => {
                console.log("데이터 도착:", response.data);
                setUserProfile(response.data[0]);
                setFormData(response.data[0]);
            })
            .catch(error => {
                console.error("에러 발생:", error);
            });
    }, []);

    useEffect(() => {
        if (userProfile) {
            console.log("userProfile이 변경됨:", userProfile);
        }
    }, [userProfile]);


    const contentChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        try{
            await axios.post("http://localhost:8080/saveUser", formData);
            alert("데이터가 성공적으로 수정되었습니다");
            onClose();
        }
        catch (error) {
            console.error("데이터 저장에 실패했습니다", error);
        }
    }

    //CSS
    const popupMain = {
        position: "relative",
        backgroundColor: "red",
        width: "1000px",
        height: "20%",
    };

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    const popupStyle = {
        width: "500px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        minWidth: "300px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        alignContent: "center",
    };

    const getButtonStyle = (buttonName) => ({
        padding: '4px 16px',
        backgroundColor: hoveredButton === buttonName ? 'rgba(223,248,93,0.5)' : 'white',
        border: '1px solid #ccc',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        marginRight: '10px',
        borderRadius: "5px"
    });


    // return부분
    if (!userProfile) {
        return <div>로딩 중...</div>;
    }

    return(
        <div style={overlayStyle}>
            <div style={popupStyle}>

               <div style={{marginBottom : "20px"}}>
                   <label style={{fontSize: "25px"}}><strong>현재 정보 수정</strong></label>
               </div>

                <div>
                    <form onSubmit={handleSubmit}>
                        {
                            Object.entries(formData).map(([key, value]) =>
                                !(key == "id" || key == "uUser") && (
                                        <div style={{fontSize: "18px"}} key={key}>
                                            <span style={{display: "inline-block", width: "70px"}}>{formContent[key]}</span>
                                            <span style={{marginRight : "5px"}}> : </span>
                                            <input
                                                type="text"
                                                name={key}
                                                value={value}
                                                onChange={(e) => contentChange(e)}
                                                placeholder={value}
                                                required
                                                style={{padding: "0 0 0 5px", height: "40px"}}
                                            />
                                        </div>
                                    )
                            )
                        }

                        <div style={{marginTop: "20px"}}>
                            <button
                                type="submit"
                                style={getButtonStyle('save')}
                                onMouseEnter={() => setHoveredButton('save')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                저장
                            </button>
                            <button
                                onClick={onClose}
                                style={getButtonStyle('cancel')}
                                onMouseEnter={() => setHoveredButton('cancel')}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                취소
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
            );
}

export default EditPop;