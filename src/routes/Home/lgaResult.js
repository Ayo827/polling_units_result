import React, { useEffect, useState } from "react";
import instance from "../../axios";
import { useNavigate } from "react-router-dom";


export default function LgaResult() {
    const [result, setResult] = useState([]);
    const [lga, setLga] = useState(1);
    const [showLga, setShowLga] = useState([]);
    const [message, setMessage] = useState("");
    const [total, setTotal] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
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
    }, [showLga]);
    const handleSubmit = e => {
        e.preventDefault();
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: { lgaid: lga },
            url: "/getpollsumtotal",
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                setResult(response.data.result);
            }
        })
    }
    return <div className="container">
    <div className='button'>
    <button onClick={()=> navigate("/Addscore")}>Add Results</button>
    <button onClick={()=> navigate("/")}>Check Individual Polling Units Scores</button>
    </div>
    <p>{message}</p>
    <div className="main">
        <form onSubmit={handleSubmit}>
            <select onChange={(e) => {
                setLga(e.target.value);
            }}>
                {
                    showLga.map((lga, index) => {
                        return <option value={lga.lga_id} key={index} >{lga.lga_name}</option>
                    })
                }
            </select>
            <button>Search</button>
        </form>
        </div>
            <table  className='poll-table'>
                <thead>
                    <tr>
                        <td>Polling Unit</td>
                        <td>Score in Polling unit</td>
                    </tr>
                </thead>
                {
                    result.map((res, index) => {
                        return <tr key={index}>
                            <td>{res.name}</td>
                            <td>{res.score}</td>
                        </tr>
                    })
                }
                <tr><td>Total Poll Score</td><td>{result?.reduce((start, score) => start + parseInt(score.score), 0)}</td></tr>
            </table>

    </div>
}