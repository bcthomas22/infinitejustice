export type CreateExploreTabsProps = {
    //true is explore, false is create
    state: boolean
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateExploreTabs(props: CreateExploreTabsProps) {
    return (
      <div className="tabs">
        <button
          className={props.state ? "" : "active"}
          onClick={() => props.setState(false)}
        >
          <span>Create</span>
        </button>

        <button
          className={props.state ? "active" : ""}
          onClick={() => props.setState(true)}
        >
          <span>Explore</span>
        </button>
      </div>
    )
}