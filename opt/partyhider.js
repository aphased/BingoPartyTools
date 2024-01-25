import { BingoPartyTools } from '../settings';

/* hides the following types of messages
- dashed line with party messages over the entire chat length
  (you know which ones I mean)
- [MVP+] randomBingoer has disconnected, they have 5 minutes to rejoin before they are removed from the party.
- [MVP+] randomBingoer was removed from your party because they disconnected.
- [MVP+] randomBingoer has left the party.
and maybe even default-enable
- [MVP+] randomBingoer joined the party.
and potentially?? (but good to have maybe, I guess?!):
- [MVP++] randomSpammer has been removed from the party.
*/


// Surrounding dashed lines
register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "PartyHider Lines")) {
    // ChatLib.command("r This setting is currently disabled. ("+ "partyLineHider" + ")");
    return;
  }
  cancel(event);
}).setCriteria("-----------------------------------------------------").setParameter("equals");
// TODO: make something like this work, so *only* the party lines are
// getting hidden/cancelled, and it does not trigger for guild ones…
//}).setCriteria("&1-----------------------------------------------------&r").setParameter("equals");
// Check for dark blue color above is necessary as aqua (&b) lines are
// also used, e.g. in /gl, /g online


// Join
register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "PartyHider Join")) {
    // ChatLib.command("r This setting is currently disabled. ("+ "partyJoinHider" + ")");
    return;
  }
  cancel(event);
}).setCriteria(" joined the party.").setParameter("contains");

// Disconnect
register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "PartyHider Disconnect")) {
    return;
  }
  cancel(event);
}).setCriteria(" has disconnected, they have 5 minutes to rejoin before they are removed from the party.").setParameter("contains");

// Leave as well as automated removes
// (two potential cases are controlled by the same setting, so 2 chat triggers)
register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "PartyHider Leave")) {
    return;
  }
  cancel(event);
}).setCriteria(" has left the party.").setParameter("contains");

register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "PartyHider Leave")) {
    return;
  }
  cancel(event);
}).setCriteria(" was removed from your party because they disconnected.").setParameter("contains");
