import React, {FC, memo, ReactElement, ReactNode, useEffect, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck, faLock, faTrash, faUnlock} from "@fortawesome/free-solid-svg-icons";


const ArticleAdmin = () => {
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

    const removeArticle = async (id) => {
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
    const publicizePost = (id) => {
        fetch("/api/__publicize__", {
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

    const privatizePost = async (id) => {
        fetch("/api/__privatize__", {
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
    const sort = (a, b): number => {
            return a.title.localeCompare(b.title)

    }
    interface AlertProps {
        id: number;
        title: string;
    }

    const Alert = (props: AlertProps) => {
        const [confirmTitle, setConfirmTitle] = useState("")
        return (
            <div className="modal fade" id={`${props.title}${props.id}`} data-bs-backdrop="static"
                 data-bs-keyboard="false"
                 tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                Remove post number <strong>{props.id}</strong> - <strong>{props.title}</strong></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"/>
                        </div>
                        <div className="modal-body">

                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1"
                                       className="form-label"><strong>{props.title}</strong></label>
                                <input className="form-control"
                                       aria-describedby="emailHelp"
                                       onChange={event => setConfirmTitle(event.target.value)}/>
                                <div id="emailHelp" className="form-text">Please write the name of the post to confirm
                                    its permanent removal
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <label className="form-label">This action is permanent and will delete this
                                post <strong>forever</strong></label>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            {confirmTitle === props.title
                                ? <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {
                                    removeArticle(props.id).catch(r => console.log(r))
                                }}>Understood</button>
                                : <button type="button" className="btn btn-primary disabled">Understood</button>
                            }
                        </div>
                    </div>
                </div>
            </div>);
    }

    const articleTable = useMemo(() => articleMetadata
            .sort((a,b) => sort(a,b))
            .map(({id, last_edited, tag, title, description, status}) => (
                    <tr>
                        <th scope="row">{id}</th>
                        <td>{title}</td>
                        <td>{description}</td>
                        <td>{tag}</td>
                        <td>{new Date(last_edited).toLocaleString()}</td>
                        <td>{status}</td>
                        <td>
                            <button className={"btn"} data-bs-toggle="modal" data-bs-target={`#${title}${id}`}><FontAwesomeIcon
                                icon={faTrash}/></button>
                        </td>
                        <td>
                            <button className={"btn bg-danger"}>
                                <FontAwesomeIcon
                                    onClick={() => {privatizePost(id)}}
                                    icon={faLock}/></button>
                        </td>
                        <td>
                            <button className={"btn bg-success"}><FontAwesomeIcon
                                onClick={() => {publicizePost(id)}} icon={faUnlock}/></button>
                        </td>
                        <Alert id={id} title={title}/>
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
                    <th scope="col"/>
                    <th scope="col"/>
                    <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {articleTable}
                </tbody>
            </table>
        </div>
    );
}
export default memo(ArticleAdmin);

