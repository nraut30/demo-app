import React, { FC, ReactNode } from "react";
import "./Modal.css";

type ModalProps = {
  title: string;
  children: ReactNode;
  canCancel: boolean;
  onCancel: CallableFunction;
  canConfirm: boolean;
  onConfirm: CallableFunction;
};

const Modal: FC<ModalProps> = (props) => {
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
