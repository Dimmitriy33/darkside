import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import BaseButton from "@/elements/buttonBase/buttonBase";
import imgBg1 from "images/abour-us-home.jpg";
import styles from "./aboutUsHome.module.scss";

export default function AboutUsHome(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className={styles.aboutUsHome}>
      <img src={imgBg1} alt="img" />
      <div className={styles.aboutUsHome__body}>
        <h4>
          <FormattedMessage id="HomeText2" />
        </h4>
        <h3>
          <FormattedMessage id="AboutUsSub" />
        </h3>
        <p>
          <FormattedMessage id="AboutUsSubP" />
        </p>
        <BaseButton onClick={() => alert("ok")} intlText="AboutUs" type="button" />
      </div>
    </div>
  );
}
