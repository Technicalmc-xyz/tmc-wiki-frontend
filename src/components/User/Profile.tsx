import React, {useEffect, useState} from "react"
import NotAuthenticated from "../ErrorPages/NotAuthenticated";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt, faUserShield} from "@fortawesome/free-solid-svg-icons";
import {createInterface} from "readline";

const Profile = () => {
    const [authenticated, setAuthenticated] = useState(false);
    useEffect(() => {
        getUser().catch(e => console.log(e))
    }, [authenticated]);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userName, setUserName] = useState('')
    const [discordID, setDiscordID] = useState('')
    const [discriminator, setDiscriminator] = useState('')
    const [rank, setRank] = useState('')
    const [mcUsername, setMCUsername] = useState('')
    const [userDataChanged, setUserDataChanged] = useState(false)
    const getUser = async () => {
        const response = await fetch('/api/__userinfo__');
        const data = await response.json();
        console.log(data)
        const auth = data.authenticated;
        setAuthenticated(auth)
        if (auth) {
            setAvatarUrl(data.avatar);
            setUserName(data.username);
            setDiscordID(data.id);
            setDiscriminator(data.discriminator);
            setRank(data.rank);
            setMCUsername(data.mcusername);
        }
    }

    const SubmitButton = () => {
        return userDataChanged ? <button type="submit" className="btn btn-primary">Submit</button> : null;
    }

    interface AdminButtonProps {
        rank: string
    }

    const AdminButton = (props: AdminButtonProps) => {
        if (props.rank === "mod") {
            return (
                <div>
                    <a className={"btn btn-lg mb-3"} href={"/admin"}>Moderate <FontAwesomeIcon icon={faUserShield}
                                                                                               size={"1x"}/></a>
                    <hr/>
                    <a className={"btn btn-lg"}
                       href={"/api/auth/logout"}>Logout <FontAwesomeIcon icon={faSignOutAlt} size={"1x"}/></a>
                </div>)
        } else
            return <a className={"btn btn-lg submit-form-button mt-3"}
                      href={"/api/auth/logout"}>Logout <FontAwesomeIcon icon={faSignOutAlt} size={"1x"}/></a>

    }
    if (authenticated) {
        return (
            <div>
                <img src={`https://cdn.discordapp.com/avatars/${discordID}/${avatarUrl}.png?size=32`}
                     className={"discord-profile-avatar"} alt={"cannot find profile image"}/>
                <hr/>
                <h3>{userName}#{discriminator}</h3>
                <small className="text-muted">{discordID}</small>
                <h5>Rank: {rank}</h5>
                <AdminButton rank={rank}/>

            </div>
        )
    } else return (
        <NotAuthenticated/>
    )
}
export default Profile