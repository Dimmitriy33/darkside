import { FormattedMessage } from "react-intl";
import styles from "./buttonBase.module.scss";

function BaseButton({ type = "button", text = "Enter", disabled = false, intlText, className, onClick }: IBaseButton) {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={disabled || false}
      className={[className, styles.buttonBase].join(" ")}
      onClick={onClick}
    >
      {intlText ? <FormattedMessage id={intlText} /> : text}
    </button>
  );
}

export default BaseButton;

interface IBaseButton {
  type?: "button" | "submit" | "reset" | undefined;
  text?: string;
  intlText?: string;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}
