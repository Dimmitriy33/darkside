import { useIntl } from "react-intl";
import { WUPSelectControl } from "web-ui-pack";

WUPSelectControl.$defaults.clearButton = true;

export default function SelectControl(props: { init: (el: WUPSelectControl) => void; intlLabel?: string }) {
  const intl = useIntl();

  return (
    <wup-select
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
SelectControl.defaultProps = {
  intlLabel: "",
};
