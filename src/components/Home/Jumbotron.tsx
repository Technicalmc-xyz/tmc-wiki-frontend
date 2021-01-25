import React from "react"
import {faDiscord, faGithub, faReddit} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import book from "./img/book.png"
import LatestPosts from "../Posts/LatestPosts";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";

const Jumbotron = () => {
    return (
        // <div className="jumbotron">
        //     <h1 className="display-3">Technical Minecraft Wiki <img src={book} alt={"book:("} id={"book-image"}/></h1>
        //     <p className="lead">Welcome to the Technical Minecraft Wiki.</p>
        //     <hr className="my-4"/>
        //     <LatestPosts/>
        //     <p className="lead">
        //         <a className="btn btn-lg jumbo-link" href="https://github.com/Technicalmc-xyz" target="_blank"
        //            rel="noreferrer noopener" role="button">Contribute <FontAwesomeIcon icon={faGithub} size={"lg"}/></a>
        //         <a className="btn btn-lg jumbo-link" href="https://github.com/Technicalmc-xyz"
        //            target="_blank"
        //            rel="noreferrer noopener" role="button">Issues <FontAwesomeIcon icon={faExclamationCircle}
        //                                                                            size={"lg"}/></a>
        //         <a className="btn btn-lg jumbo-link" href="https://discord.gg/FcTFg2E" target="_blank"
        //            rel="noreferrer noopener" role="button">Connect <FontAwesomeIcon icon={faDiscord} size={"lg"}/></a>
        //     </p>
        // </div>
        <div>
            <div className="jumbotron">
                <div className="container">
                    <h1 className="display-3">Technical Minecraft Wiki <img src={book} alt={""}/></h1>
                    <p className={"lead"}>A wiki for the technical minecraft community to organize everyone's knowledge
                        into one place that is accessible and efficient</p>
                    <p><a className="btn btn-primary btn-md" href="/about" role="button">Learn more</a></p>
                </div>
            </div>

            <div className="container">

                <div className="row">
                    <div className="col-md-4">
                        <h2>Discord</h2>
                        <p>Come chat with us in the official Technical Minecraft Wiki discord. Channels are
                            open for discussion about specific tech minecraft topics and ideas. We also offer places
                            for recommendations for improvements on the website.</p>
                    </div>
                    <div className="col-md-4">
                        <h2>Github</h2>
                        <p> Our entire code base is open to the public for pull requests and issues. Please make
                            specific
                            issue and feature requests here</p>
                    </div>
                    <div className="col-md-4">
                        <h2>Community</h2>
                        <p>Be apart of the community and see what other people are doing. Want to join a server? Come
                            here to
                            check out what it means to be apart of the technical minecraft community.</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <a className="btn" href="https://discord.gg/FcTFg2E" target="_blank"
                           rel="noreferrer noopener" role="button">Connect <FontAwesomeIcon icon={faDiscord}
                                                                                            size={"1x"}/></a>
                    </div>
                    <div className="col-md-4">
                        <a className="btn" href="https://github.com/Technicalmc-xyz" target="_blank"
                           rel="noreferrer noopener" role="button">Contribute <FontAwesomeIcon icon={faGithub}
                                                                                               size={"1x"}/></a>
                    </div>
                    <div className="col-md-4">
                        <a className="btn" href="https://www.reddit.com/r/technicalminecraft/" target="_blank"
                           rel="noreferrer noopener" role="button">Community <FontAwesomeIcon icon={faReddit}
                                                                                               size={"1x"}/></a>
                    </div>
                </div>
                <hr/>
            </div>
        </div>
    );
}

export default Jumbotron
