import React, {FC, useEffect, useState} from "react"
import {useLocation} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import ThemeToggle from "./ThemeToggle";
import {faSignInAlt, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import book from "./Home/img/book.png"
import { Link } from "react-router-dom";

const Nav = () => {
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
    const getUser = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        const auth = data.authenticated;
        setAuthenticated(auth);
        if (auth) {
            setAvatarUrl(data.avatar);
            setDiscordID(data.id);
        }
    }
    const UserButton: FC = () => {
        if (authenticated) {
            return (
                <React.Fragment>
                    <li className="nav-item discord-data">
                        <Link to={"/profile"}><img src={`https://cdn.discordapp.com/avatars/${discordID}/${avatarUrl}.png?size=32`} className={"discord-avatar"} alt={"cannot find profile image"}/></Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={"/api/auth/logout"}><FontAwesomeIcon icon={faSignOutAlt} size={"2x"}/></a>
                    </li>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href={"/api/auth?redirect=" + encodeURIComponent(location.pathname)}><FontAwesomeIcon icon={faSignInAlt} size={"2x"}/></a>
                    </li>
                </React.Fragment>
            )
        }
    };
    const NewPost: FC = () => {
        if (authenticated) {
            return <Link className="nav-link link" to="/new-post">New Post</Link>;
        } else {
            return <a className="nav-link link" href={"/api/auth?redirect=" + encodeURIComponent("/new-post")}>New Post</a>;
        }
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <button className="navbar-toggler custom-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggler"
                        aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarToggler">
                    <a className="navbar-brand" href="/"><h1 className={"jello"}><img src={book} alt={"book"} height={"50em"} width={"50em"}/></h1></a>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link link" to="/posts">Posts</Link>
                        </li>
                        <li className="nav-item">
                        <NewPost/>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link link" to="/archive">Archive</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link link" to="/about">About</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <UserButton/>
                        <li>
                            <ThemeToggle/>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
)
}
export default Nav