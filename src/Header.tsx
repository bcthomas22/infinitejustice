import { Trophy, User } from "lucide-react";
import { Profie } from "./Profile"; 
import { useState } from "react";

export function Header() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header>
                <button className="header-btn">
                    <Trophy size={30} />
                </button>
                <button className="header-btn">
                    Shmack Counter
                </button>
                <button className="header-btn" onClick={toggleSidebar}>
                    <User size={30} />
                </button>
            </header>

            <Profie isOpen={sidebarOpen} onClose={closeSidebar}/>
        </>
    )
}