window.keepPledging = 1;
function checkPledge(){
  if (Game.pledgeT == 0){
    $("#upgrade0").click();
  }
  keepPledging && setTimeout(checkPledge,3000);
}
