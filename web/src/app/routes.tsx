import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ImagesList from "@/pages/list";
import Homepage from "@/pages/home";
import UploadPage from "@/pages/upload";
import UploadFromGallery from "@/pages/upload-gallery";
import Slideshow from "@/pages/slideshow";
import UploadComplete from "@/pages/upload-complete";

type Route = {
  path: string;
  element: React.ReactNode | null;
  protected?: boolean;
  getPath?: (...args: string[]) => string;
};

export const paths = {
  home: {
    path: "/",
    element: <Homepage />,
  },
  images: {
    path: "/images",
    element: <ImagesList />,
  },
  slideshow: {
    path: "/slideshow",
    element: <Slideshow />,
  },
  upload: {
    path: "/upload",
    element: <UploadPage />,
  },
  uploadFromGallery: {
    path: "/upload-from-gallery",
    element: <UploadFromGallery />,
  },
  completed: {
    path: "/upload/complete",
    element: <UploadComplete />,
  },
} satisfies { [key: string]: Route };

const router = createBrowserRouter(
  Object.values(paths).map(({ path, element }) => ({
    path,
    element,
  })),
);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
