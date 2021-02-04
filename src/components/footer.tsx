import React from "react"
import {Link} from "react-router-dom";
import {Flex, Stack, Heading, Text, Box, HStack, Image, Button, Center, GridItem, Grid, Spacer} from "@chakra-ui/react";
import book from "./Home/img/book.png";
import {FiMenu, FiMoon, FiSun} from "react-icons/fi";
import {AiFillGithub, AiFillRedditCircle, AiFillDollarCircle} from "react-icons/ai";
import {FaDiscord} from "react-icons/fa";
import {Search} from "./nav";

const Footer = () => (
    <Flex
        as="footer"
        padding="1.5rem"
        justify={"center"}
        color="white"
        bottom={"0"}
        pos="absolute"
        width={"100%"}
        minHeight={"9vh"}
        maxHeight={"11vh"}
        justifyContent={"center"}
        alignItems={"center"}
    >
        <Box pr="5">
            <AiFillGithub size={"40"}/>
        </Box>
        <Box pr="5">
            <AiFillRedditCircle size={"40"}/>
        </Box>
        <Box pr="5">
            <FaDiscord size={"40"}/>
        </Box>
        <Box pr="5">
            <AiFillDollarCircle size={"40"}/>
        </Box>
        <Box pr="5">
            <Search/>
        </Box>
    </Flex>
);


export default Footer
