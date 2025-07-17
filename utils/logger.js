import "colors";

function getCallerFile() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;

    const err = new Error();
    const stack = err.stack;
    Error.prepareStackTrace = originalPrepareStackTrace;

    const caller = stack?.[2];
    const filePath = caller?.getFileName();
    return filePath ? filePath.split("/").slice(-2).join("/") : "unknown";
}

export function info(...message) {
    const time = new Date().toLocaleTimeString();

    console.info(`[${time}]`.gray, "[Info]".blue, `[${getCallerFile()}]`.cyan, message.join(" "));
};

export function success(...message) {
    const time = new Date().toLocaleTimeString();

    console.info(`[${time}]`.gray, "[Success]".green, `[${getCallerFile()}]`.cyan, message.join(" "));
};

export function error(...message) {
    const time = new Date().toLocaleTimeString();

    console.error(`[${time}]`.gray, "[Error]".red, `[${getCallerFile()}]`.cyan, message.join(" "));
};

export function warning(...message) {
    const time = new Date().toLocaleTimeString();

    console.warn(`[${time}]`.gray, "[Warning]".yellow, `[${getCallerFile()}]`.cyan, message.join(" "));
};