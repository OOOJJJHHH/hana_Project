import React, {useState} from "react";
import DataFetcher from "../dbLogic/DataFetcher";

const LodDetail = () => {

    const[cityContents,setcityContents] = useState([]);
    const[lodContents,setlodContents] = useState([]);



    return (
        <div>
            <DataFetcher
                fetchCity={1}
                fetchLod={1}
                setCityContents={setcityContents}
                setLodContents={setlodContents}
            />
        </div>
    );
}

export default LodDetail;