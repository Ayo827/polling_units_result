import React, { useEffect, useState } from "react";
import instance from "../../axios";


export default function Addscore() {
    const [pollunit, setPollUnit] = useState([]);
    const [party, setParty] = useState([]);
    const [number, setNumber] = useState(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [selectParty, setSelectParty] = useState("");
    const [selectPoll, setSelectPoll] = useState("");


    useEffect(()=>{
        function PollUnit(){
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
        function Party(){
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

    },[]);
    const handleSubmit = e => {
        e.preventDefault();
        instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {selectParty: selectParty, selectPoll: selectPoll, name: name, number: number},
            url: "/storeNewScore",
        }).then(response => {
            if (response.data.result === 0) {
                setMessage("An error occured. Please refresh page");
            } else {
                window.location.reload();
                setMessage("Successfully added the new polling unit score.");
                setSelectPoll("");
                setSelectParty("");
                setName("");
                setNumber(null)
            }
        })
    }
    return <div className="Addscore">
        <form onSubmit={handleSubmit}>
            <select onChange={e => setSelectPoll(e.target.value)}>
            <option disabled>--Select Polling Unit--</option>
            {
                pollunit.map((poll, index)=> {
                    return  <option key={index} value={poll?.uniqueid}>{poll?.polling_unit_name}</option>
                })
            }            </select>
            <select onChange={e => setSelectParty(e.target.value)}>
            <option disabled>--Select Party--</option>

            {
                party.map((party, index)=> {
                    return  <option key={index} value={party?.partyname}>{party?.partyname}</option>
                })
            }
            </select>
            <input type="text" placeholder="Enter your name" onChange={e => setName(e.target.value)} />
            <input type="number" onChange={e => setNumber(e.target.value)} />
            <button>Submit</button>
        </form>
    </div>
}