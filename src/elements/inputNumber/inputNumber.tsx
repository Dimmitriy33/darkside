import { useState } from "react";
import styles from "./inputNumber.module.scss";

export default function InputNumber(props: {
  initValue: number;
  value?: number;
  disabled?: boolean;
  triggerUpdate: (v: number) => void;
  minV?: number;
  maxV?: number;
}) {
  const [valueV, setValueV] = useState(props.initValue);

  return (
    <input
      className={styles.inputNum}
      type="number"
      disabled={props.disabled}
      min={props.minV}
      max={props.maxV}
      value={props.value || valueV}
      onChange={(e) => setValueV(Number(e.target.value))}
      onBlur={() => props.triggerUpdate(valueV)}
    />
  );
}
