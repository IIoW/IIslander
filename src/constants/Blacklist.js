/**
 * An array of regex swears.
 */
const swearWords = [
    'ar+s+e(?:\\s|$)', // This one has the thing at the end cause it triggers on the //ar set command
    'ass\\b',
    'anus',
    'boo+b',
    'bitch',
    'ball(?:bag|sack)',
    'bastard',
    'blowjob',
    'boner',
    'butt(?:hole|plug)',
    '(?:c|k)ock',
    'clit',
    'cunt',
    'cum',
    'condom',
    'dick',
    'dildo',
    'dyke',
    'ejaculate',
    '(?:mother)?(?:da)?(?:f|ph)u+(?:c?k|q|x)',
    'fag',
    'gangbang',
    'horn(?:y|i)',
    'jackoff',
    'jerkoff',
    'mof(?:o|u)',
    'mast(?:r|u|e){2}b(?:at|8)',
    'nigg(?:a|er)',
    'orgasi?m',
    'porn',
    'pus+[iey]',
    'shit',
    'se(?:x|c?ks)',
    'shag',
    'slut',
    'ti+t+(?:ie|s)',
    'vagina',
    'viagra',
    'b=+d', // for things like B====D
];
/**
 * The combined swear regex. Has all the words and checks for spaces between words.
 */
const swearRegex = new RegExp(
    `(?:\\W|^)(?:${swearWords.reduce(
        (str, swear, i, arr) =>
            str +
            swear
                // This function makes the swear allow spaces inbetween letters
                .replace(/(?:(\(.+?\)(?:{.+?})?)|[a-z=.-])([+?*$])?/g, '$&\\s*') +
            (i === arr.length - 1 ? '' : '|'),
        ''
    )})`
);
export default {
    swearRegex,
};
