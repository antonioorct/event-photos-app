import { ImageGalleryStylesType } from "./types";

export function imageGalleryStyles(
    columnCount?: string | number,
    columnWidth?: string | number,
    gapSize?: number,
    fixedCaption?: boolean,
): ImageGalleryStylesType {
    const modalThumbnailSectionHeight = "20vh";
    const galleryContainerStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gapSize}px`,
    };
    const imageBtnStyle: React.CSSProperties = {
        border: "none",
        background: "none",
        margin: 0,
        padding: 0,
        display: "block",
    };
    const imageStyle: React.CSSProperties = {
        backgroundColor: "#D3D3D3",
        cursor: "pointer",
        objectFit: "cover",
        width: "100%",
        height: "100%",
    };
    const imageCaptionStyle: React.CSSProperties = {
        opacity: fixedCaption ? 1 : 0,
        transition: fixedCaption ? undefined : "opacity 1s ease-in-out",
        position: "absolute",
        left: 0,
        bottom: 0,
        zIndex: "1000",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        background:
            "linear-gradient(180deg, rgba(25, 27, 38, 0), rgba(25, 27, 38, 1))",
        padding: "16px",
        fontSize: "0.85rem",
        textAlign: "center",
        color: "#fff",
    };
    const modalContainerStyle: React.CSSProperties = {
        outline: "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
    };
    const modalSlideNumberStyle: React.CSSProperties = {
        zIndex: 1,
        position: "absolute",
        left: 0,
        padding: "13px",
        backgroundColor: "rgba(35, 35, 35, 0.73)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "14px",
        transition: "opacity 1s ease-in-out",
        userSelect: "none",
        WebkitUserSelect: "none",
    };
    const modalToolbarStyle: React.CSSProperties = {
        zIndex: 1,
        display: "flex",
        position: "absolute",
        right: 0,
        alignItems: "center",
        backgroundColor: "rgba(35, 35, 35, 0.73)",
        transition: "opacity 1s ease-in-out",
        cursor: "pointer",
    };
    const modalToolbarBtnStyle: React.CSSProperties = {
        margin: 0,
        border: "none",
        background: "none",
        padding: "13px",
        color: "#fff",
        cursor: "pointer",
    };
    const modalSlideShowSectionStyle: React.CSSProperties = {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "inherit",
        transition: "height .7s linear",
    };
    const modalImageStyle: React.CSSProperties = {
        margin: "auto",
        maxWidth: "100vw",
        transition: "height .7s linear",
    };
    const modalSlideBtnStyle: React.CSSProperties = {
        position: "absolute",
        border: "none",
        marginInline: "7px",
        padding: "10px 15px",
        backgroundColor: "rgba(35, 35, 35, 0.73)",
        color: "#fff",
        transition: "opacity 1s ease-in-out",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
    };
    const modalThumbnailSectionStyle: React.CSSProperties = {
        overflow: "hidden",
        height: `${modalThumbnailSectionHeight}`,
        textAlign: "center",
    };
    const modalThumbImgsPodStyle: React.CSSProperties = {
        display: "inline-flex",
        height: "inherit",
        paddingBlock: "12px",
        columnGap: "7px",
    };
    return {
        galleryContainerStyle,
        imageBtnStyle,
        imageStyle,
        imageCaptionStyle,
        modalContainerStyle,
        modalSlideNumberStyle,
        modalToolbarStyle,
        modalToolbarBtnStyle,
        modalSlideShowSectionStyle,
        modalThumbnailSectionStyle,
        modalThumbImgsPodStyle,
        modalImageStyle,
        modalSlideBtnStyle,
    };
}
