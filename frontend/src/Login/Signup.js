// src/Signup.js
import React, { useEffect, useState } from 'react';
import './Signup.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uUser: '',
    uLastName: '',
    uFirstName: '',
    uIdEmail: '',
    uId: '',
    uPassword: '',
  });

  const [selectedUserType, setSelectedUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [CfPassword, setCfPassword] = useState('');
  const [ToS, setToS] = useState('N');
  const [googleVerified, setGoogleVerified] = useState(false); // 구글로 채운 경우

  // 비밀번호 확인 일치 여부
  useEffect(() => {
    if (CfPassword.length === 0) {
      setPasswordMatch('');
      return;
    }
    setPasswordMatch(formData.uPassword === CfPassword ? 'match' : 'mismatch');
  }, [formData.uPassword, CfPassword]);

  // 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 비밀번호 강도 평가
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      uPassword: value
    }));
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

  // 구글 로그인 성공 시 데이터 채우기
  const handleGoogleCallback = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setFormData(prev => ({
        ...prev,
        uFirstName: decoded.given_name || '',
        uLastName: decoded.family_name || '',
        uIdEmail: decoded.email,
        uId: `google_${decoded.sub}`,
        uPassword: 'google_default_password', // DB 저장용 임시 비밀번호
      }));
      setGoogleVerified(true);
    } catch (err) {
      console.error("Google signup error", err);
      alert("구글 로그인 중 문제가 발생했습니다.");
    }
  };

  // 회원가입
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 구글 로그인일 경우 아이디/비밀번호 조건 검사 생략
    if (!googleVerified) {
      if (formData.uPassword !== CfPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/saveUser`, formData);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");

      setFormData({
        uUser: '',
        uLastName: '',
        uFirstName: '',
        uIdEmail: '',
        uId: '',
        uPassword: '',
      });
      setCfPassword('');
      setGoogleVerified(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("데이터 저장에 실패하였습니다");
    }
  };

  return (
      <div className="signup-container">
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* 사용자 유형 선택 */}
          <div className="user-type-select-wrapper">
            {selectedUserType === 'tenant' && (
                <div className="tooltip-bottom">
                  🧑 일반 사용자로 가입하여 방을 검색과 예약을 할 수 있어요. (대신 숙소 등록은 안되요!)
                </div>
            )}
            {selectedUserType === 'landlord' && (
                <div className="tooltip-bottom">
                  🏠 집주인으로 가입하여 숙소를 등록할 수 있어요. (대신 방 예약은 안되요!)
                </div>
            )}
            <div className="user-type-select">
              <label>
                <input
                    type="radio"
                    name="uUser"
                    value="tenant"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedUserType(value);
                      setFormData(prev => ({ ...prev, uUser: value }));
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
                      const value = e.target.value;
                      setSelectedUserType(value);
                      setFormData(prev => ({ ...prev, uUser: value }));
                    }}
                    checked={formData.uUser === 'landlord'}
                />
                집주인
              </label>
            </div>
          </div>

          {/* 이름/성 */}
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

          {/* 이메일 */}
          <input
              type="email"
              name="uIdEmail"
              value={formData.uIdEmail}
              onChange={handleChange}
              placeholder="이메일"
              className="input-field"
              required
          />

          {/* 아이디/비밀번호 */}
          {!googleVerified && (
              <>
                <input
                    type="text"
                    name="uId"
                    value={formData.uId}
                    onChange={handleChange}
                    placeholder="아이디"
                    className="input-field"
                    required
                />

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
                    name="CfPassword"
                    value={CfPassword}
                    onChange={(e) => setCfPassword(e.target.value)}
                    placeholder="비밀번호 확인"
                    className="input-field"
                    required
                />
                {CfPassword.length > 0 && (
                    <div className={`password-match ${passwordMatch}`}>
                      {passwordMatch === 'match' && '비밀번호가 일치합니다.'}
                      {passwordMatch === 'mismatch' && '비밀번호가 일치하지 않습니다.'}
                    </div>
                )}
              </>
          )}

          {/* 동의 박스 */}
          <div className="Agree-box">
            <h4>개인정보 수집·이용에 대한 동의</h4>
            <hr />
            <p>
              ㈜여가(이하 "회사")은 회원가입을 위해 아래와 같은 개인정보를 수집·이용합니다.<br /><br />
              <strong>1. 수집 항목</strong><br />
              이름, 이메일, 아이디<br /><br />
              <strong>2. 수집 및 이용 목적</strong><br />
              회원 식별 및 본인 여부 확인, 서비스 이용을 위한 계정 생성 및 관리, 고객 문의 대응 및 공지사항 전달<br /><br />
              <strong>3. 보유 및 이용 기간</strong><br />
              회원 탈퇴 시까지 보관하며, 관련 법령에 따라 일정 기간 보관
            </p>
          </div>

          <div>
            <label>개인정보 수집 ∙ 이용에 대한 동의에 동의하십니까?</label>
            <input
                type="checkbox"
                onChange={(e) => setToS(e.target.checked ? "Y" : "N")}
            />
          </div>

          {/* 구글 로그인 / 진행중 안내 */}
          {googleVerified ? (
              <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    border: "2px solid green",
                    borderRadius: "8px",
                    backgroundColor: "#e6ffed",
                    color: "green",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
              >
                구글 로그인으로 진행 중 입니다
              </div>
          ) : (
              <GoogleLogin
                  onSuccess={handleGoogleCallback}
                  onError={() => alert("구글 로그인 실패")}
              />
          )}

          <button
              type="submit"
              className="submit-btn"
              disabled={ToS !== "Y"} // 구글 로그인 시 다른 조건 제거
          >
            회원가입
          </button>
        </form>
      </div>
  );
}

export default Signup;
