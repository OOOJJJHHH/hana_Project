// src/Signup.js
import React, { useState } from 'react';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    termsAccepted: false
  });

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
        <div className="gender-select">
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
        </div>
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
