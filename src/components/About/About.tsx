import React from "react"
import { Heading,Text } from "@chakra-ui/react"
const About = () => (
    <div>
        <Heading>Purpose</Heading>
        <hr className="dividing-line"/>
        <Text mt={5}>Our initiative for building a wiki for the community is to organize everyone's knowledge into one
            place that is
            accessible and quick to reference. Getting started with technical
            minecraft can be confusing and complicated, but the wiki can help those who
            are new to enter the community. Now that there is a place to store everyone's
            knowledge it also makes it easier and more transparent for large scale projects
            across versions.</Text>
        <Heading mt={5}>Contribute</Heading>
        <hr />
        <Text mt={5}>There are many ways that you can contribute to the project. The project is still getting off the
            ground, and we
            are looking for people to help fill posts on the wiki. The project as of right now is fairly simple,
            but as it
            goes on it could get more complicated, and we are looking for people to help use build. Please consider
            making issues with features that  you would like to see, or sending in pull requests and doing it
            yourself. Currently only myself and another heakte member are working on this project and we appreciate
            all the help we can get.
        </Text>
        <a href="https://technicalmc.xyz/license" className={"link"}><Heading mt={5}>License</Heading></a>
        <hr className="dividing-line"/>
        <Text mt={5}>A short and simple permissive license with conditions only requiring preservation of copyright and
            license
            notices. Licensed works, modifications, and larger works may be distributed under different terms
            and without
            source code.</Text>
        <p>MIT © Jack Baude</p>


    </div>
)

export default About
