export type ImageGalleryStylesType = {
    galleryContainerStyle?: React.CSSProperties;
    imageBtnStyle?: React.CSSProperties;
    imageContainerStyle?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
    imageCaptionStyle?: React.CSSProperties;
    modalContainerStyle?: React.CSSProperties;
    modalSlideNumberStyle?: React.CSSProperties;
    modalToolbarStyle?: React.CSSProperties;
    modalToolbarBtnStyle?: React.CSSProperties;
    modalSlideShowSectionStyle?: React.CSSProperties;
    modalThumbnailSectionStyle?: React.CSSProperties;
    modalThumbImgsPodStyle?: React.CSSProperties;
    modalImageStyle?: React.CSSProperties;
    modalSlideBtnStyle?: React.CSSProperties;
};

export type ImageGalleryPropsType = {
    imagesInfoArray: Array<{
        id: string | number;
        alt: string;
        caption?: string;
        src: string;
        gridSrc?: string;
        thumbSrc?: string;
        srcSet?: string;
        mediaSizes?: string;
        width?: number;
        height?: number;
    }>;
    columnCount?: string | number;
    columnWidth?: string | number;
    gapSize?: number;
    fixedCaption?: boolean;
    thumbnailBorder?: string;
    lazy?: boolean;
    lazyFromIndex?: number;
    customStyles?: ImageGalleryStylesType;
};

export type ImgSrcInfoType = {
    src: string;
    srcSet: string | undefined;
    mediaSizes: string | undefined;
};
