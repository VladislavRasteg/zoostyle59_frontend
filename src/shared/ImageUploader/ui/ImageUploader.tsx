import s from './ImageUploader.module.scss'
import React, {ChangeEvent, DragEvent, FC, useCallback, useEffect, useRef, useState} from "react";
import {ReactComponent as FilesIcon} from "@/assets/files.svg"
import {IconClose} from "@arco-design/web-react/icon";
import {truncateText} from "@/utils/truncateText";
import { Button } from '@/shared/Button';
import { Title } from '@/shared/Title';

interface IImageUploaderProps {
  uploadFilesHandler: (files: File[]) => void
  filename: string | undefined;
  imageLink: string | File | undefined | null;
  name: string;
}

export const ImageUploader: FC<IImageUploaderProps> = ({uploadFilesHandler, filename, imageLink, onDelete, name}) => {

  const handle_file_input = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newFiles = Array.from(e.dataTransfer.files)
    uploadFilesHandler && uploadFilesHandler(newFiles)
  }, [])

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleFileInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newFiles = Array.from(e.target.files as FileList)
    uploadFilesHandler && uploadFilesHandler(newFiles)
    clearFileInputValue()
  }, [])

  const clearFileInputValue = () => {
    if (handle_file_input.current) {
      handle_file_input.current.value = '';
      if (handle_file_input.current.files) {
        handle_file_input.current.files = null;
      }
    }
  }

  const deleteImage = () => {
    uploadFilesHandler([])
    clearFileInputValue()
    setImageSrc(undefined)
  }

  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (imageLink instanceof File) {
      const url = URL.createObjectURL(imageLink);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageLink === 'string') {
      setImageSrc(imageLink);
    }
  }, [imageLink]);

  return (
    <div className={s.uploader_wrapper}>
      {name && <Title className={s.image_title} title={name}/>}
      {imageSrc &&
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              deleteImage()
            }}
            iconOnly 
            theme="tetrinary"
            className={s.close_button}
          >
            <IconClose className={s.close}/>
          </Button>
      }
      {imageSrc &&
          <div className={s.uploader_wrapper_image}>
              <img alt='Логотип' src={imageSrc} className={s.image_logo} />
          </div>
      }
      {!imageSrc &&
          <div
              className={s.wrapper_input}
              onDrop={(e) => {
                !filename && handleDrop(e)
              }}
              onDragOver={(e) => {
                !filename && handleDragOver(e)
              }}
              onClick={() => {
                !filename && handle_file_input.current?.click()
              }}
          >
            <FilesIcon/>
            <span className={s.handle_file_upload_wrapper}>
              <span>Перетащите картинку в эту область или</span>
              <span className={s.pickFileLink}>Нажмите, чтобы выбрать</span>
              <input
                  type="file"
                  style={{display: 'none'}}
                  onChange={handleFileInputChange}
                  multiple={false}
                  ref={handle_file_input}
              />
            </span>
          </div>
      }
    </div>
  );
};
