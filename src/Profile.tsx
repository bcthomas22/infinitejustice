import { } from "react";

type ProfileProps = {
    isOpen: boolean;
    onClose(): void;
}

export function Profie(props: ProfileProps) {

    return (
        <div className={"sidebar" + (props.isOpen ? " open" : "")}>
            <button className="close-btn" onClick={props.onClose}>
                ✖
            </button>

            <div className="sidebar-sect">
                😭🙏
            </div>
        </div>
    )
}