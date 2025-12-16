const DropDown = ({title, children}:any) => {
    return (
        <div className="dropdown">
            <h5 className="dropdown-toggle">{title}</h5>
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span className="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul className="dropdown-menu">
                {children}
            </ul>
        </div>
    );
}
export default DropDown;