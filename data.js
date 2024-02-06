/* TODO: "properly" separate data from source code, for now it's at least moved
into a different file. Better would be, as all the in-game names are effectively
"settings": treat them as such or at least in some different way from the
Discord server's rules as actual data */


/**
 * The current (2024-01) expected party leader's in-game account
 * name for probably at least the next few Bingo events – not strictly a
 * necessary requirement, but used for nicer-looking output formatting
 */
const partyHostNameWithoutRank = "BingoParty";


/* The players listed in the following allowlist will have access to all
implemented party commands in a basic, first binary version of the permission
system – i.e., a player either has all mod permissions or none.
Ideally we could allow a broader range of accounts e.g. to mute the party, but
reserve blocking people to a smaller "staff" or "admin" group  – PRs that implement this (or better data structures in general) are welcomed.
TODO: the code in bpt.js currently expects these in-game name to be in all
lowercase, and also obviously IGN changes have to be considered/updated
manually, which wouldn't be necessary if I worked with e.g. UUIDs? */
/*
Explanation: on this list there should be:
- BingoBrewers' staff and splashers and their alt accounts
- Bingo players who are typically active and known to be responsible wrt
  moderating the bingo party, plus YouTube ranks and Hypixel admins who are
  known to have been in the party (or playing Bingo in general) in the past.
- Some hall of bingos are included, some more might be added in the future.
  To be honest, most HoB'ers do not really stay in the party that much.
- Finally me (aphased) and my alt account for testing + control purposes,
  the "BingoParty" Minecraft account I made.
*/
const allowlist = ["hunterhihunter", "hub14", "indigo_polecat", "lcat_", "p0is",
"p0is_", "bossflea", "mushedglowytonic", "sergeantsar", "baldgeant",
"killz_stromzy", "stromzzy", "ooffyy", "bingosplasher", "batmancrtns",
"netomnia", "watobato", "calva", "furken", "notcookies", "mafrylikebedwars",
"notogfishyboi", "thathungrygoat", "foqh", "end_game_player", "gleolp",
"domx2e", "karicc", "potjezout", "potjepeper", "ay212", "scathapet",
"sakuricetwitch", "skyyblockerr", "smoothegg", "zerostulip", "dousedcharizard",
"987654321kaboom", "katoulis", "tryp0mc", "timecharm", "dredlig", "aoik",
"foragerredstone", "demonhunter990", "h8re", "godwyyn", "skyerzz", "citria",
"benc1ark", "alexxoffi", "remittal", "crxmsxn", "erikeriklol",
"kleinkolibri711", "rngecko", "aphased", "bingoparty"];


// TODO: don't just call it data.js (move to proper data format or something)
const bingoBrewersRules = new Map([
  //["1", "Do not ask when a splash is. This can be very annoying, it's when you get pinged in #splashes."],
  // cut original full wording due to Minecraft chat length limit, down to…:
  ["1", "Do not ask when a splash is. It's when you get pinged in #splashes."],
  ["2", "No discrimination or derogatory language."],
  ["3", "Don't be obnoxious (e.g. loud in VC, spamming)."],
  ["4", "Advertising is prohibited. This includes external splashes."],
  ["5", "Don't spread or engage in exploits."],
  ["6", "No inappropriate content, emojis, or reactions."],
  ["7", "Splashers cannot accept monetary (ingame or irl) donations."],
  // Rules subtext/"amendment", original wording is below, but again, using a shortened version:
  // ["a", "Use common sense; if something is not listed here do not treat it as a loophole. You will still be punished."],
  ["a", "Use common sense; don't argue for loopholes. You will still be punished."],
  // I took the liberty to add this
  ["p", "Party addition: If you insult people, expect to be kicked."],
  /* yes the next lines exist to enable aliases to /ap rule number (thanks once
  again to ooffyy for suggesting them) and what do you mean data duplication,
  not a single source of truth? nothing to see here in my code this is
  perfectly designed and implemented data management */
  ["splash", "Do not ask when a splash is. It's when you get pinged in #splashes."],
  ["advertising", "Advertising is prohibited. This includes external splashes."],
  ["ad", "Advertising is prohibited. This includes external splashes."],
]);


export { allowlist, bingoBrewersRules, partyHostNameWithoutRank }
