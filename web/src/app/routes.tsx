import {
  BrowserRouter,
  Routes,
  Route as ReactRouterRoute,
  useParams,
} from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import ImagesList from "@/pages/list";
import Homepage from "@/pages/home";
import UploadPage from "@/pages/upload";
import UploadFromGallery from "@/pages/upload-gallery";
import UploadFromCamera from "@/pages/upload-camera";
import ImageDetail from "@/pages/image-detail";
import Slideshow from "@/pages/slideshow";

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
  login: {
    path: "/auth",
    element: null,
  },
  images: {
    path: "/images",
    element: <ImagesList />,
  },
  imageDetail: {
    path: "/images/:key",
    element: <ImageDetail />,
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
  uploadFromCamera: {
    path: "/upload-from-camera",
    element: <UploadFromCamera />,
  },
} satisfies { [key: string]: Route };

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {Object.values(paths)
          .filter((route) => !!route.element)
          .map(({ path, element, ...route }) =>
            "protected" in route && route.protected === true ? (
              <ReactRouterRoute
                key={path}
                path={path}
                element={
                  /:\w+/.test(path) ? (
                    <DynamicRouteWrapper>{element}</DynamicRouteWrapper>
                  ) : (
                    element
                  )
                }
              />
            ) : (
              <ReactRouterRoute
                key={path}
                path={path}
                element={
                  /:\w+/.test(path) ? (
                    <DynamicRouteWrapper>{element}</DynamicRouteWrapper>
                  ) : (
                    element
                  )
                }
              />
            ),
          )}
      </Routes>
    </BrowserRouter>
  );
}

// Wrapper to ensure that the dynamic route is re-rendered when the params change
function DynamicRouteWrapper({ children }: { children: React.ReactNode }) {
  const params = useParams();

  return <Fragment key={Object.values(params).join("-")}>{children}</Fragment>;
}
