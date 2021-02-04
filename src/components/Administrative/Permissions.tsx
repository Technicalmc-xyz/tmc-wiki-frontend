import React, {memo, useEffect, useMemo, useState} from "react"
import {
    Tbody,
    Tr,
    Th,
    Thead,
    Table,
    Td,
    Select,
    AlertIcon,
    Alert,
    Flex,
    Box,
    toast,
    useToast,
    Image
} from "@chakra-ui/react"

const Permissions = () => {
    interface User {
        id: string;
        username: string;
        rank: string;
        avatar: string;
    }
    const [userData, setUserData] = useState([])
    //default state of the fetch getPost is loading
    const [fetchState, setFetchState] = useState("loading")
    const [filterRank, setFilterRank] = useState('all')
    const [sortType, setSortType] = useState('')
    const toast = useToast();
    useEffect(() => {
        getUsers()
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

    const getUsers = async () => {
        const response = await fetch('/api/__getalluserperms__')
        const data = await response.json()
        console.log(data)
        await setUserData(data);
    };
    const sort = (a, b): number => {
        if (sortType === 'username') {
            return a.Username.localeCompare(b.Username)
        }
        else if (sortType === 'username-reverse') {
            return b.Username.localeCompare(a.Username)
        }
    }
    const handleModify = async (DiscordID, Rank) => {
        fetch("/api/__modifyuserperms__", {
            // Adding method type
            method: "POST",
            // Adding body or contents to send
            body: JSON.stringify({
                discordId: DiscordID,
                rank: Rank
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
            .then((r) =>r.text())
            .then((r) =>
                toast({
                title: r,
                position: "top",
                status: "success",
                duration: 5000,
                isClosable: true,
            }))
    };
    const userTable = useMemo(() => userData
            .sort((a,b) => sort(a,b))
            .filter(user => user.rank === filterRank || filterRank === 'all')
            .map(({id, username, rank, avatar}: User) => (
                    <Tr>
                        <Td>
                            <Image
                            borderRadius={"full"}
                            border={"1px"}
                            src={`https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=40`}
                            alt={"cannot find profile image"}/>
                        </Td>
                        <Td>{username}</Td>
                        <Td>{id}</Td>
                        <Td>
                            <Select defaultValue={rank} onChange={event => {
                                handleModify(id, event.target.value)
                                getUsers()
                            }}>
                                <option value="banned">Banned</option>
                                <option value="guest">Guest</option>
                                <option value="trusted">Trusted</option>
                                <option value="editor">Editor</option>
                                <option value="dev">Dev</option>
                                <option value="mod">Mod</option>
                            </Select>
                        </Td>
                    </Tr>
                )
            ),
        [userData, filterRank, sortType]);

    const filterRole = () => {
        return (
            <div>
                <Select defaultValue={"all"}
                        mb={2}
                        onChange={event => setFilterRank(event.target.value)}>
                    <option value="all">All</option>
                    <option value="banned">Banned</option>
                    <option value="guest">Guest</option>
                    <option value="trusted">Trusted</option>
                    <option value="editor">Editor</option>
                    <option value="dev">Dev</option>
                    <option value="mod">Mod</option>
                </Select>
                <Select
                    mv={2}
                        onChange={event => {
                            setSortType(event.target.value)
                        }}>
                    <option value="username" selected>Username A-Z</option>
                    <option value="username-reverse">Username Z-A</option>
                </Select>
            </div>
        )
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
        return(<Alert status="error">
            <AlertIcon/>
            Sorry you are not allowed to access this part of the website!
        </Alert>);
    } else return (
        <Box>
            {filterRole()}
            <Table variant={"striped"}>
                <Thead>
                <Tr>
                    <Th scope="col"/>
                    <Th scope="col">Username</Th>
                    <Th scope="col">DiscordID</Th>
                    <Th scope="col">Rank</Th>
                </Tr>
                </Thead>
                <Tbody>
                {userTable}
                </Tbody>
            </Table>
        </Box>
    );
}
export default memo(Permissions)