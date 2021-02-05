//TODO add pagnation
import React, {memo, useEffect, useMemo, useState} from "react"
import {Table, Th, Tr, Td, Thead, Tbody, Input, FormControl, Alert, AlertIcon} from "@chakra-ui/react"
import { FiDownload } from "react-icons/fi"
import {Button} from "../RichUtils";
const Archive = () => {
    const [metadata, setMetadata] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [file, setFile] = useState("")
    const [authed, setAuthed] = useState(false);
    const [checkedAuth, setCheckedAuth] = useState(false);
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
    }, []);
    const getPost = async () => {
        const response = await fetch('/api/archive?')
        const data = await response.json()
        await setMetadata(data);
    };
    const checkAuth = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        setAuthed(data.authenticated);
    };
    const postLink = useMemo(() => Object.entries(metadata).map
        (([id, {name, size, created, link}]) => (
                <Tr key={id}>
                    <Td>{name}</Td>
                    <Td>{created}</Td>
                    <Td>{size} kb</Td>
                    <Td><a href={"/api" + link}><FiDownload/></a></Td>
                </Tr>
            )
        ),
        [metadata]);
    const FormButton = () => {
        if (checkedAuth && !authed) {
            return <div/>
        }
        const file_ext = (file.split('.').pop())
        if (file === "") {
            return <label htmlFor="getFile" className={"btn btn-lg file-input-button"}> Select File To Upload</label>
        } else if (file_ext !== "litematic" && file_ext !== "schematic" && file_ext !== "nbt") {
            return (
                <div/>
            )
        } else {
            return <Button className={"btn btn-lg file-input-button"} type={"submit"} value={"submit"}> {file}</Button>
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
            <Alert status="error">
                <AlertIcon />
                Looks like we can not reach the API.
            </Alert>

        )
    }
    else return (
        <div>
            <FormControl action={"/api/__archive-upload__"} encType={"multipart/form-data"} method={"POST"}>
                <Input id={"getFile"} type={"file"} name={"file"} onChange={(event) => {
                    setFile(event.target.files[0].name)
                }}/>
                <FormButton/>
            </FormControl>
            <Table variant={"striped"}>
                <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Last</Th>
                    <Th>Size</Th>
                    <Th>Download</Th>
                </Tr>
                </Thead>
                <Tbody>
                {postLink}
                </Tbody>
            </Table>
        </div>
    );
}
export default memo(Archive)
