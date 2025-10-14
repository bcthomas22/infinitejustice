import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";

export function Leaderboard() {
    
    type User = {
        username: string;
        count: number;
    }

    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const {data} = await supabase
                .from("user_count")
                .select("username, count")
                .order("count", {ascending: false})
                .limit(50);

            setUsers(data);
        } 

        fetchLeaderboard();
    }, [])
    
    return (
        <div className="leaderboard">
            {users?.map((u, i) => {
                if(i === 0) { return (
                    <TopLeaderboardCell
                        key={i}
                        rank={i+1}
                        name={u.username}
                        count={u.count}
                    />
                )} else { return (
                    <LeaderboardCell
                        key={i}
                        rank={i+1}
                        name={u.username}
                        count={u.count}
                    />
                )}
            })}
        </div>
    )
}

type LeaderboardCellProps = {
    key: number;
    rank: number;
    name: string;
    count: number;
}

function TopLeaderboardCell(props: LeaderboardCellProps) {
    return (
        <div className="top-leaderboard-cell">
            <h2 className="top-rank">{props.rank}</h2>
            <h2 className="lead-user">{props.name}</h2>
            <p className="lead-text">Shmacks:</p>
            <h2 className="top-lead-count">{props.count}</h2>
        </div>
    )
}

function LeaderboardCell(props: LeaderboardCellProps) {
    return (
        <div className="leaderboard-cell">
            <h2 className="rank">{props.rank}</h2>
            <h2 className="lead-user">{props.name}</h2>
            <p className="lead-text">Shmacks:</p>
            <h2 className="lead-count">{props.count}</h2>
        </div>
    )
}