import React from "react"
import {Flex, Box} from "@chakra-ui/react";
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
            <a href="https://github.com/Technicalmc-xyz" target={"_blank"} rel="noreferrer noopener">
                <AiFillGithub size={"40"}/>
            </a>
        </Box>
        <Box pr="5">
            <a href="https://www.reddit.com/r/technicalminecraft/" target={"_blank"} rel="noreferrer noopener">
                <AiFillRedditCircle size={"40"}/>
            </a>
        </Box>
        <Box pr="5">
            <a href="https://discord.gg/FcTFg2E" target={"_blank"} rel="noreferrer noopener">
                <FaDiscord size={"40"}/>
            </a>
        </Box>
        <Box pr="5">
            <a href="https://streamelements.com/jjakuu/tip" target={"_blank"} rel="noreferrer noopener">
                <AiFillDollarCircle size={"40"}/>
            </a>
        </Box>
        <Box pr="5">
            <Search/>
        </Box>
    </Flex>
);


export default Footer
