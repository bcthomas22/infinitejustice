import { use, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { supabase } from "./supabaseClient";

type ProfileProps = {
    isOpen: boolean;
    onClose(): void;
}

export function Profie(props: ProfileProps) {

    const [username, setUsername] = useState<null | string>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUsername(user?.user_metadata.username);
        }

        if(props.isOpen) fetchUser();
    }, [props.isOpen])

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className={"sidebar" + (props.isOpen ? " open" : "")}>
            <button className="close-btn" onClick={props.onClose}>
                ✖
            </button>

            <div className="sidebar-sect">
                <h2 className="profile-text">Profile</h2>
            </div>

            <div className="sidebar-sect">
                <p>Username:</p>
                <Username username={username ?? ""} setUsername={setUsername}/>
            </div>

            <div className="sidebar-sect">
                <p>Shmacks:</p>
                <h2>1234</h2>
            </div>

            <div className="sidebar-sect">
                <button className="sign-out" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}

type UsernameProps = {
    username: string;
    setUsername: Dispatch<SetStateAction<string | null>>
}

function Username(props: UsernameProps) {

    const [changingUsername, setChangingUsername] = useState<boolean>(false);

    const updateUsername = async () => {
        await supabase.auth.updateUser({
            data: { username: props.username},
        });
    }

    return (
        changingUsername ? (
            <input
                type="text"
                value={props.username}
                onChange={e => props.setUsername(e.target.value)}
                onBlur={() => {
                    setChangingUsername(false)
                    updateUsername()
                }}
            />
        ):(
            <h2 
                className="username-text"
                onClick={() => setChangingUsername(true)}
            >{props.username}</h2>
        )
    )
}