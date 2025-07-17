const ERROR_TITLES = [
    "Drat! We're sorry...",
    "Not the llama you're looking for...",
    "That wasn't supposed to happen...",
    "There was an error!",
    "Uh oh! Something goofed...",
    "We hit a roadblock!",
    "Whoops!"
];

export function getRandomError() {
    return ERROR_TITLES[Math.floor(Math.random() * ERROR_TITLES.length)];
};

export function boolToEmoji(value) {
    return value ? "<:ImpostersAcceptIcon:1342766794309373972>" : "<:ImpostersCancelIcon:1342766796242948147>";
};

export function countryToFlag(country) {
    if (country.length !== 2) {
        return country;
    }

    const codePoints = [...country].map((char) => String.fromCodePoint(char.codePointAt(0) + 127397));

    return codePoints.join("");
};