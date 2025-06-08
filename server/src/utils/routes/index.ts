import { Request, RequestHandler, Response, Router } from "express";
import { z } from "zod";
import log from "@/utils/log";
import { ApiError } from "@/utils/routes/ApiError";

export interface RouteConfig<B extends z.ZodType> {
    path: string;
    method?: "get" | "post" | "put" | "delete" | "patch";
    body?: B;
    params?: string[];
    searchParams?: z.ZodType;
}

export type RouteHandlerResponse = Promise<unknown | Response>;

type ExpressRoute = RequestHandler;

export function route<
    B extends z.ZodType,
    C extends RouteConfig<B> & {
        body?: B;
    },
>(
    router: Router,
    config: C,
    handler: (
        options: {
            body: C extends { body: B } ? z.infer<C["body"]> : null;
            params: C extends { params: string[] }
                ? Record<C["params"][number], string>
                : null;
            searchParams: C extends { searchParams: z.ZodType }
                ? z.infer<C["searchParams"]>
                : null;
        },
        req: Request,
        res: Response,
    ) => RouteHandlerResponse,
): ExpressRoute {
    router["method" in config ? (config.method ?? "get") : "get"](
        config.path,
        async function (req: Request, res) {
            let body: z.infer<B> | null = null;
            let searchParams = null;
            const params = req.params;

            if (typeof config.searchParams === "object") {
                const { success, data, error } = config.searchParams.safeParse(
                    req.query,
                );

                if (!success) {
                    log.error(
                        `Zod error parsing search params for route ${req.url}`,
                        {
                            zodError: error,
                            url: req.url,
                            query: req.query,
                        },
                    );

                    return res.status(400).json({
                        errors: error.errors,
                    });
                }

                searchParams = data;

                log.debug(`Parsed search params for route: ${req.url}`, {
                    searchParams,
                    url: req.url,
                });
            }

            if (typeof config.body === "object") {
                const { success, data, error } = config.body.safeParse(
                    req.body,
                );

                if (!success) {
                    log.error(`Zod error parsing body for route ${req.url}`, {
                        zodError: error,
                        url: req.url,
                        body: req.body,
                    });

                    return res.status(400).json({
                        errors: error.errors,
                    });
                }

                body = data;

                log.debug(`Parsed body for route: ${req.url}`, {
                    body,
                    url: req.url,
                });
            }

            try {
                log.debug(`Handling route: ${req.url}`, {
                    url: req.url,
                    body,
                    params,
                    searchParams,
                });

                const result = await handler(
                    {
                        body: body as C extends { body: B }
                            ? z.infer<C["body"]>
                            : null,
                        params: params as C extends { params: string[] }
                            ? Record<C["params"][number], string>
                            : null,
                        searchParams: searchParams as C extends {
                            searchParams: z.ZodType;
                        }
                            ? z.infer<C["searchParams"]>
                            : null,
                    },
                    req,
                    res,
                );

                if (!res.headersSent) {
                    res.status(200).json(result ?? { success: true });
                }
                return res;
            } catch (e) {
                log.error(`Error handling route: ${req.url}`, {
                    url: req.url,
                    body,
                    error: e,
                });

                const knownError: ApiError = e as ApiError;
                const status = knownError.status ?? 500;
                const message = knownError.message ?? null;
                let errors: Error[] = [];

                if (Array.isArray(knownError.errors)) {
                    errors = knownError.errors;
                } else if (knownError.message) {
                    errors = [new Error(knownError.message)];
                }

                return res.status(status).json({ errors, message });
            }
        },
    );

    return router;
}
