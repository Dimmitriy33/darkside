import { useIntl } from "react-intl";
import { WUPTextControl } from "web-ui-pack";

WUPTextControl.$defaults.clearButton = true;

// eslint-disable-next-line react/require-default-props
export default function TextControl(props: { init: (el: WUPTextControl) => void; intlLabel?: string }) {
  const intl = useIntl();

  return (
    <wup-text
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
TextControl.defaultProps = {
  intlLabel: "",
};
