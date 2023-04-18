import { useIntl } from "react-intl";
import { WUPCheckControl } from "web-ui-pack";

export default function CheckControl(props: { init: (el: WUPCheckControl) => void; intlLabel?: string }) {
  const intl = useIntl();

  return (
    <wup-check
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
CheckControl.defaultProps = {
  intlLabel: "",
};
