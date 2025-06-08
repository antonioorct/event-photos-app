import { CallSite } from "callsite";
import winston from "winston";
import config from "@/config";

function getFileName(line: CallSite): string | undefined {
    return line.getFileName() || line.getEvalOrigin();
}

function isNotBoilerplateLine(line?: CallSite) {
    if (!line) {
        return false;
    }
    const fileName = getFileName(line);
    if (!fileName) {
        return false;
    }
    return (
        line &&
        fileName.indexOf("/utils/log.ts") < 0 &&
        fileName.indexOf("/node_modules/") < 0
    );
}

const formatFunctionCallerOrigin = winston.format(function (info) {
    const oldStackTrace = Error.prepareStackTrace;

    try {
        Error.stackTraceLimit = 20;
        const err = new Error();
        Error.prepareStackTrace = (_, structuredStackTrace) =>
            structuredStackTrace;

        // we need to remove the first CallSites (frames) in order to get to the caller we're looking for
        // in our case we're removing frames that come from log module or from winston
        // @ts-expect-error the stack is an array of classes CallSite
        const callSites = err.stack
            .slice(1)
            // @ts-expect-error the stack is an array of classes CallSite
            .filter(isNotBoilerplateLine) as CallSite[];

        if (callSites.length === 0) {
            return info;
        }

        const callSite = callSites[0];
        const fileName = getFileName(callSite) ?? "Unknown file";
        const lineNumber = callSite.getLineNumber();
        const functionName =
            callSite.getFunctionName() ?? callSite.getMethodName();
        info.location = `${fileName}:${lineNumber}`;
        if (functionName) {
            info.function = functionName;
        }

        return info;
    } finally {
        Error.prepareStackTrace = oldStackTrace;
    }
});

const errorStackFormat = winston.format((info) => {
    const error = info.error as { stack: string; message: string };

    if (error) {
        return Object.assign({}, info, {
            stack: error.stack,
            errorMessage: error.message,
        });
    }
    return info;
});

const transports: winston.transport[] = [
    new winston.transports.Console({
        format: winston.format.simple(),
    }),
];

const log = winston.createLogger({
    level: config.winston.logLevel,
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        formatFunctionCallerOrigin(),
        errorStackFormat(),
    ),
    defaultMeta: {},
    transports: transports,
});

export default log;
