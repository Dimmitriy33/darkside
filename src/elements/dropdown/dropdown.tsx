/* eslint-disable @typescript-eslint/ban-ts-comment */
import DropdownComplex from "./dropdownComplex";

interface DropdownProps<T> {
  prefix?: React.ReactNode;
  currentValue?: T;
  values: T[];
  onChanged: (v: T) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function Dropdown<T>(props: DropdownProps<T>): JSX.Element {
  return (
    <DropdownComplex //
      className={props.className}
      menuItems={props.values.map((text) => ({ text }))}
      onClick={(v) => props.onChanged(v.text as T)}
    >
      {/* @ts-ignore*/}
      {props.prefix} {props.children || props.currentValue}
    </DropdownComplex>
  );
}

Dropdown.defaultProps = {
  prefix: "",
  currentValue: null,
  children: null,
  className: "",
};
