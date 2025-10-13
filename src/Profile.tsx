import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type ProfileProps = {
    isOpen: boolean;
    onClose(): void;
}

export function Profie(props: ProfileProps) {

    const [username, setUsername] = useState<null | string>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    useEffect(() => {
        const username: string = getUsername();
        setUsername(username)
    }, [])

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
                <h2>My Username</h2>
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