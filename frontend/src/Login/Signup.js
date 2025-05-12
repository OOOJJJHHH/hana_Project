// src/Signup.js
import React, {useEffect, useState} from 'react';
import './Signup.css';
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    uUser: '', // 사용자, 집주인 선택
    uLastName: '',
    uFirstName: '',
    uIdEmail: '',
    uId:'',
    uPassword: '',
  });

  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [cfPassword, setcfPassword] = useState('');
  const [ToS, setToS] = useState('N');

  useEffect(() => {
    if (cfPassword.length === 0) {
      setPasswordMatch('');
      return;
    }

    if (formData.uPassword === cfPassword) {
      setPasswordMatch('match');
    } else {
      setPasswordMatch('mismatch');
    }
  }, [formData.uPassword, cfPassword]);

  //입력한
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      uPassword: value
    });
    evaluatePasswordStrength(value);
  };

  const evaluatePasswordStrength = (password) => {
    const length = password.length;
    let strength = 'weak';
    
    if (length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password)) {
      strength = 'strong';
    } else if (length >= 6 && (/[A-Za-z]/.test(password) || /\d/.test(password))) {
      strength = 'medium';
    }

    setPasswordStrength(strength);
  };

  //입력한 id가 db에 이미 있는 id일 경우( 즉 이미 사용하고 있는 id )
  const checkIdAvailability = () => { 
    const usedIds = ['testuser', 'guest']; // 예시
    if (usedIds.includes(formData.uId)) {
      setIsIdAvailable(false);
    } else {
      setIsIdAvailable(true);
    }
  };


  // 최종적으로 db에 user 내용을 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(selectedUserType);
    if (formData.uPassword !== cfPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try{
      await axios.post("http://localhost:8080/saveUser", formData);
      alert("성공적으로 데이터가 저장되었습니다");

      setFormData({
        uUser: '', // 사용자, 집주인 선택
        uLastName: '',
        uFirstName: '',
        uIdEmail: '',
        uId:'',
        uPassword: '',
      },
          {
            withCredentials: true
          });
    }
    catch (error){
      console.log("Error saving city:", error);
      alert("데이터 저장에 실패하였습니다");
    }

    console.log('폼 제출됨:', formData);
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
      <div className="user-type-select-wrapper">
        {selectedUserType === 'tenant' && (
          <div className="tooltip-bottom">
            🧑 일반 사용자로 가입하여 방을 검색과 예약을 할 수 있어요.
                (대신 숙소 등록은 안되요!)
          </div>
        )}
        {selectedUserType === 'landlord' && (
          <div className="tooltip-bottom">
            🏠 집주인으로 가입하여 숙소를 등록할 수 있어요.
                (대신 방 예약은 안되요!)
          </div>
        )}

        <div className="user-type-select">
          <label>
            <input
              type="radio"
              name="uUser"
              value="tenant"
              onChange={(e) => {
                handleChange(e);
                setSelectedUserType('tenant');
                setFormData({uUser: selectedUserType});
              }}
              checked={formData.uUser === 'tenant'}
            />
            사용자
          </label>
          <label>
            <input
              type="radio"
              name="uUser"
              value="landlord"
              onChange={(e) => {
                handleChange(e);
                setSelectedUserType('landlord');
                setFormData({uUser: selectedUserType});
              }}
              checked={formData.uUser === 'landlord'}
            />
            집주인
          </label>
        </div>
      </div>


        <div className="name-inputs">
          <input
            type="text"
            name="uFirstName"
            value={formData.uFirstName}
            onChange={handleChange}
            placeholder="이름"
            className="input-field"
            required
          />
          <input
            type="text"
            name="uLastName"
            value={formData.uLastName}
            onChange={handleChange}
            placeholder="성"
            className="input-field"
            required
          />
        </div>
        <input
          type="email"
          name="uIdEmail"
          value={formData.uIdEmail}
          onChange={handleChange}
          placeholder="이메일"
          className="input-field"
          required
        />
          <div className="id-check-wrapper">
          <input
            type="text"
            name="uId"
            value={formData.uId}
            onChange={(e) => {
              handleChange(e);
              setIsIdAvailable(null); // 상태 초기화
            }}
            placeholder="아이디"
            className="input-field"
            required
          />
          <button type="button" onClick={checkIdAvailability} className="check-btn">
            중복확인
          </button>
        </div>
        {isIdAvailable === true && <div className="id-available">사용 가능한 아이디입니다.</div>}
        {isIdAvailable === false && <div className="id-unavailable">이미 사용 중인 아이디입니다.</div>}

        <input
          type="password"
          name="uPassword"
          value={formData.uPassword}
          onChange={handlePasswordChange}
          placeholder="비밀번호"
          className="input-field"
          required
        />
        <div className={`password-strength ${passwordStrength}`}>
          {passwordStrength === 'weak' && '보안 약함'}
          {passwordStrength === 'medium' && '보안 보통'}
          {passwordStrength === 'strong' && '보안 강함'}
        </div>
        <input
          type="password"
          name="cfPassword"
          value={cfPassword}
          onChange={(e) => setcfPassword(e.target.value)}
          placeholder="비밀번호 확인"
          className="input-field"
          required
        />
        <div className={`password-match ${passwordMatch}`}>
          {formData.uPassword === cfPassword && '비밀번호가 일치합니다.'}
          {formData.uPassword !== cfPassword && '비밀번호가 일치하지 않습니다.'}
        </div>

        <div className = "Agree-box">
        <p><h4>개인정보 수집·이용에 대한 동의</h4></p>
        <hr></hr>
        <p>
          <br></br>
          ㈜여가(이하 "회사")은 회원가입을 위해 아래와 같은 개인정보를 수집·이용합니다.
          <br></br>
          <br></br>
          <strong> 1. 수집 항목</strong>
            <br></br>
            <br></br>
            이름
            <br></br>
            <br></br>
            이메일
            <br></br>
            <br></br>
            아이디
            <br></br>
            <br></br>
            <strong>2. 수집 및 이용 목적</strong>
            <br></br>
            <br></br>
            회원 식별 및 본인 여부 확인
            <br></br>
            <br></br>
            서비스 이용을 위한 계정 생성 및 관리
            <br></br>
            <br></br>
            고객 문의 대응 및 공지사항 전달
            <br></br>
            <br></br>
            <strong>3. 보유 및 이용 기간</strong>
            <br></br>
            <br></br>
            회원 탈퇴 시까지 보관하며, 관련 법령에 따라 일정 기간 보관할 수 있습니다.
            <br></br>
            <br></br>
            <strong>※ 귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 제한될 수 있습니다.</strong>
          </p>
            </div>
        <div>
        <label>개인정보 수집 ∙ 이용에 대한 동의에 동의하십니까? </label>
          <input
            type="checkbox"
            onChange={(e) => setToS(e.target.checked ? "Y":"N")}
          />
          
        </div>
        <button type="submit" className="submit-btn" disabled={ToS!="Y"}>
           회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;










{/* <div className="gender-select">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              onChange={handleChange}
              checked={formData.gender === 'male'}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              onChange={handleChange}
              checked={formData.gender === 'female'}
            />
            여성
          </label>
        </div> */}