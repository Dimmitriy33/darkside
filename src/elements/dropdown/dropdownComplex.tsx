import { offset, createPopper } from "@popperjs/core";
import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./dropdown.module.scss";

export interface DropdownCompProps {
  menuItems: {
    text: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }[];
  onClick?: (item: DropdownCompProps["menuItems"][0]) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function DropdownComplex(props: DropdownCompProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBodyClick = (event: Event) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }
      setIsExpanded(false);
    };
    // todo optimize event listeners
    document.body.addEventListener("click", onBodyClick);

    return () => {
      document.body.removeEventListener("click", onBodyClick);
    };
  }, []);

  useEffect(() => {
    const refUl = ref.current && ref.current.querySelector("ul");
    if (refUl) {
      offset.options = {
        offset: [0, 0],
      };
      const t = createPopper(ref.current?.querySelector("button") as HTMLElement, refUl, {
        placement: "bottom-end",
        modifiers: [offset],
      });
      // requires for prevention blink-effect
      t.forceUpdate();
      setTimeout(() => setIsHidden(false));
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    if (isExpanded) {
      setIsHidden(true);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div ref={ref} className={cx(styles.dropdown, props.className)}>
      <button type="button" onClick={toggleExpanded} className={isExpanded ? styles.activeDropdown : undefined}>
        {props.children}
      </button>
      {isExpanded && (
        <ul role="listbox" style={{ visibility: isHidden ? "hidden" : undefined }}>
          {props.menuItems.map((item, index) => (
            <li
              key={`l${index.toString()}`}
              onClick={() => {
                toggleExpanded();
                item.onClick && item.onClick();
                props.onClick && props.onClick(item);
              }}
              aria-hidden="true" // todo remove it
              data-disabled={item.disabled || undefined}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

DropdownComplex.defaultProps = {
  onClick: () => {
    //
  },
  children: null,
  className: "",
};
