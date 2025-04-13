import { useEffect } from 'react';
import axios from 'axios';

const DataFetcher = ({ fetchCity, fetchLod, setCityContents, setLodContents }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetchCity가 true일 경우 getCity 호출
                if (fetchCity) {
                    const cityResponse = await axios.get("http://localhost:8080/getCity");
                    setCityContents(cityResponse.data); // 부모에게 city 데이터를 전달
                }

                // fetchLod가 true일 경우 getLod 호출
                if (fetchLod) {
                    const lodResponse = await axios.get("http://localhost:8080/getLod");
                    setLodContents(lodResponse.data); // 부모에게 lod 데이터를 전달
                }
            } catch (error) {
                console.error("데이터 가져오기 오류:", error);
            }
        };

        fetchData();
    }, [fetchCity, fetchLod, setCityContents, setLodContents]);

    // UI를 반환하지 않음
    return null;
};

export default DataFetcher;
