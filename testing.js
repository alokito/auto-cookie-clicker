window.$ = $;
window.keepClicking = 1;
window.keepClickingWait = 10;
function autoclickCookie() { 
    window.$("#bigCookie").click(); 
	if (window.keepClicking) { 
        setTimeout(autoclickCookie, window.keepClickingWait);
    } 
};

window.keepClickingGolden = 1;
function autoclickGolden() {
    let waitTime = 10;
    if ($(".shimmer") != null) {
        const image = $(".shimmer").style.backgroundImage
        if (image.indexOf("goldCookie") > 0) {
            console.log(`Clicking shimer ${image} at ${new Date()}`);
            $(".shimmer").click();
        } else if (image.indexOf("wrathCookie") > 0) {
            console.log(`Clicking shimer ${image} at ${new Date()}`);
            $(".shimmer").click();
        } else if (image.indexOf("frostedReindeer") > 0) {
            console.log(`Clicking shimer ${image} at ${new Date()}`);
            $(".shimmer").click();
        } else {
            console.log(`Clicking unexpected shimmer ${image} at ${new Date()}`);
            $(".shimmer").click();
        }
    } else {
        waitTime = 1000;
        // console.log(`No Golden Cookie at ${new Date()}`);
    }
	if (window.keepClickingGolden) { 
        setTimeout(autoclickGolden, waitTime);
    } 
}


function earlyBuyBonus(x, y) {
    const  cps = y.storedCps * Game.globalCpsMult;
    return (x.bulkPrice -  y.bulkPrice) * cps / Game.cookiesPs
}

function bestEarlyBuyBonusItem(x) {
    let bestBonus = undefined;
    const objs = window.Game.ObjectsById;
    let i = 0;
    for (i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (!obj.locked && (obj.bulkPrice < x.bulkPrice)) {
            if (bestBonus == undefined || (earlyBuyBonus(x, bestBonus) < earlyBuyBonus(x, obj))) {
                bestBonus = obj;
            }
        }
    }
    return bestBonus;
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

function payback_v(obj) {
    const  cps = obj.storedCps * Game.globalCpsMult;
    const bestBonus = bestEarlyBuyBonus(obj);
    const payb = (obj.bulkPrice + bestBonus) / cps;
    console.log(`obj ${obj.name}, bestBonus ${bestBonus}, raw payback ${obj.bulkPrice}/${cps} = ${obj.bulkPrice / cps}, payback ${payb}`);
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
        return u.buildingTie.storedTotalCps  * Game.globalCpsMult;
    }
    if (u.pool === "cookie") {
        return Game.cookiesPs * u.power / 100;
    }
    return 0;
}

function upgradePayback(obj) {
    const  cps = upgradeEquivalentCps(obj);
    const payb = obj.getPrice() / cps;
    // console.log(`obj ${obj.name}, bestBonus ${bestBonus}, raw payback ${obj.bulkPrice / cps}, payback ${payb}`);
    return payb;
}
function upgradePayback_v(obj) {
    const  cps = upgradeEquivalentCps(obj);
    const payb = obj.getPrice() / cps;
    console.log(`obj ${obj.name}, raw payback ${obj.getPrice()}/${cps} = ${obj.bulkPrice / cps}, payback ${payb}`);
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

function shorten(n) {

}

window.keepBuying = 1;
function prettySeconds(seconds) {
    function fmt(n,u) {
        return `${n.toFixed(2)} ${u}`;
    }
    if (seconds < 60) {
        return fmt(seconds, 'seconds');
    }
    const minutes = seconds / 60;
    if (minutes < 60) {
        return fmt(minutes, 'minutes');
    } 
    const hours = minutes / 60;
    if (hours < 24) {
        return fmt(hours, 'hours');
    }
    const days = hours/ 24;
    if (days < 7) {
        return fmt(days, 'days');
    }
    const weeks = days / 7;
    if (weeks < 52) {
        return fmt(weeks, 'weeks');
    }
    const years = days/365;
    return fmt(years, 'years');
}
function autobuy() {
    const bestobj = bestvalue();
    const bestup = bestupgrade();
    function summary() {
        const bo = bestobj?`${bestobj.name} ${prettySeconds(payback(bestobj))}`:'no object';
        const bu = bestup?`${bestup.name} ${prettySeconds(upgradePayback(bestup))}`:'no upgrade';
        return `${bo} vs ${bu}`;
    
    }
    const bestv  = bestup?(bestobj?(
        payback(bestobj) < upgradePayback(bestup)?bestobj:bestup
    ):bestup):bestobj;
    const otherv = bestv === bestup?bestobj: bestup;

    let waitTime = 1000;
    const price = bestv.bulkPrice == undefined?bestv.getPrice():bestv.bulkPrice;
    if (price < Game.cookies) {
        console.log(`buying ${bestv.name} at ${new Date() } (${summary()})`);
        bestv.buy();
        waitTime = 100;
    } else {
        console.log(`can't afford ${bestv.name}`);
    }
    if (window.keepBuying) {
        setTimeout(autobuy, waitTime);
    }    
}
