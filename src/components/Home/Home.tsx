import React from "react"
import book from "./img/book.png";

import {Box, Flex, Image, HStack, Heading, Text, chakra, Button} from "@chakra-ui/react";
import {FaGit, FaGithub, FaReddit} from "react-icons/all";
import {Link} from "react-router-dom";

import {FaDiscord} from "react-icons/fa";
import {motion} from "framer-motion"


const Home = () => {
    const MotionBox = motion.custom(Box);
    const spring = {
        type: "spring",
        damping: 10,
        stiffness: 100
    }
    return (
        <>
            <Flex
                align="center"
                justify={{base: "center", md: "space-around", sm: "space-between"}}
                direction={{base: "column-reverse", md: "row"}}
                borderRadius="lg"
                borderWidth="1px"
                minH="15vh"
                px={8}
                shadow="md"
                mb={16}
            >
                <Heading as="h1" size="4xl" isTruncated>
                    Technical Minecraft Wiki
                </Heading>
                <Image src={book} alt={"book"}/>

            </Flex>
            <HStack
                spacing={4} direction="row" align="top"
            >
                <MotionBox
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    flex="1"
                    borderRadius="md"
                    top={"0"}
                >
                    <a href={"/reddit"}><FaDiscord size={"40"}/></a>
                    <Text mt={4}>Come chat with us in the official Technical Minecraft Wiki discord. Channels are
                        open for discussion about specific tech minecraft topics and ideas. We also offer places
                        for recommendations for improvements on the website.</Text>
                </MotionBox>
                <MotionBox
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    flex="1"
                    borderRadius="md"
                    height="50"
                >
                    <a href={"/reddit"}><FaReddit size={"40"}/></a>

                    <Text mt={4}>Be apart of the community and see what other people are doing. Want to join a server?
                        Come
                        here to
                        check out what it means to be apart of the technical minecraft community.</Text>
                </MotionBox>
                <MotionBox
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    flex="1"
                    borderRadius="md"
                    height="50"
                >
                    <a><FaGithub size={"40"}/></a>
                    <Text mt={4}>Our entire code base is open to the public for pull requests and issues. Please make
                        specific
                        issue and feature requests here</Text>

                </MotionBox>
            </HStack>
        </>
    )
}

export default Home
