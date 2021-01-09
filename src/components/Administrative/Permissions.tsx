//TODO add pagnation
import React, {memo, useEffect, useMemo, useState} from "react"

const Permissions = () => {

    interface User {
        Username: string;
        DiscordId: string;
        Rank: string;
    }
    const [userData, setMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [filterRank, setFilterRank] = useState('all')
    const [sortType, setSortType] = useState('')
    const [alertMessages, setAlertMessages] = useState([]);
    useEffect(() => {
        getUsers()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success")
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch((e) => {
                console.log(e)
                setFetchState("failed")
            })
    }, []);

    const getUsers = async () => {
        const response = await fetch('/api/__getalluserperms__')
        const data = await response.json()
        console.log(data)
        await setMetadata(data);
    };
    const sort = (a, b): number => {
        if (sortType === 'username') {
            return a.Username.localeCompare(b.Username)
        }
        else if (sortType === 'username-reverse') {
            return b.Username.localeCompare(a.Username)
        }
    }
    const handleModify = async (DiscordID, Rank) => {
        fetch("/api/__modifyuserperms__", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                discordId: DiscordID,
                rank: Rank
            }),
            // Adding headers to the request
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "*"
            }
        })
            // .then(response => console.log(response.text()))
            .then(r => r.text())
            .then(r => setAlertMessages([...alertMessages, {message: r}]))


    };
    const userTable = useMemo(() => userData
            .sort((a,b) => sort(a,b))
            .filter(user => user.Rank === filterRank || filterRank === 'all')
            .map(({Username, DiscordId, Rank}: User) => (
                    <tr>
                        <td>{Username}</td>
                        <td>{DiscordId}</td>
                        <td>
                            <select className="custom-select" defaultValue={Rank} onChange={event => {
                                handleModify(DiscordId, event.target.value)
                                getUsers()
                            }}>
                                <option value="banned">Banned</option>
                                <option value="guest">Guest</option>
                                <option value="trusted">Trusted</option>
                                <option value="editor">Editor</option>
                                <option value="dev">Dev</option>
                                <option value="mod">Mod</option>
                            </select>
                        </td>
                    </tr>
                )
            ),
        [userData, filterRank, sortType]);

    const handleCloseAlert = removeMessage => {
        setAlertMessages(alertMessages.filter(alert => alert.message !== removeMessage))

    }

    const alerts = useMemo(() => alertMessages
            .map(({message}) => (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {message}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => handleCloseAlert(message)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                )
            ),
        [alertMessages]);

    const filterRole = () => {
        return (
            <div>
                <select className="custom-select sort-filter-select" defaultValue={"all"}
                        onChange={event => setFilterRank(event.target.value)}>
                    <option value="all">All</option>
                    <option value="banned">Banned</option>
                    <option value="guest">Guest</option>
                    <option value="trusted">Trusted</option>
                    <option value="editor">Editor</option>
                    <option value="dev">Dev</option>
                    <option value="mod">Mod</option>
                </select>
                <select className={"custom-select sort-filter-select"}
                        onChange={event => {
                            setSortType(event.target.value)
                        }}>
                    <option value="username" selected>Username A-Z</option>
                    <option value="username-reverse">Username Z-A</option>
                </select>
            </div>


        )
    }
    // if the post is still loading just render a loading bar
    if (fetchState === "loading") {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    //if we caught a error send a failed message
    else if (fetchState === "failed") {
        return (
            <div className="alert alert-danger" role="alert">Sorry Looks like something is going wrong. Is the API down?
                Check with Jakku on the Discord.</div>
        )
    } else return (
        <div>
            {alerts}
            {filterRole()}
            <table className="table table-responsive-md">
                <thead>
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">DiscordID</th>
                    <th scope="col">Rank</th>
                </tr>
                </thead>
                <tbody>
                {userTable}
                </tbody>
            </table>
        </div>
    );
}
export default memo(Permissions)
