import { FormattedMessage } from "react-intl";
import styles from "./buttonBase.module.scss";

function BaseButton({ type = "button", text = "Enter", intlText, className, onClick }: IBaseButton) {
  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} className={[className, styles.buttonBase].join(" ")} onClick={onClick}>
      {intlText ? <FormattedMessage id={intlText} /> : text}
    </button>
  );
}

BaseButton.defaultProps = {
  intlText: "",
  text: "",
  className: "",
};

export default BaseButton;

interface IBaseButton {
  type: "button" | "submit" | "reset" | undefined;
  text?: string;
  intlText?: string;
  className?: string;
  onClick: () => void;
}
