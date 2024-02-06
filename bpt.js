import { BingoPartyTools } from "./settings";
import { removeRank } from "./utils";
import { allowlist, bingoBrewersRules, partyHostNameWithoutRank } from "./data";


/**
 * Checks if the passed in-game name is allowed to moderate the party.
 * This function primarily exists to mask the implementation of "allowlist",
 * so we can more easily change it later in just one place (here), if needed.
 * @param {String} formattedPlayerName  Account name of player to be checked
 * against allowlist – can be but does not have to be including Minecraft
 * formatting, Hypixel rank, and in any combination of upper-/lower-casing)
 */
function playerHasPermissions(formattedPlayerName) {
  const unformattedPlayerName = removeRank(formattedPlayerName).toLowerCase();
  if (!allowlist.includes(unformattedPlayerName)) return false;
  else return true;
}

/**
 * These exist for at least partially circumventing Hypixel's
 * "You cannot say the same message twice!"
 */
let helpOutputIndex = 0;
const helpMessages = ["r For a list of available commands see github dot com/aphased/bingopartytools", "r GitHub: aphased/bingopartytools for all commands",
"r All commands are shown on GitHub: aphased/bingopartytools"];

/**
 * This function masks the true implementation of how messages/commands are
 * output to Hypixel servers in the game, which _should_ make switching down
 * the line from ChatTriggers to e.g. Mineflayer far more easy.
 * @param {String} command  The command to be sent to Hypixel, **without**
 * preceding slash. This is also applicable for regular chat messages, which
 * should always specify their respective channel (e.g. `/pc <message to party>`, `/msg <ign> <direct message whisper>`, etc.)
 */
function outputCommand(command) {
  // Using ChatTriggers command function, which prepends the slash for us:
  ChatLib.command(command);
  // Using Mineflayer later perhaps could look like:
  // bot.chat("/" + command);
}

/**
 * Exists to turn a common three-line operation into a one-liner.
 * @param {String} command  Command message to be executed **without** leading
 * slash /
 * @param {Number} timeout  Integer time to wait until command execution in
 * milliseconds (thanks Hypixel)
 */
function waitAndOutputCommand(command, timeout) {
  // Ensure to wait at least half a second if this function is called
  let waitDuration = timeout > 500 ? timeout : 500;
  setTimeout(() => {
    outputCommand(command);
  }, waitDuration);
  return;
}

/**
 * Exists to turn a common three-line operation into a one-liner,
 * as well as to reduce code repetition, and to propagate changes
 * to the output message used to *all* places where the output is used.
 * @param {String} settingCategory  Name of overarching setting category (typically `BingoPartyFeatures`)
 * @param {String} setting  Name of setting itself (e.g. `Party mute`)
 * @param {String} command  Name of toggled-off command to inform about
 * @returns {Number} value less than zero if setting is toggled **off**, positive integer otherwise (i.e., if setting is enabled)
 */
function checkSetting(settingCategory, setting, command) {
  if (!BingoPartyTools.getSetting(settingCategory, setting)) {
    let informDisabledSetting = "r This setting is currently disabled. ("+ command + ")";
    outputCommand(informDisabledSetting);
    return -1;
  } else return command.charCodeAt(0); // some nonnegative number
}

/**
 * After a disconnect, party kick or whatever else, automatically
 * accept re-invitations by permitted accounts on the allowlist.
 *
 * The chat matching criterion used below looks rather odd, as the formatting
 * Hypixel uses sends a single, long party invitation message with the dashes
 * prepended (see examples below for the two possible cases).
 * However, this "all in one go" approach allows easy access to the sender's
 * name.
*/
/*
-----------------------------------------------------
[MVP+] BingoParty has invited you to join their party!
You have 60 seconds to accept. Click here to join!
-----------------------------------------------------
and, alternatively
-----------------------------------------------------
[MVP+] BingoParty has invited you to join [MVP+] p0iS's party!
You have 60 seconds to accept. Click here to join!
-----------------------------------------------------
*/
// Trigger and call to processing function for auto-accepting party invitations:
register("chat", function autoAcceptPartyInvite(formattedSenderName) {
  const unformattedPlayerName = removeRank(formattedSenderName).toLowerCase();
  if (!BingoPartyTools.getSetting("BingoPartyFeatures", "Party autoaccept")) {
    //outputCommand("msg " + unformattedPlayerName + " This setting is currently disabled. ("+ "autoaccept party invite" + ")");
    return;
  }
  if (!playerHasPermissions(formattedSenderName)) return;
  waitAndOutputCommand("party accept " + unformattedPlayerName, 1000);
}).setChatCriteria("-----------------------------------------------------\n${name} has invited you to join ").setParameter("start");

/**
 * The current main ChatTrigger: Party moderation commands sent to the host
 * account via direct messages, i.e. using /msg
 */
register("chat", function processCommandFromDirectMessage(formattedSenderName, message) {
  message = ChatLib.removeFormatting(message).trim();

  /* if it's not in command syntax, we can and should directly exit (since every
   direct and perhaps later also party message is scanned for a match) */
  if (message.slice(0,1) != "!") {
    return;
  }

  let messageWords = message.split(" ");

  var command = "";
  if (messageWords.length > 1) {
    // e.g. !p mute, !p kick ign, etc.
    command = messageWords[1].toLowerCase();
  } else {
    // Exit if no command was passed
    return;
  }

  if (!playerHasPermissions(formattedSenderName)) {
    /* The messages are pretty soon blocked by Hypixel for repeating multiple
    times anyways… so for the time being at least, disallowed users are just
    not informed about their missing permissions at all. */
    // outputCommand("r You do not have the permissions to run this! ("+ command + ")");
    return;
  }

  // "debug":
  //console.log("--- Received allowed direct /msg! ---");
  //console.log("Sending player:\n'" + sendingPlayerName + "'");
  //console.log("Message:\n'" + message + "'");

  /* Argument to a command, if present, comes one word after it
  (will most commonly be e.g. the receivingPlayerName) */
  var commandArgument = "";
  if (messageWords.length > 2) {
    commandArgument = messageWords[2];
  }

  // passing the full message is solely needed for !p speak, otherwise it wouldn't be needed
  executeHypixelPartyCommand(formattedSenderName, command, commandArgument, message);
}).setChatCriteria("From ${name}: ${message}");

/**
 * The potential next ChatTrigger: Party moderation commands sent to the host
 * account directly via party chat, i.e. using /pc
 *
 * **currently unused**
 */
/*
register("chat", function processCommandFromPartyChat(formattedSenderName, message) {
  // Parse message, then…
  // executeHypixelPartyCommand(formattedSenderName, command, commandArgument, message);
}).setChatCriteria("Party > ${name}: ${message}");
*/

/**
 * The function to be called when a new ChatTrigger is added, e.g. commands
 * sent in party/guild chat or even perhaps received from Discord.
 * @param {String} formattedSenderName  IGN with Hypixel rank and potentially Minecraft formatting codes, e.g. `[MVP+] splasherName`
 * @param {String} command  The entire single-word command to be executed
 * @param {String} commandArgument  Optional argument to the main command,
 * most commonly used as `receivingPlayerName`, i.e. an IGN for the player
 * "affected" by some commands, for example kicking from or inviting to the
 * party. All commands have exactly one argument, except for speak, which uses
 * the entire rest of the message.
 * @param {String} message  The entire message of the command (everything after
 * e.g. `From formattedSenderName:`)
 */
function executeHypixelPartyCommand(formattedSenderName, command, commandArgument, message) {
  // used for disband, help and default (invalid) commands in switch case below
  const casePreservingRankRemovedIGN = removeRank(formattedSenderName);

  let receivingPlayerName = "";

  /* Hypixel quote 2024-01: "You are sending commands too fast! Please slow
  down." + "You can only send a message once every half second!"
  – Yet this issue persisted with anything up to like 2 seconds delay…
  Furthermore of note: ooffyy said 2024-01-07 that queueing commands was
  apparently disallowed by Hypixel, so we apply the wait individually every
  time instead of just using queue-like push/wait+send/pop operations */
  let defaultTimeoutMillis = 2190 + Math.floor(Math.random() * 41) - 20;

  // remove the first two words – "!p command" – from the message string,
  // where command := {speak,say,cmd}
  // TODO: keep the number of words "sliced off" UPDATED in case of
  // ever moving away from `!p command` system, to e.g. just `!command`
  const messageToBroadcast = message.split(" ").slice(2).join(" ");

  /* Currently active commands (for full explanation, all aliases &
  usage see GitHub repository's README):
  transfer, mute, promote, kick, kickoffline, block, unblock, stream, invite,
  allinvite (setting), speak, rule, help */
  switch(command) {
  case "disband":
    // disband is never allowed! "undocumented" non-command
    // (so we perform zero actions except for this funny-eerie bot response)
    waitAndOutputCommand("r What exactly are your plans, " + casePreservingRankRemovedIGN + "? :raisedEyebrow:", defaultTimeoutMillis);
    break;
  case "transfer":
    if (checkSetting("BingoPartyFeatures", "Party transfer", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    if (receivingPlayerName === "") {
      return;
    }
    outputCommand("pc Party was transferred to " + receivingPlayerName + " by " + formattedSenderName + ".");
    waitAndOutputCommand("p transfer " + receivingPlayerName, defaultTimeoutMillis);
    break;
  case "unmute":
    // fallthrough for additional alias
  case "mute":
    if (checkSetting("BingoPartyFeatures", "Party mute", command) < 0)
      return;
    outputCommand("p mute");
    waitAndOutputCommand("pc Party mute was used by " + formattedSenderName + ".", defaultTimeoutMillis);
    break;
  case "promote":
    if (checkSetting("BingoPartyFeatures", "Party promote", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    if (receivingPlayerName == null || receivingPlayerName.length == 0) {
      // no name supplied, thus promote command sender instead
      receivingPlayerName = removeRank(formattedSenderName).toLowerCase();
    }
    outputCommand("pc " + receivingPlayerName + " was promoted by " + formattedSenderName + ".");
    waitAndOutputCommand("p promote " + receivingPlayerName, defaultTimeoutMillis);
    break;
  case "kickafk":
    // fallthrough for additional alias
  case "kickoffline":
    outputCommand("p kickoffline");
    break;
  case "remove":
    // fallthrough for additional alias
  case "kick":
    if (checkSetting("BingoPartyFeatures", "Party kick", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    if (receivingPlayerName.toLowerCase() === partyHostNameWithoutRank.toLowerCase()) {
      // Can't kick myself if I'm party leader, have a little fun instead. Also,
      // I attempted to make it a little less hard-coded unto myself and more
      // interchangeable by at least using a variable for the party host name…
      outputCommand("pc " + formattedSenderName + " tried kicking [MVP++] " + partyHostNameWithoutRank + " from the party. L bozo!");
      return;
    }
    else if (receivingPlayerName === "") {
      return;
    }
    outputCommand("pc " + receivingPlayerName + " was kicked from the party by " + formattedSenderName + ".");
    waitAndOutputCommand("p remove " + receivingPlayerName, defaultTimeoutMillis);
    break;
  case "ban":
    // fallthrough for additional alias
  case "block":
    if (checkSetting("BingoPartyFeatures", "Party block", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    if (receivingPlayerName === "") {
      return;
    }
    outputCommand("ignore add " + receivingPlayerName);
    waitAndOutputCommand("p remove " + receivingPlayerName, defaultTimeoutMillis+500);
    waitAndOutputCommand("pc " + receivingPlayerName + " was removed from the party and blocked from rejoining by " + formattedSenderName + ".", defaultTimeoutMillis);
    break;
  case "unban":
    // fallthrough for additional alias
  case "unblock":
    if (checkSetting("BingoPartyFeatures", "Party unblock", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    outputCommand("ignore remove " + receivingPlayerName);
    break;
  case "open":
    // fallthrough for additional aliases
  case "public":
    // fallthrough for additional aliases
  case "stream":
    if (checkSetting("BingoPartyFeatures", "Party open (stream size)", command) < 0)
      return;
    // Hypixel's lowest for a stream is a maximum of two members, but that
    // does not really make sense for the bingo party. Adapt as needed.
    let minimumPartySlots = 10; // 20, 30, …
    let maximumPartySlots = 100; // Hypixel server-given limit
    // number of party slots count to open up for (rarely, if ever, has a reason
    // not to be 100). If it isn't integer, we use the maximum as default
    let newPartySize = parseInt(commandArgument);
    if (newPartySize != NaN) {
      if (commandArgument >= minimumPartySlots && commandArgument <= maximumPartySlots) {
        // only assign user input as max. party size if it's valid, stick
        // with maximum possible (rather than minimum) size otherwise
        maximumPartySlots = commandArgument;
      }
    }
    outputCommand("pc Party size was set to " + maximumPartySlots + " by " + formattedSenderName + ".");
    waitAndOutputCommand("stream open " + maximumPartySlots, defaultTimeoutMillis);
    break;
  case "inv":
    // fallthrough for additional alias
  case "invite":
    if (checkSetting("BingoPartyFeatures", "Party invite", command) < 0)
      return;
    receivingPlayerName = commandArgument;
    if (receivingPlayerName == null || receivingPlayerName.length == 0) {
      // no name supplied, thus invite command sender instead
      receivingPlayerName = removeRank(formattedSenderName).toLowerCase();
    }
    outputCommand("p invite " + receivingPlayerName);
    waitAndOutputCommand("pc " + formattedSenderName + " invited " + receivingPlayerName + " to the party.", defaultTimeoutMillis);
    break;
  case "allinvite":
    if (checkSetting("BingoPartyFeatures", "Party allinvite", command) < 0)
      return;
    outputCommand("p setting allinvite");
    waitAndOutputCommand("pc " + formattedSenderName + " toggled allinvite setting.", defaultTimeoutMillis);
    break;
  case "say":
    // fallthrough for additional alias
  case "speak":
    if (checkSetting("BingoPartyFeatures", "Party speak", command) < 0)
      return;
    outputCommand("pc " + formattedSenderName + ": " + messageToBroadcast);
    break;
  case "pl":
    // fallthrough for additional alias
  case "size":
    // TODO: dm back "party members: xx", extracted from /pl
    // (for checking on party even while not in it…)
    // outputCommand("pl");
    // memberMessage = /* more parsing…? */ "";
    // outputCommand("r " + memberMessage);
    break;
  case "rule":
    if (checkSetting("BingoPartyFeatures", "Party rule", command) < 0)
      return;
    let ruleNumber = "";
    // Convert iterator (map.keys()) into array to check against
    // The data itself comes from data.js, just like allowlist array
    const RuleNames = Array.from(bingoBrewersRules.keys());
    /* in this case the argument to the command should be a BingoBrewers (BB)
    rule the command user wants to cite (only to be used if the argument was
    passed on to us and exists, of course; otherwise use default of rule 1) */
    if (message.split().length > 2) {
      ruleNumber = commandArgument;
    }
    if (!RuleNames.includes(ruleNumber)) {
      // default to rule 1
      ruleNumber = "1";
    }
    outputCommand("pc --- Bingo Brewers rules ---");
    waitAndOutputCommand("pc Rule #" + ruleNumber + ": " + bingoBrewersRules.get(ruleNumber), defaultTimeoutMillis);
    break;
  case "help":
    if (checkSetting("BingoPartyFeatures", "!p help", command) < 0)
      return;
    /* The use of three different messages with the same content is to prevent
    Hypixel's blocking of repeatedly sending the same in direct messages. For
    this, three differing messages are needed/suffice. */
    outputCommand(helpMessages[helpOutputIndex]);
    helpOutputIndex++;
    /* "reset" to outputting the first message from the selection again next time the help command is used, cycling through all available messages */
    if (helpOutputIndex === helpMessages.length) helpOutputIndex = 0;
    break;
  case "cmd":
    /* Administrator-only command: will directly execute _whatever_ is received.
    Due to this being de facto equivalent to having direct (even if chat-only)
    access to the account, I will only let myself have this permission, since
    BingoParty is, in fact, my account. */
    if (casePreservingRankRemovedIGN.toLowerCase() != "aphased") {
      waitAndOutputCommand("r Hi " + casePreservingRankRemovedIGN + ", use !p help ", 500);
    }
    /* This has to include the exact message, the same as it would be "typed"
    by a player, _minus_ the preceding slash. Examples:
    `pc hello everybody`
    `msg IGN <message>` */
    outputCommand(messageToBroadcast);
    break;
  default:
    /* The default case represents any non-valid command, thus we point towards
    the usage/help command since we know the attempt was sent by a user with
    command/party moderation permissions. */
    waitAndOutputCommand("r Hi " + casePreservingRankRemovedIGN + ", use !p help ", 500);
    // tmp/debug:
    // console.log("[default case activated] No party command ran");
    break;
  }
}
