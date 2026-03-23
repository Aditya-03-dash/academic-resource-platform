import "../styles/tag.css";

function Tag({label}){

  return(
    <span className="tag-chip">
      {label}
    </span>
  )

}

export default Tag