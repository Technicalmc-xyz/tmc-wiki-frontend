import React, {useEffect, useState} from "react"
import NotAuthenticated from "../ErrorPages/NotAuthenticated";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    useEffect(() => {
        getUser().catch(e => console.log(e))
    }, []);
    const [authenticated, setAuthenticated] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [userName, setUserName] = useState('')
    const [discordID, setDiscordID] = useState('')
    const [discriminator, setDiscriminator] = useState('')
    const [rank, setRank] = useState('')
    // const [mcUsername, setMCUsername] = useState('')
    // const [userDataChanged, setUserDataChanged] = useState(false)
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
            // setMCUsername(data.mcusername);
        }
    }

    // const SubmitButton = () => {
    //     return userDataChanged ? <button type="submit" className="btn btn-primary">Submit</button> : null;
    // }

    if (authenticated) {
        return (
            <div>
                <img src={`https://cdn.discordapp.com/avatars/${discordID}/${avatarUrl}.png?size=32`}
                     className={"discord-profile-avatar"} alt={"cannot find profile image"}/>
                <hr/>
                <h3>{userName}#{discriminator}</h3>
                <small className="text-muted">{discordID}</small>

                <h5>Rank: {rank}</h5>
                {/*TODO add form to edit other information about user*/}
                {/*<form>*/}
                {/*    <div className="form-group">*/}
                {/*        <label htmlFor="exampleInputEmail1">Minecraft Username</label>*/}
                {/*        <input className="form-control" id="exampleInputEmail1"*/}
                {/*               aria-describedby="mcNa,e" placeholder="Enter Minecraft Username" defaultValue={mcUsername}*/}
                {/*               onChange={() => setUserDataChanged(true)}/>*/}
                {/*    </div>*/}
                {/*    <SubmitButton/>*/}
                {/*</form>*/}
                <a className={"btn btn-primary btn-lg submit-form-button"} href={"/api/auth/logout"}>Logout <FontAwesomeIcon icon={faSignOutAlt} size={"1x"}/></a>
            </div>
        )
    } else return (
        <NotAuthenticated/>
    )
}
export default Profile