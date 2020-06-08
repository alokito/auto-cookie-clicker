window.keepCasting = 1;
function minBuffTime() {
   const buffNames = Object.keys(Game.buffs);
   const buffs = buffNames.map(b => Game.buffs[b]).filter(b => b.multCpS > 1);
   if (buffs.length > 0) {
     return buffs.reduce((m,v) => (v.time < m)?v.time:m, buffs[0].time);
   }  
}
function checkSpells() {
  const mg = Game.ObjectsById[7].minigame;    
  const spell = mg.spellsById[2];
  const cost = mg.getSpellCost(spell);
  const mult = totalBuffMult();
  
  const runningOut = minBuffTime() < 100;
  const castAll = (mult > 100) && (mg.magic >= cost);
  const castMax = (mult > 1) && (mg.magic >= mg.magicM);
  // change the id in the line right above this to cast different spells.
  if (runningOut && (castAll || castMax)) {
    const buffNames = Object.keys(Game.buffs);
    console.log(`Casting ${spell.name} to extend ${JSON.stringify(buffNames)}at ${new Date()}`);
    mg.castSpell(spell);
  }
  window.keepCasting && setTimeout(checkSpells, 1000);
}
