import React, { useEffect, useState } from "react";
import instance from "../../axios";
import { useNavigate } from "react-router-dom";


export default function Addscore() {
    const [pollunit, setPollUnit] = useState([]);
    const [party, setParty] = useState([]);
    const [number, setNumber] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [selectParty, setSelectParty] = useState("");
    const [selectPoll, setSelectPoll] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        function PollUnit() {
            instance({
                method: "post",
                headers: { "Content-Type": "application/json" },
                url: "/getPoll",
            }).then(response => {
                if (response.data.result === 0) {
                    setMessage("An error occured. Please refresh page");
                } else {
                    setPollUnit(response.data.result);
                }
            })
        }
        function Party() {
            instance({
                method: "post",
                headers: { "Content-Type": "application/json" },
                url: "/getParty",
            }).then(response => {
                if (response.data.result === 0) {
                    setMessage("An error occured. Please refresh page");
                } else {
                    setParty(response.data.result);
                }
            })
        }
        PollUnit();
        Party();

    }, []);
    const handleSubmit = e => {
        e.preventDefault();
        if((selectParty === "") || (selectPoll === "")){
            setMessage("Please select an option");
        } else {
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: { selectParty: selectParty, selectPoll: selectPoll, name: name, number: number },
            url: "/storeNewScore",
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                setMessage("Successfully added the new polling unit score.");
                setSelectPoll("");
                setSelectParty("");
                setName("");
                setNumber(null)
            }
        })
        }
    }
    return <div className="Addscore">
    <div className='button'>
    <button onClick={()=> navigate("/LgaResult")}>Check Total Scores In any LGA</button>
    <button onClick={()=> navigate("/")}>Check Individual Polling Units Scores</button>
    </div>
    <p>{message}</p>
        <form onSubmit={handleSubmit}>
        <div className="addscore_input">
        <label><b>Select Polling Unit</b></label>
            <select onChange={e => setSelectPoll(e.target.value)} required>
                <option value="--">--Select Polling Unit--</option>
                {
                    pollunit.map((poll, index) => {
                        return <option key={index} value={poll?.uniqueid}>{poll?.polling_unit_name}</option>
                    })
                }            </select>
                </div>
                <div className="addscore_input">
                <label><b>Select Party</b></label>
            <select onChange={e => setSelectParty(e.target.value)} required>
                <option value="--">--Select Party--</option>

                {
                    party.map((party, index) => {
                        return <option key={index} value={party?.partyname}>{party?.partyname}</option>
                    })
                }
            </select>
            </div>
            <div className="addscore_input">
            <label><b>Enter your name</b></label>
            <input type="text" placeholder="Enter your name" onChange={e => setName(e.target.value)} required/>
            </div>
            <div className="addscore_input">
            <label><b>Enter result of party</b></label>
            <input type="number" onChange={e => setNumber(e.target.value)} required/>
            </div>
            <button>Submit</button>
        </form>
    </div>
}