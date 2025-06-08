import { Router } from "express";
import images from "@/components/images/router";

export default () => {
    const app = Router();

    images(app);

    return app;
};
