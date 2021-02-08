import React, {useState, useCallback, useEffect} from 'react'
import {Node} from 'slate'
import {useParams} from "react-router";
import ArticleEditor from "../ArticleEditor";
import {Button, Heading, Alert, AlertIcon, AlertTitle, AlertDescription, Box, SkeletonText, Text} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const RenderedArticle = () => {
    const {id} = useParams();
    const [publicized, setPublicized] = useState("")
    const getPost: () => Promise<void> = useCallback(async () => {
        const response = await fetch('/api/__getpost__?id=' + id)
        const data = await response.json()
        console.log(data)
        setPublicized(data.publicized)
        setTitle(data.title)
        setLastEdited(data.last_edited)
        setValue(JSON.parse(data.body))
    }, [id])
    const [fetchState, setFetchState] = useState("loading")
    const [authenticated, setAuthenticated] = useState(false);

    const getAuthenticated = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        setAuthenticated(data.authenticated);
    }
    useEffect(() => {
        getAuthenticated().catch(() => setAuthenticated(false));
        getPost()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success");
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setFetchState("failed");
            })
    }, [getPost]);
    const [title, setTitle] = useState('')
    const [lastEdited, setLastEdited] = useState(0)
    const [value, setValue] = useState<Node[]>(initialValue)
    const EditButton = () =>
        authenticated
            ? <Link to={"/edit-article/" + id}><Button>Edit Article</Button></Link>
            : <a href={"/api/auth?redirect=" + encodeURIComponent('/edit-article/' + id)}><Button>Login to Edit
                Post</Button></a>
    // if the post is still loading just render a loading bar
    if (fetchState === "loading") {
        return (
            <Box padding="6" boxShadow="lg">
                <SkeletonText mt="4" noOfLines={10} spacing="4" />
            </Box>
        )
    }
    //if we caught a error send a failed message
    if (fetchState === "failed") {
        return (
            <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
            >
                <AlertIcon boxSize="40px" mr={0}/>
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Article does not exist.
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    <u><Link to={"/articles"}>Go check out some other posts</Link></u>
                </AlertDescription>
            </Alert>)
    }
    if (publicized) {
        return (
            <div>
                <Heading>{title}</Heading>
                <Text fontSize={"sm"}>Last Edited: {new Date(lastEdited).toLocaleString()}</Text>
                <ArticleEditor initValue={value} readonly={true}/>
                <EditButton/>
            </div>
        )
    } else {
        return (
            <Alert
                status="error"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
            >
                <AlertIcon boxSize="40px" mr={0}/>
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Article not public.
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Sorry this article is not currently public! If you just made this article, it needs to be confirmed.
                    Otherwise this article was made private.
                </AlertDescription>
            </Alert>)
    }

}

const initialValue = [
    {
        children: [
            {text: ''},
        ],
    },
]

export default RenderedArticle