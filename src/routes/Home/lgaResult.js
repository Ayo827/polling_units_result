import React, {useEffect, useState} from "react";
import instance from "../../axios";

export default function LgaResult(){
    const [result, setResult] = useState([]);
    const [lga, setLga] = useState(1);
    const [showLga, setShowLga] = useState([]);
    const [message, setMessage] = useState("");
    const [total, setTotal] = useState(null);


    useEffect(()=>{
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            url: "/getLga",
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                setShowLga(response.data.result);
            }
        })
    },[showLga]);
    const handleSubmit = e => {
        e.preventDefault();
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {lgaid: lga},
            url: "/getpollsumtotal",
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                console.log(response.data.result)
                setResult(response.data.result);
            }
        })
    }
    return <>
    <form onSubmit={handleSubmit}>
        <select  onChange={(e) => {
            setLga(e.target.value);
        }}>
        {
            showLga.map((lga, index)=>{
                return <option value={lga.lga_id} key={index} >{lga.lga_name}</option>
            })
        }
        </select>
        <button>Search</button>
    </form>
    <div className='poll-table'>
    <table style={{ width: 100 + '%' }}>
    <thead>
        <tr>
        <td>Polling Unit</td>
        <td>Score in Polling unit</td>
        </tr>
    </thead>
       {
        result.map((res, index)=>{
            return <tr key={index}>
                <td>{res.name}</td>
                <td>{res.score}</td>
            </tr>
        })
       }
       <tr><td>Total Poll Score</td><td>{result?.reduce((start, score) =>  start + parseInt(score.score), 0)}</td></tr>
    </table>
</div>

    </>
}