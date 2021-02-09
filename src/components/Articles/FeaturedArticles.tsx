//TODO add pagnation
import React, {memo, useEffect, useMemo, useState} from "react"
import {Box, Heading, Badge, Stack} from "@chakra-ui/react";
import {Link} from "react-router-dom";

const FeaturedArticles = () => {
    const [metadata, setMetadata] = useState([])
    // default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    useEffect(() => {
        getFeaturedMetadata()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success")
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setFetchState("failed")
            })
    }, []);

    const getFeaturedMetadata = async () => {
        const response = await fetch('/api/__featured__') // TODO: implement pages
        const data = await response.json()
        await setMetadata(data);
    };


    const postLink = useMemo(() => metadata.map(
        ({title, id, last_edited}) => (
            <Box
                key={id}
                p={5}
                shadow="md"
                borderWidth="1px"
                flex="1"
                borderRadius="md"
                height="50"

            >
                <Link to={"/render-article/" + id}>
                    <Badge colorScheme="purple" fontSize={"md"}>Featured</Badge>
                    <Heading size={"md"}>
                        {title}
                    </Heading>
                </Link>
                <div>Last updated: {new Date(last_edited).toLocaleString()}</div>
            </Box>
        )
    ), [metadata]);

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
        <Stack mt={10}>
            {postLink}
        </Stack>
    );
}
export default memo(FeaturedArticles);