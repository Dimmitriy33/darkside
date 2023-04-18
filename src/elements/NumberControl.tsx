import { useIntl } from "react-intl";
import { WUPNumberControl } from "web-ui-pack";

WUPNumberControl.$defaults.clearButton = true;

export default function NumberControl(props: { init: (el: WUPNumberControl) => void; intlLabel?: string }) {
  const intl = useIntl();

  return (
    <wup-num
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
NumberControl.defaultProps = {
  intlLabel: "",
};
