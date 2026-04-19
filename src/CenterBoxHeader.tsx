import { PanelLeft } from "lucide-react";
import logo from '../public/InfJustLogo.svg';

type CenterBoxHeaderProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CenterBoxHeader(props: CenterBoxHeaderProps) {
    return (
        <div className="center-box-header">
            <button 
                className="icon-button" 
                onClick={() => {props.setIsSidebarOpen(!props.isSidebarOpen)}}
            >
                <PanelLeft/>
            </button>
            <span className="header-main-text">Infinite Justice</span>
            <img className="header-logo" src={logo}/>
        </div>
    )
}