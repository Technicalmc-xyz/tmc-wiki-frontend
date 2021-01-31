import React, {FC, memo, ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck, faTrash} from "@fortawesome/free-solid-svg-icons";


const Holding = () => {
    const [articleMetadata, setArticleMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [filterRank, setFilterRank] = useState('all')
    const [sortType, setSortType] = useState('')
    const [alertMessages, setAlertMessages] = useState([]);
    useEffect(() => {
        getArticles()
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

    const getArticles = async () => {
        const response = await fetch('/api/__listposts__')
        const data = await response.json()
        console.log(data)
        await setArticleMetadata(data);
    };


    const sort = (a, b): number => {
        return a.title.localeCompare(b.title)

    }
    const approvePost = (id) => {
        fetch("/api/__approvepost__", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                id: id,
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
            .then(r => {
                r.text()
                console.log(r)
            })
    };

    const denyPost = async (id) => {
        fetch("/api/__removepost__", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                id: id,
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
            .then(r => {
                r.text()
                console.log(r)
            })
    };
    const articleTable = useMemo(() => articleMetadata
            .sort((a, b) => sort(a, b))
            .map(({id, last_edited, tag, title, description}) => (
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{title}</td>
                        <td>{description}</td>
                        <td>{tag}</td>
                        <td>{new Date(last_edited).toLocaleString()}</td>
                        <td>
                            <button className={"btn bg-danger"} data-bs-toggle="modal" data-bs-target={`#${title}${id}`}>
                                <FontAwesomeIcon
                                    onClick={() => {denyPost(id)}}
                                    icon={faTrash}/></button>
                        </td>
                        <td>
                            <button className={"btn bg-success"}><FontAwesomeIcon
                                onClick={() => {approvePost(id)}} icon={faCheck}/></button>
                        </td>
                    </tr>
                )
            ),
        [articleMetadata, filterRank, sortType]);
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
            <table className="table table-responsive-md">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Tag</th>
                    <th scope="col">Last Edited</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                {articleTable}
                </tbody>
            </table>
        </div>
    );
}
export default memo(Holding);

