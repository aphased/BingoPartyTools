// helper function to remove rank and Minecraft formatting from a username
// taken & adapted from https://www.chattriggers.com/modules/v/HypixelUtilities
export function removeRank(name) {
  name = ChatLib.removeFormatting(name);
  return name.replace(/\[.+]/g, "").trim();
}
