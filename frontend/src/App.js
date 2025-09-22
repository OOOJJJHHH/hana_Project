import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import routes from "./RouteFor/routes";
import Header from "./Header";
import Footer from "./Footer";
import FindAccountForm from "./Login/ID_pw_find"; 
import "./App.css";
import {UserProvider} from "./Session/UserContext";
import UKWeather from "./Main/UKWeather";
import {GoogleOAuthProvider} from "@react-oauth/google";




const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        if (route.routes) {
            return (
                <Route key={index} path={route.path} element={<route.component />}>
                    {renderRoutes(route.routes)}
                </Route>
            );
        }
        return <Route key={index} path={route.path} element={<route.component />} />;
    });
};

//  App을 래핑해서 조건부로 Header 렌더링
function AppWrapper() {
    const location = useLocation();
    const isPopupRoute = location.pathname.startsWith("/popup");

    return (
        <>
            <div className="main-content">
                <Routes>
                    {renderRoutes(routes)}
                    {/* 팝업 전용 라우트 - 헤더 없이 나옴 */}
                    <Route path="/popup/find" element={<FindAccountForm />} />
                </Routes>
            </div>
            {!isPopupRoute && <Footer />}
            
            
        </>
    );
}

function App() {
    return (
        <UserProvider>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <Router>
                    <Header />
                    <AppWrapper />
                    <UKWeather />
                </Router>
            </GoogleOAuthProvider>
        </UserProvider>
    );
}

export default App;
