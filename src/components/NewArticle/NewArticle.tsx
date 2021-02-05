import React, {useState, useEffect} from 'react'
import ArticleEditor from "../ArticleEditor";
import {FormControl, Input, Select, Box, Button, AlertIcon, AlertTitle, AlertDescription, Alert} from '@chakra-ui/react'
import {Link} from 'react-router-dom'

const NewArticle = () => {
    useEffect(() => {
        checkAuth().then(() => setCheckedAuth(true)).catch(() => {
            setAuthed(false);
            setCheckedAuth(true);
        });
    }, []);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')
    const [failed, setFailed] = useState(false)
    const [, setSubmitted] = useState(false)
    const [madeChanges, setMadeChanges] = useState(false)
    const [success, setSuccess] = useState(false)
    const [authed, setAuthed] = useState(false);
    const [checkedAuth, setCheckedAuth] = useState(false);

    const checkAuth = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        setAuthed(data.authenticated);
    };

    if (checkedAuth && !authed) {
        return <Box>
            <Alert status="error">
                <AlertIcon/>
                You must be logged in before creating an article
            </Alert>
            <a href={"/api/auth"}><Button mt={4}>Login</Button></a>
        </Box>
    }

    const submitPost = () => {
        // if the title, description, or tags are empty
        if ((title === "" || description === "" || tags === "")) {
            //set the fail state to true, which renders in the alert, then scroll to the top, and return before it submits the post
            setFailed(true)
            window.scrollTo({top: 0, left: 0, behavior: "smooth"})
            return
        }
        const body = JSON.stringify({
            title: title,
            description: description,
            tags: tags,
            body: window.localStorage.getItem('content')
        })

        fetch("/api/__newpost__", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: body,
            // Adding headers to the request
            redirect: "follow",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            }

        })
            // .then(r => window.location.href = r.url)
            .then(() => {
                setSubmitted(true)
                setSuccess(true)
            })
            .catch(() => {
                setFailed(true)
            })

    }

    const FailedPost = () => {
        if (failed) {
            return (<div className="alert alert-danger show" role="alert">
                <strong>Woah there something went wrong!</strong> Are you sure you filled in all the fields?
            </div>);
        } else {
            return null;
        }
    }

    const SubmitButton = () => {
        if (madeChanges) {
            return (
                <Button mt={10} onClick={submitPost}>Create Post</Button>
            );
        } else
            return null;
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
                    Thank you for your submission! Your article will be held until a moderator approves it. Until then
                    check out <u><Link
                    to={"/articles"}>some other articles!</Link></u>
                </AlertDescription>
            </Alert>
        )
    } else {
        return (
            <div>
                <FailedPost/>
                <FormControl>
                    <Input
                        id={"title"}
                        mb={2}
                        type={"text"}
                        variant="flushed"
                        onChange={event => {
                            setTitle(event.target.value)
                            setMadeChanges(true)
                        }}
                        name={"title"}
                        placeholder="Title"
                        isRequired={true}
                    />


                    <Input
                        id={"description"}
                        mb={2}
                        type={"text"}
                        variant="flushed"
                        onChange={event => {
                            setDescription(event.target.value)
                            setMadeChanges(true)
                        }}
                        placeholder="Description"
                        name="description"
                        isRequired={true}
                    />
                    <Select
                        id={"tag"}
                        mb={10}
                        defaultValue={"disabled"}
                        onChange={event => {
                            setTags(event.target.value)
                            setMadeChanges(true)
                        }}
                        required>
                        <option value="disabled" disabled>Select a Category</option>
                        <option value="Block Resource">Block Resource</option>
                        <option value="Block Farming">Block Farming</option>
                        <option value="Mob Resource">Mob Resource</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Animal Husbandry">Animal Husbandry</option>
                        <option value="World Manipulation">World Manipulation</option>
                        <option value="World Transportation">World Transportation</option>
                        <option value="Traffic">Traffic</option>
                        <option value="Resource Management and Processing">Resource Management and Processing
                        </option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="Community">Community</option>

                    </Select>
                </FormControl>
                <ArticleEditor initValue={initialValue} readonly={false} placeholder={"Start writing ..."}/>
                <SubmitButton/>
            </div>
        )
    }
}

const initialValue = [
    {
        children: [
            {text: ''},
        ],
    },
]

export default NewArticle
