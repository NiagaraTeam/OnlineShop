const Loading = () => {
    return (
        <div 
            className="spinner-border" role="status" 
            style={{width: "4rem", height: "4rem"}}
        >
            <span className="visually-hidden">Loading...</span>
        </div>
    )
  }
  
  export default Loading