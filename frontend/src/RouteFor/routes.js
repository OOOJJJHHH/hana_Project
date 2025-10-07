import City from "../Cities/City";
import Locals from "../Locals/Locals";
import Login from "../Login/Login";
import Signup from "../Login/Signup";
import Meddle from "../Meddle";
import ID_pw_find from "../Login/ID_pw_find";
import User from "../MyPage/User";
import Local from "../Local/Local";
import HotelDetail from "../Pages/HotelDetail";
import Lodgment_add from "../Lodgment/Lodgment_add"
import CityLodging from "../Cities/CityLodging";
import Owner from "../Cities/Owner";
import CityForm from "../Cities/CityForm";
import About from "../About/About";
import EventAdd from '../About/Event/EventAdd'; // 새로 만든 파일 import
import EventDetail from '../About/Event/EventDetail';

const routes = [
    {
        path: '/',
        component: Meddle,
        exact: true,  // exact가 true일 경우, 정확히 해당 경로와 일치하는 경우만 렌더링
    },
    {
        path: '/hotel-detail', 
        component: HotelDetail,
      },
    {
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
    {
        path: '/local',
        component: Local
    },
    {
        path: '/locals',
        component: Locals,
    },
    {
        path: '/ID_pw_find',
        component: ID_pw_find,
    },
    {
        path: '/UserMyPage',
        component: User,
    },
    {
        path: '/Lodgment_add',
        component: Lodgment_add,
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
        path: '/About',
        component: About,
    },
    {  //도시 추가하는 컴포넌트
        path: '/create-event',
        component: EventAdd,
    },
    {
        path: '/event/:title',
        component: EventDetail,
    },


];

export default routes;
