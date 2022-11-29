import React, { FC } from "react";
import Backdrop from "../backdrop/Backdrop";
import Modal from "../modals/Modal";
import styles from "./MessagePopUp.module.css";

type MessagePopUpType = {
  title: string;
  message: string;
  onConfirmHandler: CallableFunction;
};

const MessagePopUp: FC<MessagePopUpType> = (props) => {
  return (
    <>
      <Backdrop />
      <Modal
        title={props.title}
        canCancel={false}
        canConfirm={true}
        onCancel={() => {}}
        onConfirm={props.onConfirmHandler}
      >
        <div className={styles.messageContainer}>{props.message}</div>
      </Modal>
    </>
  );
};

export default MessagePopUp;
