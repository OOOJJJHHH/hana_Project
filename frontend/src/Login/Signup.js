// src/Signup.js
import React, { useEffect, useState } from 'react';
import './Signup.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    uUser: '', // 사용자, 집주인 선택
    uLastName: '',
    uFirstName: '',
    uIdEmail: '',
    uId: '',
    uPassword: '',
  });

  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [idCheckLoading, setIdCheckLoading] = useState(false);          // ✅ 로딩 상태
  const [idCheckError, setIdCheckError] = useState('');                 // ✅ 에러 메시지
  const [selectedUserType, setSelectedUserType] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const [CfPassword, setCfPassword] = useState('');
  const [ToS, setToS] = useState('N');

  useEffect(() => {
    if (CfPassword.length === 0) {
      setPasswordMatch('');
      return;
    }
    setPasswordMatch(formData.uPassword === CfPassword ? 'match' : 'mismatch');
  }, [formData.uPassword, CfPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // ✅ 아이디 입력이 바뀌면 중복확인 상태 초기화
    if (name === 'uId') {
      setIsIdAvailable(null);
      setIdCheckError('');
    }
  };

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

  // ✅ (프론트) 아이디 유효성 간단 체크: 영문/숫자, 4~20자
  const isValidUserId = (uid) => /^[a-zA-Z0-9]{3,20}$/.test(uid);

  // ✅ (프론트→백엔드) 아이디 중복확인
  const checkIdAvailability = async () => {
    setIdCheckError('');
    if (!formData.uId) {
      setIsIdAvailable(null);
      setIdCheckError('아이디를 입력해주세요.');
      return;
    }
    if (!isValidUserId(formData.uId)) {
      setIsIdAvailable(null);
      setIdCheckError('아이디는 영문/숫자 3~20자로 입력하세요.');
      return;
    }

    try {
      setIdCheckLoading(true);
      // 백엔드에서 { "available": true|false } 형태로 응답한다고 가정
      const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/checkId`,
          { params: { uId: formData.uId } }
      );
      setIsIdAvailable(Boolean(data?.available));
    } catch (err) {
      console.error('중복확인 오류:', err);
      setIsIdAvailable(null);
      setIdCheckError('중복확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIdCheckLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 제출 전 마지막으로 아이디/비번 점검
    if (!isValidUserId(formData.uId)) {
      alert('아이디는 영문/숫자 3~20자로 입력하세요.');
      return;
    }
    if (isIdAvailable !== true) {
      alert('아이디 중복확인을 진행하고 사용 가능한 아이디인지 확인해주세요.');
      return;
    }
    if (formData.uPassword !== CfPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
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
      // eslint-disable-next-line no-undef
      setCfPassword('');
      setIsIdAvailable(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("데이터 저장에 실패하였습니다");
    }
  };

  return (
      <div className="signup-container">
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
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
                onChange={handleChange}
                placeholder="아이디"
                className="input-field"
                required
            />
            <button
                type="button"
                onClick={checkIdAvailability}
                className="check-btn"
                disabled={idCheckLoading}
                title={idCheckLoading ? '확인 중...' : '아이디 중복확인'}
            >
              {idCheckLoading ? '확인 중...' : '중복확인'}
            </button>
          </div>

          {/* ✅ 아이디 중복확인 결과/에러 표시 */}
          {idCheckError && <div className="id-error">{idCheckError}</div>}
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
              name="CfPassword"
              value={CfPassword}
              onChange={(e) => setCfPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="input-field"
              required
          />
          {/* ✅ 확인 입력이 있을 때만 일치/불일치 문구 표시 */}
          {CfPassword.length > 0 && (
              <div className={`password-match ${passwordMatch}`}>
                {passwordMatch === 'match' && '비밀번호가 일치합니다.'}
                {passwordMatch === 'mismatch' && '비밀번호가 일치하지 않습니다.'}
              </div>
          )}

          <div className="Agree-box">
            <h4>개인정보 수집·이용에 대한 동의</h4>
            <hr />
            <p>
              ㈜여가(이하 "회사")은 회원가입을 위해 아래와 같은 개인정보를 수집·이용합니다.<br /><br />
              <strong>1. 수집 항목</strong><br /><br />
              이름<br /><br />
              이메일<br /><br />
              아이디<br /><br />
              <strong>2. 수집 및 이용 목적</strong><br /><br />
              회원 식별 및 본인 여부 확인<br /><br />
              서비스 이용을 위한 계정 생성 및 관리<br /><br />
              고객 문의 대응 및 공지사항 전달<br /><br />
              <strong>3. 보유 및 이용 기간</strong><br /><br />
              회원 탈퇴 시까지 보관하며, 관련 법령에 따라 일정 기간 보관할 수 있습니다.<br /><br />
              <strong>※ 귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 제한될 수 있습니다.</strong>
            </p>
          </div>

          <div>
            <label>개인정보 수집 ∙ 이용에 대한 동의에 동의하십니까?</label>
            <input
                type="checkbox"
                onChange={(e) => setToS(e.target.checked ? "Y" : "N")}
            />
          </div>

          <button
              type="submit"
              className="submit-btn"
              disabled={ToS !== "Y" || isIdAvailable !== true}  // ✅ 중복확인 통과 전엔 비활성화
          >
            회원가입
          </button>
        </form>
      </div>
  );
}

export default Signup;
