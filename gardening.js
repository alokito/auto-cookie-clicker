
function scoreBuff(buff) {
  if ([
    "Dragon Harvest",
    "Extra cycles",
    "Juicy profits",
    "Oiled-up",
    "Congregation",
    "Refactoring",
    "Breakthrough",
    "Macrocosm",
    "Manabloom",
    "Fervent adoration",
    "Frenzy",
    "Righteous cataclysm",
    "Luxuriant harvest",
    "Solar flare",
    "Delicious lifeforms",
    "Winning streak",
    "High-five",
    "Golden ages"].indexOf(buff) >= 0) {
    return 1;
  } else if (buff == 'Elder frenzy') {
    return 2;
  } else if (buff == 'Cursed finger') {
    return -10;
  } else if (['Click frenzy', 'Cookie storm', 'Dragonflight'].indexOf(buff) >= 0) {
    return 0;
  } else if (buff == 'Clot') {
    return -1;
  } else {
    console.log(`Unexpected buff ${buff}: ${JSON.stringify(Game.buffs[buff])}`);
    return 1;
  }
}

function totalBuffMult() {
  const buffs = Object.keys(Game.buffs);
  const total = buffs.reduce((m,v) => {
    const buff = Game.buffs[v];
    // console.log(`buff ${v}: ${buff.multCpS}`);
    return ((buff.multCpS > 0)?buff.multCpS:1)*m;
  },1);
  return total;
}

window.keepHarvesting = 1;
window.keepHarvestingPlant = Game.ObjectsById[2].minigame.plantsById[8];
function checkHarvest() {
  let wait = 1000;
  const mg = Game.ObjectsById[2].minigame;
  const buffs = Object.keys(Game.buffs);
  const score = buffs.reduce((mem, val) => mem + scoreBuff(val), 0);
  const mult = totalBuffMult();
  const context = `buffs ${JSON.stringify(buffs)} (${mult})`
  let i, j;
  if (mult > 100) {
    for (i =0; i<7; i++) {
      for (j = 0; j < 7; j++) {
        p = mg.getTile(i,j);
        me = mg.plantsById[p[0]-1];
        if (me && (["Bakeberry", "Queenbeet", "Chocoroot", "White chocoroot"].indexOf(me.name) >= 0) && p[1] >= me.mature) {
          console.log(`harvesting ${me.name} in col ${i} row ${j}, ${context} at ${new Date()}`);
          mg.harvest(i,j);
          window.keepHarvesting && setTimeout(checkHarvest, 10);
          return;
        }
      }
    }
    // console.log(`nothing to harvest, ${context}`);
  } else if (mult <= 1) {
    for (i =0; i<7; i++) {
      for (j = 0; j < 7; j++) {
        p = mg.getTile(i,j);
        me = mg.plantsById[p[0]-1];
        if (!me && mg.isTileUnlocked(i,j)) {
          const bb = window.keepHarvestingPlant;
          console.log(`Planting ${bb.name} in col ${i} row ${j}, ${context} at ${new Date()}`);
          mg.useTool(bb.id, i, j);
          window.keepHarvesting && setTimeout(checkHarvest, 100);
          return;
        }
      }
    }
     // console.log(`nothing to plant? ${context}`);
  } else {
    let numMature = 0;
    let numGrowing = 0;
    for (i =0; i<7; i++) {
      for (j = 0; j < 7; j++) {
        const plantIdAge = mg.getTile(i,j);
        const plantDetails = mg.plantsById[plantIdAge[0]-1];
        if (plantDetails) {
          if (plantIdAge[1] >= plantDetails.mature) {
            numMature = numMature + 1;
          } else {
            numGrowing = numGrowing + 1;
          }
        }
      }
    }
    if (Date.now() > mg.nextSoil) {
      if (numGrowing > 0) {
        if (mg.soil != 1) {
          console.log(`${numGrowing} growing plants, setting soil to fertilizer at ${new Date()}`)
          $("#gardenSoil-1").click();
        }
      } else {
        if (mg.soil != 2) {
          console.log(`${numGrowing} growing plants, setting soil to clay at ${new Date()}`)
          $("#gardenSoil-2").click();
        }
      }
    }
     // console.log(`not enough buffs, ${context}`);
  }
  window.keepHarvesting && setTimeout(checkHarvest, 1000);
}
