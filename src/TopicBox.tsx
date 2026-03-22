import { Bot } from "lucide-react"

type TopicBoxProps = {
    topic1: string | null;
    topic2: string | null;
    rating: number | undefined | null;
    isHuman: boolean;
    isChain: boolean;
}

export function TopicBox(props: TopicBoxProps) {

    const determineRatingColor = (rating: number | undefined, isHuman: boolean): string => {
        if (!isHuman)
            return "cyan-rating"
        if (rating == undefined)
            return "grey-rating"
        if (rating >= 90)
            return "green-rating"
        if (rating >= 80)
            return "yellow-green-rating"
        if (rating >= 70)
            return "yellow-rating"
        if (rating >= 60)
            return "orange-rating"
        if (rating >= 50)
            return "orange-red-rating"
        if (rating >= 0)
            return "red-rating"
        return "grey-rating"
    }

    return (
        <div className="topic-box">
            <div className="topic-box-topic1">
                <div className="topic-box-topic1-text">
                    {props.topic1 ?? <div className="loading"></div>}
                </div>
                <div className="topic-box-leads-to">
                    {props.isChain ? "chains to..." : "leads to..."}
                </div>
            </div>
            <div className="topic-box-topic2">
                <p className="topic-box-topic2-text">
                    {props.topic2 ?? <div className="loading"></div>}
                </p>
            </div>
            <div className={`topic-box-rating ${determineRatingColor(props.rating ?? undefined, props.isHuman)}`}>
                {props.rating === undefined ? (<Bot size="35"/>) : props.rating ?? <div className="loading"></div>}
            </div>
            <div className={`topic-box-is-human ${props.isChain ? "" : props.isHuman ? "is-human-text" : "is-ai-text"}`}>
                {props.isChain ? "Chain" : props.isHuman ? "Human" : "AI"}
            </div>
        </div>
    )
}