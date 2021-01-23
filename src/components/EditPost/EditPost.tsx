import React, {useState, useMemo, useCallback, useEffect, FC} from 'react'
import isHotkey from 'is-hotkey'
import {Node, createEditor} from 'slate'
import {
    Slate,
    Editable,
    withReact,
} from 'slate-react'
import {withHistory} from 'slate-history'
import {Toolbar, MarkButton, BlockButton, InsertImageButton, LinkButton, toggleMark} from '../RichUtils'
import {Element, Leaf, withLinks, withImages} from "../Elements";
import {useParams} from "react-router";
import NotAuthenticated from "../ErrorPages/NotAuthenticated";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const EditPost = () => {
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
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(
        () => withImages(withLinks(withHistory(withReact(createEditor())))),
        []
    )


    if (checkedAuth && !authed) {
        return <NotAuthenticated/>
    }

    const submitPost = (event) => {
        event.preventDefault();

        //There must be a change to something to submit an edit
        if ((title === "" || description === "" || tags === "" || window.localStorage.getItem('content') === undefined)) {
            setFailed(true)
            window.scrollTo({top: 0, left: 0, behavior: "smooth"})
            return;
        }
        var send_body = JSON.stringify({
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
    const FailedPost: FC = () => {
        if (failed) {
            return (<div className="alert alert-danger show" role="alert">
                {failedMessage}
            </div>);
        } else {
            return null;
        }
    }
    const SubmitButton: FC = () => {
        if (madeChanges && signOff) {
            return (
                <button className={"btn btn-primary btn-lg submit-form-button"}
                        onClick={submitPost}>Submit Edits
                </button>
            );
        } else {
            return null;
        }
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
            <div className="alert alert-danger" role="alert">Sorry Looks like something is going wrong. Are you sure
                this post exists? Is the API down? Check with Jakku on the Discord.</div>
        )
    }
    if (!success) {
        return (
            <Slate
                editor={editor}
                value={value}
                onChange={value => {
                    setValue(value)
                    setMadeChanges(true)
                    const content = JSON.stringify(value)
                    localStorage.setItem('content', content)
                }}
            >
                <form className={"submit-post"}>
                    <FailedPost/>
                    <label className={"form-input"}>
                        <input
                            type={"text"}
                            className={"form-input"}
                            onChange={event => {
                                setTitle(event.target.value)
                                setMadeChanges(true)
                            }}
                            name={"title"}
                            placeholder="&nbsp;"
                            defaultValue={title}
                            required/>
                        <span className="label">Title</span>
                        <span className="focus-bg"/>
                    </label>
                    <label className={"form-input"}>
                        <input type={"text"}
                               className={"form-input"}
                               onChange={event => {
                                   setDescription(event.target.value)
                                   setMadeChanges(true)
                               }}
                               placeholder="&nbsp;"
                               name={"description"}
                               defaultValue={description}
                               required/>
                        <span className="label">Description</span>
                        <span className="focus-bg"/>
                    </label>
                    <select className={"custom-select"}
                            onChange={event => {
                                setTags(event.target.value)
                                setMadeChanges(true)
                            }}
                            defaultValue={tags}
                            required>
                        <option value="" selected disabled>Select a Category</option>
                        <option value="" disabled>Note: these categories are based off Fallen_Breaths Minecraft Tech Tree v1.3</option>
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
                    </select>
                    <Toolbar>
                        <MarkButton format="bold" icon="format_bold"/>
                        <MarkButton format="italic" icon="format_italic"/>
                        <MarkButton format="underline" icon="format_underlined"/>
                        <MarkButton format="code" icon="code"/>
                        <BlockButton format="heading-one" icon="looks_one"/>
                        <BlockButton format="heading-two" icon="looks_two"/>
                        <BlockButton format="block-quote" icon="format_quote"/>
                        <BlockButton format="numbered-list" icon="format_list_numbered"/>
                        <BlockButton format="bulleted-list" icon="format_list_bulleted"/>
                        <InsertImageButton/>
                        <LinkButton/>
                    </Toolbar>
                    <Editable
                        className={"editor"}
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder="Enter some rich text…"
                        spellCheck
                        autoFocus
                        onKeyDown={event => {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event as any)) {
                                    event.preventDefault()
                                    const mark = HOTKEYS[hotkey]
                                    toggleMark(editor, mark)
                                }
                            }
                        }}
                    />
                    <label className={"form-input"}>
                        <input type={"text"}
                               onChange={event => {
                                   setMessage(event.target.value);
                                   setSignOff(true);
                               }}
                               id={"form-input"}
                               placeholder="&nbsp;"
                               name={"message"}
                               required/>
                        <span className="label">Describe what you changed</span>
                        <span className="focus-bg"/>
                    </label>
                    {signOff
                        ? <div/>
                        : <div className="alert alert-warning" role="alert">Please provide an edit message of what you changed before submitting.</div>
                    }
                    <div className={"spacing-block"}/>
                    <SubmitButton/>

                </form>
            </Slate>
        )
    }
else
    {
        return (
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Success!</h4>
                <hr/>
                <p>We appreciate your contribution to not only the technical minecraft wiki, but also the community as a
                    whole. People like you
                    make this community fun and expanding. Keep up the great work, and we hope to see you again!
                </p>
                <a href={"/render-post/" + id}>Check out your changes to post number {id}!</a>
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

export default EditPost