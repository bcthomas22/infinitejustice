import { User } from "lucide-react";
import { Profie } from "./Profile"; 
import { useState } from "react";

type HeaderProps = {
    //none yet
}

export function Header(_props: HeaderProps) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <>
            <header>
                <button className="header-btn" onClick={() => {}}>
                    Infinite Justice
                </button>
                <button className="header-btn" onClick={toggleSidebar}>
                    <User size={30} />
                </button>
            </header>

            <Profie isOpen={sidebarOpen} onClose={closeSidebar}/>
        </>
    )
}