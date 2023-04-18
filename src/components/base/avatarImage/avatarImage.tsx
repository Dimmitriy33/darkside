import { IUser } from "@/components/account/accountTypes";
import { useState } from "react";
import styles from "./avatarImage.module.scss";

interface AvatarImageProps {
  user: IUser;
  onClick?: () => void;
  isActive?: boolean;
  image?: string;
}

export default function AvatarImage(props: AvatarImageProps): JSX.Element {
  const { user, isActive, image, onClick } = props;
  const [isError, setIsError] = useState(false);
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={[
        styles.profilePic,
        isActive !== undefined && !isActive && styles.outsideFrame,
        isActive !== undefined && isActive && styles.activeOutsideFrame,
        !image ? styles.empty : null,
      ].join(" ")}
      onClick={onClick}
    >
      {image && !isError ? (
        <img src={image} onError={() => setIsError(true)} alt="Profile" />
      ) : (
        [user.firstName[0], props.user.lastName[0]].filter((v) => v).join("")
      )}
    </div>
  );
}
