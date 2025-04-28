// routes.js
import City from "../Cities/City";
// import Home from './pages/Home';
// import Contact from './pages/Contact';
// import Dashboard from './pages/Dashboard';
// import Settings from './pages/Settings';
// import Profile from './pages/Profile';
import CityGestH from "../Cities/CityLodging";
import Login from "../Loggin/Login";
import Signup from "../Loggin/Signup";
import Meddle from "../Meddle";
import CityForm from "../Cities/CityForm";
import CityLodging from "../Cities/CityLodging";

const routes = [
    {
        path: '/',
        component: Meddle,
        exact: true,  // exact가 true일 경우, 정확히 해당 경로와 일치하는 경우만 렌더링
    },
    {
        path: '/city',
        component: City,
        exact: true,  // exact가 true일 경우, 정확히 해당 경로와 일치하는 경우만 렌더링
    },
    {
        path: '/cityLodging',
        component: CityLodging,
    },
    {
        path: '/login',
        component: Login,
    },
    
    {
        path: '/signup',
        component: Signup,
    },

    {
        path: '/cityform',
        component: CityForm,
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
