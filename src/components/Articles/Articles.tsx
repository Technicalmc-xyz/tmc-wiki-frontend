//TODO add pagnation
import React, {memo, useCallback, useEffect, useMemo, useState} from "react"
import {Link} from "react-router-dom"
import {Box, Heading, Button, Select, Flex, Spinner, Text, AlertIcon, Alert} from "@chakra-ui/react"
import {motion} from "framer-motion"

const Articles = () => {
    const MotionBox = motion.custom(Box);
    type Status = "PRIVATE" | "PUBLIC"
    interface Article {
        title: string;
        id: number;
        tags: string;
        last_edited: string;
        description: string;
        status: Status;
    }
    const [metadata, setMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [tagFilter, setTagFilter] = useState('all')
    const [sortType, setSortType] = useState('newest')
    const [compact, setCompact] = useState(false)
    useEffect(() => {
        getArticleMetadata()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success")
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setFetchState("failed")
            })
    }, []);

    const getArticleMetadata = async () => {
        const response = await fetch('/api/__listposts__?n=100000') // TODO: implement pages
        const data = await response.json()
        await setMetadata(data);
    };

    const sort = useCallback((a, b) => {
        if (sortType === 'newest') {
            return b.last_edited - a.last_edited;
        } else if (sortType === 'oldest') {
            return a.last_edited - b.last_edited;
        } else if (sortType === 'alphabetic') {
            return a.title.localeCompare(b.title)
        } else if (sortType === 'alphabetic-reverse') {
            return b.title.localeCompare(a.title)
        }
    },[sortType]);

    const articleCard = useMemo(() => {
            return metadata
                .sort((a, b) => sort(a, b))
                .filter(filter => filter.tags === tagFilter || tagFilter === 'all')
                .map(({title, id, tags, last_edited, description}: Article) => (
                        <MotionBox key={id}>
                            {compact
                                ?
                                    <MotionBox
                                        borderRadius="md"
                                        shadow={"md"}
                                        p={"5"}
                                        mb={"3"}
                                    >
                                        <Heading size={"md"}><Link className={"link"} to={`/render-article/${id}`}>{title}</Link>
                                        </Heading>
                                        <Text>{description}</Text>

                                    </MotionBox>
                                : <MotionBox
                                    borderRadius="md"
                                    shadow={"md"}
                                    p={"5"}
                                    mb={"3"}
                                >
                                    <div className="card-body">
                                        <Heading><Link className={"link"}
                                                       to={`/render-article/${id}`}>{title}</Link>
                                        </Heading>
                                        <Text>{description}</Text>
                                        <Text>{tags}</Text>
                                        <Text>{new Date(last_edited).toLocaleString()}</Text>
                                        <Link to={"/edit-article/" + id}><Button mt={2} variant={"outline"}>Edit</Button></Link>
                                    </div>
                                </MotionBox>
                            }
                        </MotionBox>
                    )
                )
        }
        ,
        [metadata, tagFilter, compact, sort]);
    const sortAndFilter = () => {
        return (
            <Flex
                mb={10}
            >
                <Select
                    width={"45%"}
                    defaultValue={"all"}
                    mr={3}
                    onChange={event => {
                        setTagFilter(event.target.value)
                    }}>
                    <option value="all">All</option>
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
                </Select>
                <Select
                    mr={3}
                    defaultValue={"newest"}
                    width={"45%"}
                    onChange={event => {
                        setSortType(event.target.value)
                    }}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="alphabetic">A-Z</option>
                    <option value="alphabetic-reverse">Z-A</option>
                </Select>
                <Button onClick={() => setCompact(!compact)} variant={"outline"}>Compact</Button>
            </Flex>
        );
    }

// if the post is still loading just render a loading circle
    if (fetchState === "loading") {
        return (
            <Spinner align="center" size={"xl"}/>
        )
    }
//if we caught a error send a failed message
    else if (fetchState === "failed") {
        return (
            <Alert status="error">
                <AlertIcon/>
                Looks like we can not reach the API.
            </Alert>

        )
    } else return (
        <Box>
            {sortAndFilter()}
            {articleCard}
        </Box>
    );
}
export default memo(Articles)
