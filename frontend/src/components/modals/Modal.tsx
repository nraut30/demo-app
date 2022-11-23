import React from "react";
import "./Modal.css";
const Modal = (props: any) => {
  return (
    <div className="modal">
      <header className="modal_header">{props.title}</header>
      <section className="modal_section">{props.children}</section>
      <section className="modal_actions">
        {props.canCancel && (
          <button onClick={() => props.onCancel("cancelSave")} className="btn">
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button onClick={() => props.onConfirm("saveBook")} className="btn">
            Confirm
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
