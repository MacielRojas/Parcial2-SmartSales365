import { OverlayTrigger, Popover } from "react-bootstrap";

const PopOver = () => {
    return (
        <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            overlay={
                <Popover>
                    <Popover.Header>Ayuda</Popover.Header>
                    <Popover.Body>
                        Aquí puedes encontrar información útil.
                    </Popover.Body>
                </Popover>
            }
        >
            <button className="btn btn-light">
                <i className="bi bi-question-circle"></i>
            </button>
        </OverlayTrigger>

    );
}

export default PopOver;