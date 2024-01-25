// idea adapted from beeb#6969's "MVPJoinMessageHider"
// https://www.chattriggers.com/modules/v/MVPJoinMessageHider

// Hides "[MVP+] joined the lobby!"+">>> [MVP++] joined the lobby! <<<" messages

import { BingoPartyTools } from '../settings';

register("chat", function(event) {
  if (!BingoPartyTools.getSetting("CleanChat", "LobbyJoinHider")) {
    // ChatLib.command("r This setting is currently disabled. ("+ "lobbyJoinHider" + ")");
    return;
  }
  // ChatLib.chat(name + " joined.");
  cancel(event);
}).setCriteria(" joined the lobby!").setParameter("contains");
