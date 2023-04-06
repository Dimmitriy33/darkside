import { useIntl } from "react-intl";
import { WUPPasswordControl } from "web-ui-pack";

WUPPasswordControl.$defaults.clearButton = true;

export default function PasswordControl(props: { init: (el: WUPPasswordControl) => void; intlLabel?: string }) {
  const intl = useIntl();
  return (
    <wup-pwd
      ref={(el) => {
        if (el) {
          if (props.intlLabel !== "") {
            Object.assign(el.$options, {
              label: intl.formatMessage({ id: props.intlLabel }),
            });
          }
          props.init(el);
        }
      }}
    />
  );
}

// Set default props
PasswordControl.defaultProps = {
  intlLabel: "",
};
