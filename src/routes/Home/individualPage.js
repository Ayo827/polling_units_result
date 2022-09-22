import React, { useState, useEffect } from 'react';
import instance from "../../axios";
import './style.css';
import { useNavigate } from "react-router-dom";



export default function Individial() {
    const [pollName, setPollName] = useState(null);
    const [polls, setPolls] = useState([]);
    const [message, setMessage] = useState("");
    const [pollid, setPollId] = useState(null);
    const [selectPollName, setSelectPollName] = useState("");
    const [pollResult, setPollResult] = useState([]);
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: { pollname: pollName },
            url: "/getIndividualpoll"
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                setPolls(response.data.result);
            }
        })
    }, [pollName]);

    useEffect(() => {
        setProcessing(true);
        setPolls([]);
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: { pollid: pollid },
            url: "/getIndividualpollresult"
        }).then(response => {
            if (response.data.result === 0) {
                setProcessing(false);
                setMessage("An error occured. Please refresh page");
            } else {
                setProcessing(false);
                setPollResult(response.data.result);
            }
        })

    }, [pollid, selectPollName])

    return (
        <div className="container">
        <div className='button'>
        <button onClick={()=> navigate("/Addscore")}>Add Results</button>
        <button onClick={()=> navigate("/LgaResult")}>Check Total Scores In any LGA</button>
        </div>
            <div className="main">
            <p>{message}</p>
            <p>Enter Polling unit name to get result.</p>

                <form>
                    <input type="text"   onChange={e => {
                        setPollName(e.target.value);
                    }} />
                </form>
                {((processing === false) && pollResult.length >= 1) ? <p>Search result for {selectPollName}</p>: (processing === true) ? <p>Searching ...</p> :  pollResult.length <= 1 ? 'Nothing to show' : ''}
              <div className="para-dropdown">  {polls.map((poll, index) => {
                    return <>
                        <p  style={{ cursor: "pointer" }} key={index} onClick={() => {
                            setPollId(poll.uniqueid);
                            setSelectPollName(poll.polling_unit_name);
                            setPollName(null);
                        }}>{poll.polling_unit_name}</p>
                    </>

                })} </div>
            </div>

            {pollResult.length >= 1 ?    <table className='poll-table'>
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Party</th>
                            <th>Party Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pollResult.map((result, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{result.party_abbreviation}</td>
                                    <td>{result.party_score}</td>
                                </tr>
                            })
                        }
                    </tbody>

                </table> : ''}
        </div>

    )
}