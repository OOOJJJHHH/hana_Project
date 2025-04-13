// routes.js
import City from "../Cities/City";
// import Home from './pages/Home';
// import Contact from './pages/Contact';
// import Dashboard from './pages/Dashboard';
// import Settings from './pages/Settings';
// import Profile from './pages/Profile';
import Login from "../Login/Login";
import Signup from "../Login/Signup";
import Meddle from "../Meddle";
import CityLodging from "../Cities/CityLodging";
import Owner from "../Cities/Owner";
import CityForm from "../Cities/CityForm";
import CitySerch from "../Cities/CitySerch";

const routes = [
    {
        path: '/',
        component: Meddle,
        exact: true,  // exact가 true일 경우, 정확히 해당 경로와 일치하는 경우만 렌더링
    },
    {  //현재 등록되어있는 도시의 목록을 보여주는 컴포넌트
        path: '/city',
        component: City,
        exact: true,  // exact가 true일 경우, 정확히 해당 경로와 일치하는 경우만 렌더링
    },
    {
        path: '/login',
        component: Login,
    },
    
    {
        path: '/signup',
        component: Signup,
    },

    {  //선택한 도시에 대한 숙소를 보여주는 컴포넌트
        path: '/citylodging',
        component: CityLodging,
    },

    {  //숙소 추가하는 컴포넌트
        path: '/owner',
        component: Owner,
    },

    {  //도시 추가하는 컴포넌트
        path: '/cityform',
        component: CityForm,
    },

    {  //도시 추가하는 컴포넌트
        path: '/cityserch',
        component: CitySerch,
    },

    // {
    //     path: '/dashboard',
    //     component: Dashboard,
    //     routes: [
    //         {
    //             path: '/dashboard/settings',
    //             component: Settings,
    //         },
    //         {
    //             path: '/dashboard/profile',
    //             component: Profile,
    //         },
    //     ],
    // },
];

export default routes;
