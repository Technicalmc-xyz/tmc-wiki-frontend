import React from "react";
import book from "./Home/img/book.png"

const NotFound = () => {
    return (
        <div>
            <img src={book} alt={"Image Not Found Either, oof we cant find anything"}/>
            <h2>Glad to see you are using the trick I discovered!</h2>
            <h2> Sorry we can't find this page </h2>
        </div>
    )
};
export default NotFound;
