import React, { createContext, useState, useEffect } from 'react';

// UserContext를 생성
export const UserContext = createContext();
export const UserUpdateContext = createContext();

export const UserProvider = ({ children }) => {
    // userInfo의 초기값을 로컬스토리지에서 가져옴 (없으면 빈 객체로 초기화)
    const [userInfo, setUserInfo] = useState(() => {
        const savedUserInfo = localStorage.getItem('loginUser');
        return savedUserInfo ? JSON.parse(savedUserInfo) : null; // 로그인 정보 없으면 null
    });

    // 페이지가 로드될 때 세션 정보 가져오기 (userInfo가 null일 경우에만)
    useEffect(() => {
        if (userInfo === null) { // userInfo가 null일 경우에만 세션 정보 요청
            const fetchSessionInfo = async () => {
                const sessionData = await fetchSession();
                if (sessionData) {
                    setUserInfo(sessionData);  // 상태 업데이트
                    localStorage.setItem('loginUser', JSON.stringify(sessionData));  // 로컬스토리지에 저장
                }
            };
            fetchSessionInfo();
        }
    }, [userInfo]);  // userInfo가 변경될 때마다 실행 (userInfo가 null일 때만 실행)

    return (
        <UserContext.Provider value={userInfo}>
            <UserUpdateContext.Provider value={setUserInfo}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    );
};

// 세션 정보를 가져오는 함수
async function fetchSession() {
    try {
        const response = await fetch('/api/getSessionInfo', {
            method: 'GET',
            credentials: 'include',  // 세션 정보를 포함한 요청
        });

        if (response.ok) {
            return response.json();  // 세션 정보 반환
        } else {
            console.error('Session fetch failed: ', response.status);
            return null;  // 로그인 상태가 아니라면 null
        }
    } catch (error) {
        console.error('Error fetching session info:', error);
        return null;  // 네트워크 오류 등의 예외 처리
    }
}
