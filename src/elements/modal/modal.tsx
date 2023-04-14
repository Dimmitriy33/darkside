/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
// eslint-disable-next-line no-use-before-define
import { Component, KeyboardEvent } from "react";
import withClickOutside from "react-click-outside";
import ReactDom from "react-dom";
// todo rewrite ytech-js-extensions to support TS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remove from "ytech-js-extensions/lib/array/remove";
import { FiX } from "react-icons/fi";
import styles from "./modal.module.scss";

export const arrayFunctions = { remove };

const ModalRoot = document.getElementById("modal-root");
const IsClosePrevious = false; // if it's true then all modals will be close at the same time

function getSiblings(elem: Node) {
  // Setup siblings array and get the first sibling
  const siblings = [];
  let sibling = elem.parentNode?.firstChild;
  // Loop through each sibling and push to the array
  while (sibling) {
    if (
      sibling.nodeType === 1 &&
      sibling !== elem &&
      // tagName --> nodeName
      sibling.nodeName !== "SCRIPT" &&
      sibling.nodeName !== "NOSCRIPT"
    ) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
}

export interface ModalBodyInsideProps {
  onClickOutside: () => void;
}

class ModalBodyInside extends Component<ModalBodyInsideProps> {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return (
      <div className={styles.body} role="dialog">
        {this.props.children}
      </div>
    );
  }
}

const ModalBody = withClickOutside(ModalBodyInside);
// eslint-disable-next-line no-use-before-define
const ModalsArray: Array<Modal> = [];

export interface ModalProps {
  isOpen?: boolean;
  className?: string;
  onClosed?: () => void;
  hideBtnClose?: boolean;
  maxWidth?: number;
}

export interface ModalState {
  isOpen?: boolean;
  isHidden?: boolean;
}

// eslint-disable-next-line no-shadow
export default class Modal extends Component<ModalProps, ModalState> {
  el: HTMLElement | null = null;

  lastFocused: Element | null = null;

  prevOpenedModal: Modal | undefined = undefined;

  ariaHiddenItems: ChildNode[] | null = null;

  closeBtnEl: HTMLButtonElement | null = null;

  constructor(props: ModalProps) {
    super(props);

    this.state = {
      isOpen: props.isOpen || true,
    };
  }

  componentDidMount() {
    // close modal by pressing Esc button
    this.el?.addEventListener("keydown", (e) => e.keyCode === 27 && this.close());

    this.lastFocused = document.activeElement;

    // hide previousModal
    this.prevOpenedModal = ModalsArray.find((item) => !item.state.isHidden);
    this.prevOpenedModal && this.prevOpenedModal.hide();
    ModalsArray.push(this);

    // hide main scroll
    if (!this.prevOpenedModal) document.body.style.overflow = "hidden";
    if (ModalRoot !== null) {
      this.ariaHiddenItems = getSiblings(ModalRoot);
    }
    this.ariaHiddenItems?.forEach((item) => {
      (item as HTMLElement).setAttribute("aria-hidden", "true");
    });

    // setFocus to the first active element
    const nested = Array.prototype.slice
      .call(
        (this.el as HTMLElement).querySelectorAll('select, input, textarea, button, a, [tabindex="0"], [role="button"]')
      )
      // select only visible elements
      .filter((item) => !!(item.offsetWidth || item.offsetHeight || item.getClientRects().length));
    const last = this.closeBtnEl; // nested.length && nested[nested.length - 1];
    const first = (nested.length && nested[0]) || last;
    if (first) {
      first.focus(); // autoFocus to the first element according to accessibility for Modal

      first.addEventListener("keydown", (e: KeyboardEvent) => {
        // focus to the last by pressing shift+tab
        if (e.which === 9 && e.shiftKey) {
          e.preventDefault();
          last?.focus();
        }
      });

      last?.addEventListener("keydown", (e) => {
        // focus to the first by pressing tab
        if (e.which === 9 && !e.shiftKey) {
          e.preventDefault();
          first.focus();
        }
      });
    }
  }

  componentWillUnmount() {
    this.returnBack();
    arrayFunctions.remove.call(ModalsArray, this);
  }

  returnBack = () => {
    if (this.prevOpenedModal) {
      if (IsClosePrevious) {
        this.prevOpenedModal.close();
      } else {
        this.prevOpenedModal.show(() => this.lastFocused && (this.lastFocused as HTMLElement).focus());
      }
    } else {
      document.body.style.overflow = "";
      this.ariaHiddenItems?.forEach((item) => {
        (item as HTMLElement).removeAttribute("aria-hidden");
      });
    }
    this.lastFocused && (this.lastFocused as HTMLElement).focus();
  };

  close = () => {
    this.setState({ isOpen: false });
    this.returnBack();
    this.props.onClosed && this.props.onClosed();
  };

  hide = () => {
    this.setState({ isHidden: true });
  };

  show = (callback: () => void) => {
    this.setState({ isHidden: false }, callback);
  };

  renderWindow = () => (
    <div
      className={this.props.className}
      ref={(ref) => {
        this.el = ref;
      }}
      style={{ display: this.state.isHidden ? "none" : "", maxWidth: this.props.maxWidth || "" }}
      // style={(this.state.isHidden && { display: "none" }) || undefined}
    >
      <div className={styles.container}>
        <ModalBody onClickOutside={() => !this.state.isHidden && this.close()}>
          {this.props.hideBtnClose ? null : (
            <button
              ref={(ref) => {
                this.closeBtnEl = ref;
              }}
              type="button"
              aria-label="close modal"
              className={styles.close}
              onClick={this.close}
            >
              <FiX />
            </button>
          )}
          {this.props.children}
        </ModalBody>
      </div>
      <div className={styles.overlay} />
    </div>
  );

  render() {
    if (!this.state.isOpen) return null;
    return ReactDom.createPortal(this.renderWindow(), ModalRoot as HTMLElement);
  }
}
