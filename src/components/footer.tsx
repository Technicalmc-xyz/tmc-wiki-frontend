import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord, faGithub, faReddit} from '@fortawesome/free-brands-svg-icons'
import {faDollarSign} from "@fortawesome/free-solid-svg-icons";

const Footer = () => (
    <div>
        <footer className="page-footer font-small special-color-dark pt-4">
            <div className="container">
                <nav className="list-unstyled list-inline text-center">
                    <a className={"footer-icon"} href="https://github.com/Technicalmc-xyz" target="_blank"
                       rel="noreferrer noopener">
                        <FontAwesomeIcon icon={faGithub} size="2x"/>
                    </a>
                    <a className={"footer-icon"} href="https://discord.gg/FcTFg2E" target={"_blank"}
                       rel={"noreferrer noopener"}>
                        <FontAwesomeIcon icon={faDiscord} size="2x"/>
                    </a>
                    <a className="footer-icon"
                       href="https://www.reddit.com/r/technicalminecraft/" target={"_blank"}
                       rel="noreferrer noopener">
                        <FontAwesomeIcon icon={faReddit} size="2x" color={""}/>
                    </a>
                    <a className="footer-icon" href="https://streamelements.com/jjakuu/tip"><FontAwesomeIcon
                        icon={faDollarSign} size={"2x"} target={"_blank"}/></a>

                </nav>
            </div>
            <div className="footer-copyright text-center py-3">© 2020 Copyright:
                <a className={"link"} rel={"noreferrer noopener"} target={"_blank"}
                   href="https://technicalmc.xyz/license"> technicalmc.xyz</a>
            </div>
        </footer>
    </div>
)

export default Footer
