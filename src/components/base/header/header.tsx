import { Link, useNavigate } from "react-router-dom";
import useTypedSelector from "@/redux/typedSelector";
import { urlAboutUs, urlCart, urlHome, urlLogin, urlProducts, urlUser } from "@/mainRouterPathes";
import logo from "images/logo-no-background.png";
import { useCallback, useState } from "react";
import { apiLogout } from "@/api/apiAccount";
import { FormattedMessage, useIntl } from "react-intl";
import Dropdown from "@/elements/dropdown/dropdown";
import BaseButton from "@/elements/buttonBase/buttonBase";
import Store, { Types } from "@/redux";
import { FiBriefcase } from "react-icons/fi";
import styles from "./header.module.scss";
import AvatarImage from "../avatarImage/avatarImage";

export default function Header(): JSX.Element {
  const [langCheck, setLangCheck] = useState(false);
  const user = useTypedSelector((state) => state.currentUser);
  const cartItems = useTypedSelector((v) => v.cart);
  const intl = useIntl();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    await apiLogout();
  }, []);

  const editButtons = [
    {
      text: intl.formatMessage({ id: "UserPage" }),
      onClick: () => navigate(urlUser),
    },
    {
      text: intl.formatMessage({ id: "Logout" }),
      onClick: () => logout(),
    },
  ];

  return (
    <div className={styles.header}>
      <Link to={urlHome}>
        <img className={styles.logo} src={logo} alt="Logo" />
      </Link>

      <div className={styles.menuNav}>
        <div>
          <Link to={urlProducts}>
            <FormattedMessage id="Products" />
          </Link>
        </div>
        <div>
          <Link to={urlAboutUs}>
            <FormattedMessage id="AboutUs" />
          </Link>
        </div>
      </div>
      <button
        className={styles.btnLang}
        type="button"
        onClick={() => {
          setLangCheck(!langCheck);
          Store.dispatch({
            type: Types.SWITCHLANG,
            data: {
              lang: langCheck ? "en" : "ru",
            },
          });
        }}
      >
        {langCheck ? "en" : "ru"}
      </button>
      {user ? (
        <>
          <button
            className={styles.btnCart}
            type="button"
            onClick={() => {
              navigate(urlCart);
            }}
          >
            <span>{cartItems.length}</span>
            <FiBriefcase />
          </button>
          <span className={styles.username}>{`${user.firstName} ${user.lastName}`}</span>
          <AvatarImage user={user} />
          <Dropdown
            values={editButtons.map((v) => v.text)}
            className={styles.avatarImageMenu}
            onChanged={(text) => {
              editButtons.find((b) => b.text === text)?.onClick();
            }}
          />
        </>
      ) : (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <BaseButton className={styles.btnLogin} type="button" onClick={() => navigate(urlLogin)} intlText="Login" />
      )}
    </div>
  );
}
