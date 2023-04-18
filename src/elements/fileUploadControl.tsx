import { useEffect, useRef, useState } from "react";
import UpdateImageModal from "./updateImageModal/updateImageModal";

export interface FileUploadProps {
  className?: string;
  onClosed?: () => void;
  updatePic: (v: File) => void;
}

export default function FileUploadControl(props: FileUploadProps): React.ReactElement {
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File>();
  const [updateImage, toogleUpdateImage] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files && files.length) {
      const file: File = files[0];
      const pattern = /image-*/;

      if (!file.type.match(pattern)) {
        props.onClosed && props.onClosed();
        throw new Error("Invalid file format");
      }

      setImage(files[0]);
      toogleUpdateImage(true);
    }
  };

  const onClose = () => {
    toogleUpdateImage(false);
    props.onClosed && props.onClosed();
  };

  useEffect(() => {
    inputFile.current?.click();
  }, []);

  return (
    <div className={props.className}>
      <input //
        style={{ display: "none" }}
        ref={inputFile}
        onChange={(event) => handleFileUpload(event)}
        type="file"
        accept="image/*"
      />
      {updateImage ? (
        <UpdateImageModal //
          closeModal={() => onClose()}
          updatePic={(v: File) => props.updatePic(v)}
          image={image as File}
        />
      ) : null}
    </div>
  );
}
