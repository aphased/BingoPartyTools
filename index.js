/* Everything this module does/adds can be toggled off in its settings menu
(run /bpt in-game to configure per-launch; edit settings.js to change the
general default values for what is enabled and what's not) */

// Core BingoPartyTools functionality:
require("./bpt.js");
require("./utils.js");
require("./settings.js");
require("./data.js");
// Optional "Clean Chat" stuff:
require("./opt/whitedms.js");
require("./opt/partyhider.js");
require("./opt/lobbyjoinhider.js");
