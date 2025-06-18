import React, { ReactElement, useRef, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { ImageGalleryPropsType, ImgSrcInfoType } from "./types";
import { imageGalleryStyles } from "./styles";

export function ImageGallery({
  imagesInfoArray,
  columnCount = "auto",
  columnWidth = 230,
  gapSize = 24,
  fixedCaption = false,
  thumbnailBorder = "3px solid #fff",
  lazy = true,
  lazyFromIndex = 6,
  customStyles = {},
}: ImageGalleryPropsType) {
  const [imgSrcInfo, setImgSrcInfo] = useState<ImgSrcInfoType | null>(null);
  const [slideNumber, setSlideNumber] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const activeThumbImgRef = useRef<HTMLImageElement | null>(null);
  const defaultStyles = imageGalleryStyles(
    columnCount,
    columnWidth,
    gapSize,
    fixedCaption,
  );
  const galleryStyles = { ...defaultStyles, ...customStyles };
  const galleryContainerStyle = galleryStyles.galleryContainerStyle;
  const imageContainerStyle = galleryStyles.imageContainerStyle;
  const imageBtnStyle = galleryStyles.imageBtnStyle;
  const imageStyle = galleryStyles.imageStyle;
  const imageCaptionStyle = galleryStyles.imageCaptionStyle;
  const modalContainerStyle = galleryStyles.modalContainerStyle;
  const modalSlideNumberStyle = galleryStyles.modalSlideNumberStyle;
  const modalToolbarStyle = galleryStyles.modalToolbarStyle;
  const modalToolbarBtnStyle = galleryStyles.modalToolbarBtnStyle;
  const modalSlideShowSectionStyle = galleryStyles.modalSlideShowSectionStyle;
  const modalThumbnailSectionStyle = galleryStyles.modalThumbnailSectionStyle;
  const modalThumbImgsPodStyle = galleryStyles.modalThumbImgsPodStyle;
  const modalImageStyle = galleryStyles.modalImageStyle;
  const modalSlideBtnStyle = galleryStyles.modalSlideBtnStyle;

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) {
      return;
    }

    const touch = e.changedTouches[0];
    if (touch) {
      const touchEndPosition = touch.clientX;
      const distance = touchStart - touchEndPosition;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        scrollImage(false, 1, 0);
      } else if (isRightSwipe) {
        scrollImage(false, -1, 0);
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  function handleImageContainerMouseEnter(
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) {
    const figcaption = e.currentTarget.querySelector("figcaption");
    figcaption && (figcaption.style.opacity = "1");
  }

  function handleImageContainerMouseLeave(
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) {
    const figcaption = e.currentTarget.querySelector("figcaption");
    figcaption && (figcaption.style.opacity = "0");
  }

  function openLightboxOnSlide(
    number: number,
    src: string,
    srcSet?: string,
    mediaSizes?: string,
  ) {
    setImgSrcInfo({ src, srcSet, mediaSizes });
    setSlideNumber(number);
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  }

  function changeSlide(thumbClick: boolean, step: number) {
    const totalImages = imagesInfoArray.length;
    let newSlideNumber = thumbClick ? step + 1 : slideNumber + step;

    newSlideNumber < 1 && (newSlideNumber = totalImages);
    newSlideNumber > totalImages && (newSlideNumber = 1);

    if (newSlideNumber <= totalImages && newSlideNumber > 0) {
      const imageInfo = imagesInfoArray[newSlideNumber - 1];
      setSlideNumber(newSlideNumber);
      setImgSrcInfo({
        src: imageInfo.src,
        srcSet: imageInfo.srcSet,
        mediaSizes: imageInfo.mediaSizes,
      });
    }
  }

  function scrollImage(
    thumbClick: boolean,
    direction: number,
    imgIndex: number,
  ) {
    const step = thumbClick ? imgIndex : direction;
    flushSync(() => changeSlide(thumbClick, step));
    activeThumbImgRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function handleKeyDownOnModal(e: React.KeyboardEvent<HTMLElement>) {
    e.key === "ArrowLeft" && scrollImage(false, -1, 0);
    e.key === "ArrowRight" && scrollImage(false, 1, 0);
  }

  function exitDialog() {
    dialogRef.current?.close();
    document.documentElement.style.overflow = "";
  }

  function SvgElement(pathElement: ReactElement) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 16 16">
        {pathElement}
      </svg>
    );
  }

  function showImageCards() {
    const imageElementsArray = imagesInfoArray.map((imageInfo, index) => {
      if (imageInfo.id) {
        return (
          <button
            type="button"
            style={imageBtnStyle}
            key={imageInfo.id}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              openLightboxOnSlide(
                index + 1,
                imageInfo.src,
                imageInfo.srcSet,
                imageInfo.mediaSizes,
              )
            }>
            <div
              style={{
                height: "100%",
              }}
              onMouseEnter={(e) =>
                fixedCaption ? undefined : handleImageContainerMouseEnter(e)
              }
              onMouseLeave={(e) =>
                fixedCaption ? undefined : handleImageContainerMouseLeave(e)
              }>
              <img
                loading={lazy && index >= lazyFromIndex ? "lazy" : "eager"}
                alt={imageInfo.alt}
                src={imageInfo.gridSrc || imageInfo.src}
                onClick={() =>
                  openLightboxOnSlide(
                    index + 1,
                    imageInfo.src,
                    imageInfo.srcSet,
                    imageInfo.mediaSizes,
                  )
                }
                style={imageStyle}
                width={imageInfo.width}
                height={imageInfo.height}
              />
              {imageInfo.caption ? (
                <figcaption style={imageCaptionStyle}>
                  {imageInfo.caption}
                </figcaption>
              ) : (
                ""
              )}
            </div>
          </button>
        );
      }
      return (
        <div>
          <strong>Error:</strong> Each item in the `imagesArray` needs a unique
          `id`
        </div>
      );
    });
    return imageElementsArray;
  }

  const lightBoxElement = (
    <dialog ref={dialogRef} style={{ margin: "auto" }}>
      <article
        autoFocus
        tabIndex={-1}
        style={modalContainerStyle}
        onKeyDown={(e) => handleKeyDownOnModal(e)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        <span
          style={{
            ...modalSlideNumberStyle,
          }}>{`${slideNumber} / ${imagesInfoArray.length}`}</span>
        <span
          style={{
            ...modalToolbarStyle,
          }}>
          <button
            type="button"
            aria-label="Close lightbox"
            style={modalToolbarBtnStyle}
            title="Close lightbox"
            onClick={() => exitDialog()}>
            {SvgElement(
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />,
            )}
          </button>
        </span>
        <section
          style={{
            height: "100dvh",
            ...modalSlideShowSectionStyle,
          }}>
          <button
            type="button"
            aria-label="Previous image"
            style={{
              left: 5,
              bottom: 20,
              ...modalSlideBtnStyle,
            }}
            title="Previous image"
            onClick={() => scrollImage(false, -1, 0)}>
            {SvgElement(
              <path
                fillRule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
              />,
            )}
          </button>
          <figure
            onMouseEnter={(e) =>
              fixedCaption ? undefined : handleImageContainerMouseEnter(e)
            }
            onMouseLeave={(e) =>
              fixedCaption ? undefined : handleImageContainerMouseLeave(e)
            }>
            <img
              loading={lazy ? "lazy" : "eager"}
              src={imgSrcInfo?.src}
              srcSet={imgSrcInfo?.srcSet}
              sizes={imgSrcInfo?.mediaSizes}
              alt={imagesInfoArray[slideNumber - 1].alt}
              style={{
                maxHeight: "100dvh",
                ...modalImageStyle,
              }}
            />
            {imagesInfoArray[slideNumber - 1].caption ? (
              <figcaption style={imageCaptionStyle}>
                {imagesInfoArray[slideNumber - 1].caption}
              </figcaption>
            ) : (
              ""
            )}
          </figure>
          <button
            type="button"
            aria-label="Next image"
            style={{
              right: 5,
              bottom: 20,
              ...modalSlideBtnStyle,
            }}
            title="Next image"
            onClick={() => scrollImage(false, 1, 0)}>
            {SvgElement(
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />,
            )}
          </button>
        </section>
      </article>
    </dialog>
  );

  return (
    <div style={galleryContainerStyle}>
      {showImageCards()}
      {lightBoxElement}
    </div>
  );
}
