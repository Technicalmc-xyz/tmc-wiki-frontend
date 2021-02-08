import React, {memo, useEffect, useMemo, useState} from "react"
import {
    Table,
    Td,
    Thead,
    Text,
    Tr,
    Th,
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    useToast,
    Box, Alert, AlertIcon, Tbody, Input, Badge
} from "@chakra-ui/react"
import {FiLock, FiTrash, FiUnlock, AiOutlineFire} from "react-icons/all";


const getArticles = async () =>
    await fetch('/api/__getadminarticles__')

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
        .then(r => {
            r.text()
            console.log(r)
        })
};
const publicizePost = async (id) => {
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

const featureArticle = async (id, featured) => {
    const route = featured ? '/api/__feature__' : '/api/__unfeature__';
    fetch(route, {
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
interface PublicizeButtonProps {
    publicized: boolean;
    title: string;
    id: string;
}
interface FeatureButtonProps {
    featured: boolean;
    title: string;
    id: string;
}


const ArticleAdmin = () => {
    const [articleMetadata, setArticleMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [removeTitle, setRemoveTitle] = useState('')
    const [removeId, setRemoveId] = useState(0)
    const [isOpen, setIsOpen] = React.useState(false)
    const onClose = () => setIsOpen(false)
    const cancelRef = React.useRef()
    const [update, setUpdate] = useState(0)
    const [confirmTitle, setConfirmTitle] = useState('');
    const toast = useToast()
    useEffect(() => {
        getArticles()
            //If the fetch got the data make the state a success
            .then(async (response) => {
                setFetchState("success")
                const data = await response.json()
                setArticleMetadata(await data);
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch((e) => {
                console.log(e)
                setFetchState("failed")
            })
    }, [update]);


    const StatusBadge = (status) => {
        if (status.status)
            return <Badge colorScheme="purple">New</Badge>
        else
            return <></>
    }
    const PublicizeButton = (props: PublicizeButtonProps) => {
        if (props.publicized) {
            return (
                <Button bg={"green.500"} onClick={() => {
                    privatizePost(props.id).then(() => setUpdate(update + 1))
                    toast({
                        title: `Privatized "${props.title}"`,
                        description: "This article is no longer available to the public",
                        position: "top",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    setUpdate(update + 1)
                }}><FiUnlock color={"white"}/></Button>
            )
        } else {
            return (
                <Button bg={"orange.500"} onClick={() => {
                    publicizePost(props.id).then(() => setUpdate(update + 1))
                    toast({
                        title: `Publicized "${props.title}"`,
                        description: "This article is now available to the public",
                        position: "top",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    setUpdate(update + 1)
                }}><FiLock color={"white"}/></Button>
            )
        }
    }
    const FeatureButton = (props: FeatureButtonProps) => {
        if (props.featured) {
            return (
                <Button bg={"purple.500"} onClick={() => {
                    featureArticle(props.id, !props.featured).then(() => setUpdate(update + 1))
                    toast({
                        title: `Unfeatured "${props.title}"`,
                        description: "This article is no longer featured",
                        position: "top",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    setUpdate(update + 1)
                }}><AiOutlineFire color={"white"}/></Button>
            )
        } else {
            return (
                <Button bg={"purple.200"} onClick={() => {
                    featureArticle(props.id, !props.featured).then(() => setUpdate(update + 1))
                    toast({
                        title: `Featured "${props.title}"`,
                        description: "This article is now featured",
                        position: "top",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    })
                    setUpdate(update + 1)
                }}><AiOutlineFire color={"white"}/></Button>
            )
        }
    }
    const articleTable = useMemo(() => articleMetadata
            .map(({id, last_edited, tag, title, publicized, status, featured}) => (
                    <Tr key={id}>
                        <Td isNumeric><StatusBadge status={status}/> {id}</Td>
                        <Td>{title}</Td>
                        <Td>{tag}</Td>
                        <Td>{new Date(last_edited).toLocaleString()}</Td>
                        <Td><FeatureButton featured={featured} title={title} id={id}/></Td>
                        <Td>
                            <PublicizeButton publicized={publicized} title={title} id={id}/>
                        </Td>
                        <Td>
                            <Button bg={"red.500"} onClick={() => {
                                setIsOpen(true);
                                setRemoveTitle(title);
                                setRemoveId(id);
                            }
                            }><FiTrash color={"white"}/></Button>
                        </Td>


                    </Tr>
                )
            ),
        [articleMetadata]);
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
        return (<Alert status="error">
            <AlertIcon/>
            Sorry you are not allowed to access this part of the website!
        </Alert>);

    } else return (
        <Box>
            <>
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete article "{removeTitle}"
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                            </AlertDialogBody>
                            <AlertDialogBody>
                                <Text size={"sm"} mb={3}>
                                    Please confirm by typing the title of the article you want to remove
                                </Text>
                                <Input
                                    type={"text"}
                                    onChange={(event) => {
                                        setConfirmTitle(event.target.value)
                                    }}
                                />
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                {confirmTitle === removeTitle
                                    ? <Button colorScheme="red" onClick={() => {
                                        removeArticle(removeId).then(() => setUpdate(update + 1))
                                        toast({
                                            title: `Removed "${removeTitle}"`,
                                            description: "This article has been permanently deleted",
                                            position: "top",
                                            status: "success",
                                            duration: 5000,
                                            isClosable: true,
                                        })
                                        onClose()
                                    }} ml={3}>
                                        Delete
                                    </Button>
                                    : <Button colorScheme="red" disabled ml={3}>
                                        Delete
                                    </Button>
                                }
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
            <Table variant="striped">
                <Thead>
                    <Tr>
                        <Th>#</Th>
                        <Th>Title</Th>
                        <Th>Tag</Th>
                        <Th>Last Edited</Th>
                        <Th>Feature</Th>
                        <Th>Publicize</Th>
                        <Th>Delete</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {articleTable}
                </Tbody>
            </Table>
        </Box>
    );
}
export default memo(ArticleAdmin);

