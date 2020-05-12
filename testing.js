window.$ = $;
window.keepClicking = 1;
function autoclickCookie() { 
    window.$("#bigCookie").click(); 
	if (window.keepClicking) { 
        setTimeout(autoclickCookie, 10);
    } 
};

window.keepClickingGolden = 1;
function autoclickGolden() {
    if ($(".shimmer") != null) {
        const image = $(".shimmer").style.backgroundImage
        if (image.indexOf("goldCookie") > 0) {
            console.log(`Clicking shimer ${image} at ${new Date()}`);
            $(".shimmer").click();
        } else {
            console.log(`Not Clicking unexpected shimmer ${image} at ${new Date()}`);
        }
    } else {
        // console.log(`No Golden Cookie at ${new Date()}`);
    }
	if (window.keepClickingGolden) { 
        setTimeout(autoclickGolden, 10000);
    } 
}


function earlyBuyBonus(x, y) {
    const  cps = y.storedCps * Game.globalCpsMult;
    return (x.bulkPrice -  y.bulkPrice) * cps / Game.cookiesPs
}

function bestEarlyBuyBonus(x) {
    let bestBonus = 0;
    const objs = window.Game.ObjectsById;
    let i = 0;
    for (i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (!obj.locked && (obj.bulkPrice < x.bulkPrice)) {
            if (bestBonus < earlyBuyBonus(x, obj)) {
                bestBonus = earlyBuyBonus(x, obj);
            }
        }
    }
    return bestBonus;
}

function payback(obj) {
    const  cps = obj.storedCps * Game.globalCpsMult;
    const bestBonus = bestEarlyBuyBonus(obj);
    const payb = (obj.bulkPrice + bestBonus) / cps;
    // console.log(`obj ${obj.name}, bestBonus ${bestBonus}, raw payback ${obj.bulkPrice / cps}, payback ${payb}`);
    return payb;
}


function bestvalue() {
    const objs = window.Game.ObjectsById;
    let best = undefined;
    let i = 0;
    for (i = 0; i < objs.length; i++) {
        const obj = objs[i];
    const  cps = obj.storedCps * Game.globalCpsMult;
    const payb = obj.bulkPrice / cps
      // console.log(`${obj.name} produces ${cps}, costs ${obj.bulkPrice}, islocked ${obj.locked}, payback ${payb}, i ${i}, len ${objs.length}`);
        if (!obj.locked) {
            if ((best == undefined) || (payback(obj) < payback(best))) {
                best = obj;
            }
        }
    }
     // console.log(`best: ${best.name}, payback ${payback(best)}`)
    return best;
}

function upgradeEquivalentCps(u) {
    if (u.buildingTie) {
        return u.buildingTie.storedTotalCps;
    }
    if (u.pool === "cookie") {
        return Game.cookiesPs * u.power / 100;
    }
    return 0;
}

function upgradePayback(obj) {
    const  cps = upgradeEquivalentCps(obj) * Game.globalCpsMult;
    const payb = obj.getPrice() / cps;
    // console.log(`obj ${obj.name}, bestBonus ${bestBonus}, raw payback ${obj.bulkPrice / cps}, payback ${payb}`);
    return payb;
}

function bestupgrade() {
    const objs = window.Game.UpgradesInStore.filter(u => upgradeEquivalentCps(u) > 0);
    let best = undefined;
    let i = 0;
    for (i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if ((best == undefined) || (upgradePayback(obj) < upgradePayback(best))) {
            best = obj;
        }
    }
    // console.log(`best upgrade: ${best.name}, payback ${upgradePayback(best)}`)
    return best;
}

window.keepBuying = 1;
function autobuy() {
    const bestobj = bestvalue();
    const bestup = bestupgrade();
    const bestv  = bestup?(bestobj?(
        payback(bestobj) < upgradePayback(bestup)?bestobj:bestup
    ):bestup):bestobj

    let waitTime = 1000;
    const price = bestv.bulkPrice == undefined?bestv.getPrice():bestv.bulkPrice;
    if (price < Game.cookies) {
        console.log(`buying ${bestv.name} at ${new Date()}`);
        bestv.buy();
    } else {
        console.log(`can't afford ${bestv.name}`);
    }
    if (window.keepBuying) {
        setTimeout(autobuy, waitTime);
    }    
}
