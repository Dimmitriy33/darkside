import { useRef, useState } from "react";
import promiseWait from "@/helpers/promiseWait";
import Modal from "../modal/modal";
import styles from "./modalConfirm.module.scss";
import BaseButton from "../buttonBase/buttonBase";

interface IConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void | Promise<unknown>;
  onClosed: () => void;
}

export default function ModalConfirm(props: IConfirmModalProps): JSX.Element {
  const [isPending, setPending] = useState(false);
  const ref = useRef<Modal>(null);

  function onConfirm() {
    const p = props.onConfirm();
    if (p instanceof Promise) {
      setPending(true);
      promiseWait(p, 100).finally(() => {
        setPending(false);
        props.onClosed();
      });
    } else {
      props.onClosed();
    }
  }

  return (
    <Modal ref={ref} className={styles.modalContent} onClosed={props.onClosed} hideBtnClose>
      <h2>{props.children}?</h2>
      <div className={styles.btnGroup}>
        <BaseButton disabled={isPending} onClick={() => onConfirm()} text="Yes" />
        <BaseButton
          onClick={() => {
            ref.current?.close();
          }}
          text="No"
        />
      </div>
    </Modal>
  );
}
