import { ReactElement } from "react";
import { WUPFormElement } from "web-ui-pack";

export default function FormEl(props: { children: ReactElement[]; init: (el: WUPFormElement) => void }) {
  return (
    <wup-form
      ref={(el) => {
        if (el) {
          props.init(el);
        }
      }}
    >
      {props.children}
    </wup-form>
  );
}
