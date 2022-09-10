import React, { useState, useEffect } from 'react';
import instance from "../../axios";


export default function Individial() {
    const [pollName, setPollName] = useState(null);
    const [polls, setPolls] = useState([]);
    const [message, setMessage] = useState("");
    const [pollid, setPollId] = useState(null);
    const [selectPollName, setSelectPollName] = useState("");
    const [pollResult, setPollResult] = useState([]);
    const [processing, setProcessing] = useState(false)

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

    const handleSearch = e => {
        e.preventDefault();
        setProcessing(true)
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

    }

    return (
        <>
            <div className="Individual">
            <p>{message}</p>
                <form onSubmit={handleSearch}>
                    <p>Enter Polling unit name to get result.</p>
                    <input type="text"  onChange={e => setPollName(e.target.value)} />
                    <button>Search</button>
                </form>
                {processing === true ? <p>Searching ...</p> : '' }
                {(polls.length >= 1 || processing === false) ? <p>Search result for {pollName}</p> : 'Nothing to show'}
                {polls.map((poll, index) => {
                    return <>
                        <p style={{ cursor: "pointer" }} key={index} onClick={() => {
                            setPollId(poll.uniqueid);
                            setSelectPollName(poll.polling_unit_name);
                            setPollName(null);
                        }}>{poll.polling_unit_name}</p>
                    </>

                })}
            </div>

            <div className='poll-table'>
                <table style={{ width: 100 + '%' }}>
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

                </table>
            </div>
        </>

    )
}