import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from "./RouteFor/routes";
import Header from "./Header";
import CSS from "./App.css";

const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        // 서브 라우트가 있는 경우 중첩 라우팅 처리
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

function App() {
    return (
        <Router>
            <Header />
            <div className="main-content">
                <Routes>
                    {renderRoutes(routes)}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
