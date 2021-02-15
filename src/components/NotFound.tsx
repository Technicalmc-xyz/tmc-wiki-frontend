import React from "react";
import book from "./Home/img/book.png"
import {Image, Heading} from "@chakra-ui/react"
const NotFound = () => {
    return (
        <div>
            <Image src={book} alt={"Image Not Found Either, oof we cant find anything"}/>
            <Heading size={"md"}>Glad to see you are using the trick I discovered!</Heading>
            <Heading size={"md"}> Sorry we can't find this page </Heading>
        </div>
    )
};
export default NotFound;
