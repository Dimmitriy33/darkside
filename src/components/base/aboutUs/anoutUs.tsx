import { FormattedMessage, useIntl } from "react-intl";
import styles from "./aboutUs.module.scss";
import Header from "../header/header";

export default function AboutUs() {
  const intl = useIntl();

  return (
    <>
      <Header />
      <div className={styles.aboutUs}>
        <h2>
          <FormattedMessage id="AboutUs" />
        </h2>
        <p>
          <FormattedMessage id="AboutUs1" />
        </p>
        <p>
          <FormattedMessage id="AboutUs2" />
        </p>
        <p>
          <FormattedMessage id="AboutUs3" />
        </p>
        <p>
          <FormattedMessage id="AboutUs4" />
        </p>
        <p>
          <FormattedMessage id="AboutUs5" />
        </p>
        <p>
          <FormattedMessage id="AboutUs6" />
        </p>
        <p>
          <FormattedMessage id="AboutUs7" />
        </p>

        <div className={styles.contacts}>
          <p>Contacts: +375292929292</p>
          <p>Email: darkside@gmail.com</p>
        </div>
      </div>
    </>
  );
}
