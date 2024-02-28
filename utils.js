import { partyHostAccountOwners } from "./data";

// TODO: adapt for use with mineflayer as a bot rather than as CT module!
export function removeFormatting(message) {
  return ChatLib.removeFormatting(message);
  // return ……formatting removed for mineflayer……
}

// helper function to remove rank and Minecraft formatting from a username
// taken & adapted from https://www.chattriggers.com/modules/v/HypixelUtilities
export function removeRank(name) {
  name = removeFormatting(name);
  return name.replace(/\[.+]/g, "").trim();
}

export function isAccountOwner(ign) {
  ign = removeRank(ign).toLowerCase();
  return partyHostAccountOwners.contains(ign);
}

export function containsInNestedArray(arr, str) {
  return arr.some(item => {
    if(Array.isArray(item)) {
      return item.includes(str);
    } else {
      return item === str;
    }
  });
}

export function log(message) {
  const date = new Date().toISOString().replace(/T|Z/g, ' ');
  console.log(`[${date} LOG]: ${message}`);
}
export function err(message) {
  const date = new Date().toISOString().replace(/T|Z/g, ' ');
  console.error(`[${date} ERR]: ${message}`);
}
