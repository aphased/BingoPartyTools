// Code taken verbatim from HypixelUtilities CT module
// https://www.chattriggers.com/modules/v/HypixelUtilities

// Makes direct messages on Hypixel white instead of greyed-out

import { BingoPartyTools } from '../settings';

register("chat", function(name, message, event) {
  if (!BingoPartyTools.getSetting("CleanChat", "WhiteDMs")) {
    // ChatLib.command("r This setting is currently disabled. ("+ "WhiteDMs" + ")");
    return;
  }

  if (name.endsWith("&r&7")) {
    cancel(event);
    ChatLib.chat("§dTo "+name + "&r&f: " + ChatLib.removeFormatting(message));
  }
}).setCriteria("&dTo &r${name}: ${message}&r");
register("chat", function(name, message, event) {
  if (!BingoPartyTools.getSetting("CleanChat", "WhiteDMs")) {
    // ChatLib.command("r This setting is currently disabled. ("+ "WhiteDMs" + ")");
    return;
  }

  if (name.endsWith("&r&7")) {
    cancel(event);
    ChatLib.chat("§dFrom "+name + "&r&f: " + ChatLib.removeFormatting(message));
  }
}).setCriteria("&dFrom &r${name}: ${message}&r");
