import React, {useEffect, useState} from "react"
import book from "./Home/img/book.png";
import {
    Box,
    Text,
    Flex,
    Button,
    Image,
    useColorMode,
    useDisclosure,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Input,
    DrawerFooter,
    Drawer,
} from "@chakra-ui/react"
import {Link, useLocation} from "react-router-dom";

import {FiLogIn, FiLogOut, FiMenu, FiMoon, FiSun} from 'react-icons/fi'


const MenuItems = ({children, to}) => (
    <Link to={to}>
        <Text mt={{base: 4, md: 0}} mr={4} ml={4} display="block">
            {children}
        </Text>
    </Link>

);

interface UserProps {
    authenticated: boolean;
    id: string;
    avatar: string;
    location: string;
}

export const Search = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const btnRef = React.useRef()
    return (
        <>
                <Button ref={btnRef} colorScheme="teal" onClick={onOpen} mr={3} variant={"outline"} disabled>
                    Search
                </Button>

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerCloseButton/>
                        <DrawerHeader>Search </DrawerHeader>

                        <DrawerBody>
                            <Input autoFocus={true} placeholder="Type here..."/>
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant="outline" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button color="green">Search</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
}

const UserButton = (props: UserProps) => {
    if (props.authenticated) {
        return (
            <React.Fragment>
                <Link to={"/profile"}>
                    <Image
                        mr={2}
                        borderRadius={"full"}
                        border={"1px"}
                        src={`https://cdn.discordapp.com/avatars/${props.id}/${props.avatar}.png?size=40`}
                        alt={"cannot find profile image"}/>
                </Link>
                <a href={"/api/auth/logout"}><Button mr={2} variant={"outline"}><FiLogOut size={"25"}/></Button></a>
            </React.Fragment>
        )
    } else {
        return (
            <a href={"/api/auth?redirect=" + encodeURIComponent(props.location)}><Button mr={2}
                                                                                         variant={"outline"}><FiLogIn
                size={"25"}/></Button></a>

        );
    }
};
const Admin = (props) => {
    if (props.rank === "mod")
        return (
            <MenuItems to={"/admin"}>Admin</MenuItems>
        )
    else return null;
}
const Nav = props => {
    const {colorMode, toggleColorMode} = useColorMode()
    const [show, setShow] = React.useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();
    useEffect(() => {
        getUser()
            .catch(() => {
                setAuthenticated(false);
            });
    }, []);
    const [authenticated, setAuthenticated] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [discordID, setDiscordID] = useState('');
    const [rank, setRank] = useState('');
    const getUser = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        const auth = data.authenticated;
        setAuthenticated(auth);
        if (auth) {
            setAvatarUrl(data.avatar);
            setDiscordID(data.id);
            setRank(data.rank)
        }
    }
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            color="white"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Link to={"/"}>
                    <Image
                        boxSize="40px"
                        src={book}
                        alt={"book"}
                    />
                </Link>
            </Flex>

            <Box display={{base: "block", md: "none"}} onClick={() => {
                setIsOpen(!isOpen)
                setShow(!show)
            }}>
                <FiMenu size={"25"}/>
            </Box>

            <Box
                display={{sm: show ? "block" : "none", md: "flex"}}
                width={{sm: "full", md: "auto"}}
                alignItems="center"
                flexGrow={1}
            >
                <MenuItems to={"/articles"}>Articles</MenuItems>
                <MenuItems to={"/new-article"}>New Article</MenuItems>
                <MenuItems to={"/archive"}>Archive</MenuItems>
                <MenuItems to={"about"}>About</MenuItems>
                <Admin rank={rank}/>
            </Box>

            <Box
                display={{sm: show ? "block" : "none", md: "flex"}}
                mt={{base: 4, md: 0}}
            >
                <Search/>
                <UserButton authenticated={authenticated} id={discordID} avatar={avatarUrl}
                            location={location.pathname}/>
                <Button onClick={toggleColorMode} variant={"outline"}>
                    {colorMode === "light" ? <FiMoon size={"30"}/> : <FiSun size={"30"}/>}
                </Button>
            </Box>
        </Flex>
    );
};


export default Nav