//TODO add pagnation
import React, {memo, useEffect, useMemo, useState} from "react"

const Posts = () => {
    interface Post {
        title: string;
        id: number;
        tags: string;
        last_edited: string;
        description: string;
    }

    const [metadata, setMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [tagFilter, setTagFilter] = useState('all')
    useEffect(() => {
        getPostMetaData()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success")
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setFetchState("failed")
            })
    }, []);

    const getPostMetaData = async () => {
        const response = await fetch('/api/__listposts__?n=100000') // TODO: implement pages
        const data = await response.json()
        await setMetadata(data);
    };

    const post = useMemo(() => metadata
            .filter(filter => filter.tags === tagFilter || tagFilter === 'all')
            .map(({title, id, tags, last_edited, description}: Post) => (
                    <div className={"post-link slide"}>
                        <div className={"post-link-title"}><a href={"/render-post/" + id}><h1 className={"link"}>{title}</h1>
                        </a></div>
                        <div>About: {description}</div>
                        <div>Tags: {tags}</div>
                        <div>Last updated: {new Date(last_edited).toLocaleString()}</div>
                    </div>
                )
            ),
        [metadata, tagFilter]);

    const selectFilter = () => {
        return (
            <div>
                <label>Filter by tag</label>
                <select className={"custom-select"}
                        onChange={event => {
                            setTagFilter(event.target.value)
                        }}>
                    <option value="all" selected>All</option>
                    <option value="Block Resource">Block Resource</option>
                    <option value="Block Farming">Block Farming</option>
                    <option value="Mob Resource">Mob Resource</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Animal Husbandry">Animal Husbandry</option>
                    <option value="World Manipulation">World Manipulation</option>
                    <option value="World Transportation">World Transportation</option>
                    <option value="Traffic">Traffic</option>
                    <option value="Resource Management and Processing">Resource Management and Processing</option>
                    <option value="Duplicate">Duplicate</option>
                    <option value="Game Mechanics">Game Mechanics</option>
                    <option value="Community">Community</option>
                    <option value="" disabled>Note: these categories are based off Fallen_Breaths Minecraft Tech Tree
                        v1.3
                    </option>
                </select>
            </div>
        );
    }
    // if the post is still loading just render a loading circle
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
            {selectFilter()}
            {post}
        </div>
    );
}
export default memo(Posts)
