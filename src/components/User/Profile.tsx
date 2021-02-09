import React, {useEffect, useState, memo} from "react"
import {RiAdminFill} from "react-icons/all";
import {FiLogIn, FiLogOut} from "react-icons/fi";
import {
    Box,
    HStack,
    Text,
    Avatar,
    Badge,
    Stack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import {useLocation} from "react-router-dom";

const Profile = () => {
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        getUser()
            .catch(() => {
                setAuthenticated(false);
            });
    }, [authenticated]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userName, setUserName] = useState('')
    const [discordID, setDiscordID] = useState('')
    const [discriminator, setDiscriminator] = useState('')
    const [rank, setRank] = useState('')
    const getUser = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        console.log(data)
        const auth = data.authenticated;
        setAuthenticated(auth)
        if (auth) {
            setAvatarUrl(data.avatar);
            setUserName(data.username);
            setDiscordID(data.id);
            setDiscriminator(data.discriminator);
            setRank(data.rank);
        }
    }
    const location = useLocation();

    interface AdminButtonProps {
        rank: string
    }

    const AdminButton = (props: AdminButtonProps) => {
        if (props.rank === "mod") {
            return (
                <Box>
                    <HStack>
                        <a href={"/admin"}><RiAdminFill size={"40"}/></a>
                        <hr/>
                        <a href={"/api/auth/logout"}><FiLogOut size={"40"}/></a>
                    </HStack>
                </Box>)
        } else
            return <a className={"btn btn-lg submit-form-button mt-3"}
                      href={"/api/auth/logout"}>Logout <FiLogIn size={"40"}/></a>

    }
    if (authenticated) {
        return (
            <Stack>
                    <Avatar borderRadius={"full"}
                               border={"1px"}
                               boxShadow={"xl"}
                               width={"4vw"}
                               height={"4vw"}
                               mb={2} src={`https://cdn.discordapp.com/avatars/${discordID}/${avatarUrl}`}
                               alt={"cannot find profile image"}/>
                    <Box ml="3">
                        <Text fontWeight="bold">
                            {userName}#{discriminator}
                            <Badge ml="1" colorScheme="green">
                                {rank}
                            </Badge>
                        </Text>
                        <Text fontSize={"sm"}>{discordID}</Text>

                    </Box>
                <AdminButton rank={rank}/>
            </Stack>

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
                    You are not logged in!
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    <u><a href={"/api/auth?redirect=" + encodeURIComponent(location.pathname)}>Please login to view your profile</a></u>
                </AlertDescription>
            </Alert>
        )
    }
}
export default memo(Profile)