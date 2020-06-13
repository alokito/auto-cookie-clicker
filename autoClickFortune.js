window.keepCheckingfortune = 1
function checkFortune() {
  if (Game.TickerEffect && Game.TickerEffect.type=='fortune'){
    Game.tickerL.click();
    console.log(`clicked fortune ${Game.tickerL.textContent} granting ${Game.TickerEffect.sub} at ${new Date()}`)
  }
  setTimeout(checkFortune, 7000);
}
