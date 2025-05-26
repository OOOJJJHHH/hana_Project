import { useEffect } from 'react';
import axios from 'axios';

const DataFetcher = ({ fetchCity, fetchLod, setCityContents, setLodContents }) => {
    useEffect(() => {
        const fetchData = async () => {
            if (fetchCity) {
                const res = await axios.get("http://localhost:8080/getCity");
                setCityContents(res.data);
                console.log("✅ 도시 응답:", res.data);
            }
        };
        fetchData();
    }, []); // ✅ 빈 배열: 컴포넌트 mount 시 1번만 실행

    return null;
};

export default DataFetcher;
