/* The players listed in this allowlist here will have access to all party 
commands in a basic, binary first version of the permission system (either all 
perms or none)… 
Ideally we could allow a broader range of accounts e.g. to mute the party, but 
reserve kicking/blocking people to a smaller group  – PRs that implement this
(or better data structures in general) are welcomed. */
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
/* TODO: the code in bpt.js currently expects these in-game name to be in all 
lowercase, and also obviously IGN changes have to be considered/updated 
manually, which wouldn't be necessary if I worked with e.g. UUIDs? */
allowlist = ["ign1", "ign2", "ign3" /* … */];


// TODO: don't just call it data.js (move to proper data format or something)
bingoBrewersRules = new Map([
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
  ["p", "Party addition: If you insult people, expect to be kicked."]
]);


export { allowlist, bingoBrewersRules }
