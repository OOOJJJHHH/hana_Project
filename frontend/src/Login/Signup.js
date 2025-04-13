// src/Signup.js
import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    id:'',
    password: '',
    confirmPassword: '',
    gender: '',
    userType: '', // 추가
    dateOfBirth: '',
    termsAccepted: false
  });
  

  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'confirmPassword') {
      checkPasswordMatch(value, formData.password);
    }
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      password: value
    });
    evaluatePasswordStrength(value);
    checkPasswordMatch(formData.confirmPassword, value);
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

  const checkPasswordMatch = (confirmPassword, password) => {
    if (confirmPassword === '') {
      setPasswordMatch('');
    } else if (confirmPassword === password) {
      setPasswordMatch('match');
    } else {
      setPasswordMatch('mismatch');
    }
  };

  const checkIdAvailability = () => { // ✅ 추가됨
    const usedIds = ['testuser', 'admin', 'guest']; // 예시
    if (usedIds.includes(formData.id)) {
      setIsIdAvailable(false);
    } else {
      setIsIdAvailable(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
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
              name="userType"
              value="tenant"
              onChange={(e) => {
                handleChange(e);
                setSelectedUserType('tenant');
              }}
              checked={formData.userType === 'tenant'}
            />
            사용자
          </label>
          <label>
            <input
              type="radio"
              name="userType"
              value="landlord"
              onChange={(e) => {
                handleChange(e);
                setSelectedUserType('landlord');
              }}
              checked={formData.userType === 'landlord'}
            />
            집주인
          </label>
        </div>
      </div>


        <div className="name-inputs">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="이름"
            className="input-field"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="성"
            className="input-field"
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="이메일"
          className="input-field"
          required
        />
          <div className="id-check-wrapper">
          <input
            type="text"
            name="id"
            value={formData.id}
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
          name="password"
          value={formData.password}
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
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
          className="input-field"
          required
        />
        <div className={`password-match ${passwordMatch}`}>
          {passwordMatch === 'match' && '비밀번호가 일치합니다.'}
          {passwordMatch === 'mismatch' && '비밀번호가 일치하지 않습니다.'}
        </div>
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

        <div>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
          />
          <label>약관에 동의합니다.</label>
        </div>
        <button type="submit" className="submit-btn" disabled={!formData.termsAccepted}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
