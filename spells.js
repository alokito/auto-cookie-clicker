window.keepCasting = 1;
function checkSpells() {
  const mg = Game.ObjectsById[7].minigame;    
  const spell = mg.spellsById[3];
  // change the id in the line right above this to cast different spells.
  if (mg.magic >= mg.magicM) {
    mg.castSpell(spell);
  }
  window.keepCasting && setTimeout(checkSpells, 1000);
}
