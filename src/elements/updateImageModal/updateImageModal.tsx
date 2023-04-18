import { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import styles from "./updateImageModal.module.scss";
import Modal from "../modal/modal";
import BaseButton from "../buttonBase/buttonBase";

export interface UpdateImageModalProps {
  image: File;
  closeModal: () => void;
  updatePic: (v: File) => void;
}

export default function UpdateImageModal(props: UpdateImageModalProps): React.ReactElement {
  const [editor, setEditor] = useState<AvatarEditor>();
  const [scale, setScale] = useState<number>(1);
  // const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const setImgRef = (updatedEditor: AvatarEditor) => {
    setEditor(updatedEditor);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scale + e.deltaY * -0.001 >= 1) {
      setScale(scale + e.deltaY * -0.001);
    }
  };

  // const handlePositionChange = (pos: Position) => {
  //   setPosition(pos);
  // };

  const onClickSaveModifiedImg = () => {
    const cnv = (editor as AvatarEditor).getImageScaledToCanvas();
    cnv.toBlob((blob: unknown) => {
      if (blob) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b: any = blob;
        b.lastModifiedDate = props.image.lastModified;
        b.name = props.image.name;
        props.updatePic(b);
      }
    });
    props.closeModal();
  };

  return (
    <Modal onClosed={() => props.closeModal()}>
      <h2 className={styles.uplHeader}>Upload new photo</h2>
      <p className={styles.uplText}>Please upload a photo. We support JPG, GIF or PNG files.</p>
      <div onWheelCapture={onWheel}>
        <AvatarEditor
          image={URL.createObjectURL(props.image)}
          width={440}
          height={440}
          border={1}
          borderRadius={18}
          color={[0, 0, 0, 0.5]}
          scale={scale}
          rotate={0}
          // todo fix position step
          // position={{ x: 0, y: 0 }}
          // onPositionChange={handlePositionChange}
          ref={(ref: AvatarEditor) => setImgRef(ref)}
        />
      </div>
      <div className={styles.btnContaner}>
        <BaseButton //
          intlText="Back"
          className={styles.buttonWhite}
          onClick={() => props.closeModal()}
        />
        <BaseButton //
          intlText="Save"
          className={styles.buttonBlue}
          onClick={() => onClickSaveModifiedImg()}
        />
      </div>
    </Modal>
  );
}
