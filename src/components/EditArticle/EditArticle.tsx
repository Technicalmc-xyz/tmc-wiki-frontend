import React, {useState, useCallback, useEffect, FC, memo} from 'react'
import {Node} from 'slate'
import {useParams} from "react-router";
import {
    FormControl,
    Input,
    Select,
    Spinner,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Alert,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalHeader,
    ModalBody,
    Stack,
    Box,
    Kbd,
    ModalFooter,
    useDisclosure
} from '@chakra-ui/react'
import ArticleEditor from "../ArticleEditor";
import {Link} from "react-router-dom";
import {FaRegKeyboard} from "react-icons/fa";


const EditArticle = () => {
    // Id of the post
    const {id} = useParams();

    const getPost: () => Promise<void> = useCallback(async () => {
        const response = await fetch('/api/__getpost__?id=' + id)
        const data = await response.json()
        console.log(data)
        await setTitle(data.title)
        await setDescription(data.description)
        await setTags(data.tags)
        await setLastEditCount(data.editCount)
        await setValue(JSON.parse(data.body))
        await setMessage(`Edit ${data.title}`);
    }, [id])

    const checkAuth: () => Promise<void> = useCallback(async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        setAuthed(data.authenticated);
    }, [])

    useEffect(() => {
        checkAuth().then(() => setCheckedAuth(true)).catch(() => {
            setAuthed(false);
            setCheckedAuth(true);
        });
        getPost()
            //If the fetch got the data make the state a success
            .then(() => {
                setFetchState("success")
            })
            //If the fetch was bad set the state of the fecth to failed
            .catch(() => {
                setFetchState("failed")
            })
    }, [getPost, checkAuth]);

    //the fetching state is defaulted as loading
    const [fetchState, setFetchState] = useState("loading");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [lastEditCount, setLastEditCount] = useState(0)
    const [message, setMessage] = useState('');
    const [failed, setFailed] = useState(false);
    const [failedMessage, setFailedMessage] = useState(<React.Fragment><strong>Woah there something went
        wrong!</strong> Are you sure you filled in all the fields?</React.Fragment>);
    const [, setSubmitted] = useState(false);
    const [authed, setAuthed] = useState(false);
    const [checkedAuth, setCheckedAuth] = useState(false);
    const [madeChanges, setMadeChanges] = useState(false);
    const [signOff, setSignOff] = useState(false);
    const [success, setSuccess] = useState(false);
    //Slate.js editor states
    const [value, setValue] = useState<Node[]>(initialValue)
    const {isOpen, onOpen, onClose} = useDisclosure()

    if (checkedAuth && !authed) {
        return <Alert status="error">
            <AlertIcon/>
            You must be logged in before editing an article
        </Alert>
    }

    const submitPost = (event) => {
        event.preventDefault();

        //There must be a change to something to submit an edit
        if ((title === "" || description === "" || tags === "" || window.localStorage.getItem('content') === undefined)) {
            setFailed(true)
            window.scrollTo({top: 0, left: 0, behavior: "smooth"})
            return;
        }
        const send_body = JSON.stringify({
            title: title,
            description: description,
            tags: tags,
            lastEditCount: lastEditCount,
            message: message,
            body: window.localStorage.getItem('content')
        })
        //send request edit post with the id
        fetch("/api/__editpost__?id=" + id, {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: send_body,
            // Adding headers to the request
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "*"
            }
        })
            .then(r => r.text())
            .then(r => {
                if (r === 'OK') {
                    setSubmitted(true)
                    setSuccess(true)
                } else if (r === 'OUTDATED') {
                    setFailed(true);
                    setFailedMessage(<React.Fragment><strong>This page has been edited by someone else while you were
                        editing it.</strong> Please salvage your work, cancel the edit, re-edit the page and copy your
                        work back in.</React.Fragment>)
                } else {
                    setFailed(true);
                }
            })
            .catch((e) => {
                console.error(e);
                setFailed(true)
            })
    }
    const FailedPost = () => {
        if (failed) {
            return <Alert status="error">
                <AlertIcon/>
                {failedMessage}
            </Alert>
        } else {
            return null;
        }
    }
    const SubmitButton: FC = () => {
        if (madeChanges && signOff) {
            return (
                <Button onClick={submitPost}>Submit Edits</Button>
            );
        } else {
            return null;
        }
    }
    // if the post is still loading just render a loading bar
    if (fetchState === "loading") {
        return (
            <Spinner size="xl"/>
        )
    }
    //if we caught a error send a failed message
    else if (fetchState === "failed") {
        return (
            <div className="alert alert-danger" role="alert">Sorry Looks like something is going wrong. Are you sure
                this post exists? Is the API down? Check with Jakku on the Discord.</div>
        )
    }
    if (success) {
        return (
            <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
            >
                <AlertIcon boxSize="50px" mr={0}/>
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Article Submitted!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Thank you for your edit! We appreciate deeply your contribution to this wiki. If you would like the
                    poster
                    role on the discord just ping one of the moderators!
                    <u><Link to={`/render-article/${id}`}></Link></u>
                </AlertDescription>
            </Alert>
        )

    } else {
        return (
            <div>
                <FailedPost/>
                <FormControl>
                    <Input
                        mb={2}
                        id={"title"}
                        type={"text"}
                        variant="flushed"
                        onChange={event => {
                            setTitle(event.target.value)
                            setMadeChanges(true)
                        }}
                        name={"title"}
                        placeholder="Title"
                        defaultValue={title}
                        isRequired={true}
                    />
                    <Input mb={2}
                           id={"description"}
                           type={"text"}
                           variant="flushed"
                           onChange={event => {
                               setDescription(event.target.value)
                               setMadeChanges(true)
                           }}
                           placeholder="Description"
                           name="description"
                           defaultValue={description}
                           isRequired={true}
                    />
                    <Select
                        id={"tag"}
                        mb={10}
                        defaultValue={tags}
                        onChange={event => {
                            setTags(event.target.value)
                            setMadeChanges(true)
                        }}
                        required>
                        <option value="select" disabled>Select a Category</option>
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
                        <option value="Game Mechanic">Game Mechanic</option>
                        <option value="Community">Community</option>
                    </Select>
                </FormControl>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalCloseButton/>
                        <ModalHeader>Keyboard Shortcuts</ModalHeader>
                        <ModalBody>

                            <Stack>
                                <Box>Bold <Kbd>ctrl</Kbd> + <Kbd>b</Kbd></Box>
                                <Box>Italic <Kbd>ctrl</Kbd> + <Kbd>i</Kbd></Box>
                                <Box>Underline <Kbd>ctrl</Kbd> + <Kbd>u</Kbd></Box>
                                <Box>Code <Kbd>ctrl</Kbd> + <Kbd>`</Kbd></Box>
                            </Stack>
                        </ModalBody>
                        <ModalHeader>Markdown  Shortcuts</ModalHeader>
                        <ModalBody>
                            <Stack>
                                <Box>Heading 1 <Kbd>#</Kbd></Box>
                                <Box>Heading 2 <Kbd>##</Kbd></Box>
                                <Box>Code Block <Kbd>```</Kbd></Box>
                                <Box>Block Quote <Kbd>&gt;</Kbd></Box>
                                <Box>List Item <Kbd>*</Kbd></Box>
                                <Box>List Item <Kbd>-</Kbd></Box>
                                <Box>List Item <Kbd>+</Kbd></Box>
                            </Stack>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <FaRegKeyboard onClick={onOpen} size={'2em'}/>
                <ArticleEditor initValue={value} readonly={false} placeholder={"Start writing ..."}/>
                <Input
                    mb={2}
                    type={"text"}
                    variant="flushed"
                    onChange={event => {
                        setMessage(event.target.value);
                        setSignOff(true);
                    }}
                    placeholder={"Describe what you changed"}
                    name={"message"}
                    required/>
                {signOff
                    ? <div/>
                    : <Alert status="warning">
                        <AlertIcon/>
                        Please provide an edit message of what you changed before submitting.
                    </Alert>


                }
                <SubmitButton/>
            </div>
        )
    }
}

//empty required initial value
const initialValue = [
    {
        children: [
            {text: ''},
        ],
    }
    ,
]

export default memo(EditArticle);