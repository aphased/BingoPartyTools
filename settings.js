import { SettingsObject, Setting } from 'SettingsManager/SettingsManager'

var BingoPartyTools = new SettingsObject("BingoPartyTools", [
  {
    name: "BingoPartyFeatures",
    settings: [
      new Setting.Toggle("Party transfer", true),
      new Setting.Toggle("Party mute", true),
      new Setting.Toggle("Party promote", true),
	    new Setting.Toggle("Party kick", true),
      new Setting.Toggle("Party block", true),
      new Setting.Toggle("Party unblock", true),
      new Setting.Toggle("Party open (stream size)", true),
      new Setting.Toggle("Party invite", true),
      new Setting.Toggle("Party allinvite", true),
      new Setting.Toggle("Party autoaccept", true),
      new Setting.Toggle("Party speak", true),
      new Setting.Toggle("Party rule", true),
      new Setting.Toggle("!p help", true),
    ]
  }, {
    name: "CleanChat",
    settings: [
      new Setting.Toggle("WhiteDMs", true),
      new Setting.Toggle("PartyHider Lines", true),
      new Setting.Toggle("PartyHider Join", false),
      new Setting.Toggle("PartyHider Disconnect", true),
      new Setting.Toggle("PartyHider Leave", true),
      new Setting.Toggle("LobbyJoinHider", true)
    ]
  }
]);

// Easter egg:
// Menu tab background color is that of the in-game "Bingo blue" dye
// first alpha/transparency, then the actual color value #002FA7 :D
BingoPartyTools.setCommand("bpt", true).setSize(250, 200).setColor(0xee002fa7);

Setting.register(BingoPartyTools);

export { BingoPartyTools }
