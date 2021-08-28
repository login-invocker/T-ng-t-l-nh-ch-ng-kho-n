

async function goToActivityTab() {

  const activityTab = document.getElementsByClassName("btnSuccess")[0];
  const config = { attributes: true, childList: true, subtree: true };
  let train = new Train(10)
  let pocinex = new Pocinex(JSON.parse(localStorage.getItem('USER_TOKEN')))

  // Callback function to execute when mutations are observed
  const callbackMutationObserver = async function (mutationsList, observer) {
    
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // console.log('A child node has been added or removed.');
      }
      else if (mutation.type === 'attributes') {
        // console.log('The ' + mutation.attributeName + ' attribute was modified.');
        if (mutation.attributeName === 'disabled') {
          if (!activityTab.disabled) {
            const userToken = JSON.parse(localStorage.getItem('USER_TOKEN'));
            pocinex.setToken(userToken);

            const response = await pocinex.fetchSpotBalance()
            pocinex.setDemoBalance(response.d.demoBalance)
            pocinex.addListMoneyMagic(pocinex.demoBalance)
            const countElemtnt = pocinex.getListMoneyMagic().length
            if( countElemtnt > 1 && (pocinex.getListMoneyMagic()[countElemtnt - 1] < pocinex.getListMoneyMagic()[countElemtnt - 2])){

              train.setBetAmountMulti(2)
            }
            dat_lenh({
              betAccountType: "DEMO",
              betAmount: train.getBetAmount(),
              betType: "UP",
              token: userToken.access_token
            })
          }
        }
      }
      else if (mutation.type === 'subtree') {
        // console.log('The ' + mutation.subtree + ' change.');
      }
    }
  };

  const observer = new MutationObserver(callbackMutationObserver);

  observer.observe(activityTab, config);
}

var dat_lenh = ({ betAccountType, betAmount, betType, token }) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "betAccountType": betAccountType,
    "betAmount": betAmount,
    "betType": betType,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://pocinex.net/api/wallet/binaryoption/bet", requestOptions)
    .then(response => response.text())
    .then(result => {}
      // console.log(result)
    )
    .catch(error => console.log('error', error));
}

// 
var Pocinex = class {
  constructor(token){
    this.demoBalance = 0;
    this.listMoneyMagic = [];
    this.token = token;
    this.accessToken = token.access_token;
    this.url = "https://pocinex.net/api";

    this.routes = {
      spotBalance: '/wallet/binaryoption/spot-balance'
    };
    // this.setDemoBalance()
  }
  
  setToken(token){ this.token = token;}
  gettoken(){ return this.token;}

  setDemoBalance(demoBalance){ this.demoBalance = demoBalance }
  getDemoBalance(){ return this.demoBalance; }
  
  addListMoneyMagic(moneyMagic){ 
    if(this.listMoneyMagic.length == 3 ) this.listMoneyMagic.shift()
    this.listMoneyMagic.push(moneyMagic)
  }
  getListMoneyMagic(){ return this.listMoneyMagic}
  
  async fetchSpotBalance(){
    const data = {
      url: this.url + this.routes.spotBalance,
      method: 'get',
      token: this.token,
    };
    const res = await axios(data);
    return res;
  }
}

// train setup
var Train = class {
  constructor(moneyStart) {
    this.moneyStart = moneyStart;
    this.betAmount = moneyStart
    this.listMagic = [1,1,1,1]
  }

  setListMagic(){
    chrome.storage.sync.get(['key'], function(result) {
      const resultMap = result.split(',').map(x=>+x);
      this.listMagic = resultMap;
    });
  }
  getListMagic(){return this.listMagic;}

  
  setBetAmountMulti(amountMultiplier) {
    this.betAmount = this.betAmount * amountMultiplier
  }
  setBetAmount(amount) { this.betAmount = amount }
  getBetAmount() { return this.betAmount; }

  setNextBetMultiplier(listBetAmountMultiplier) {
    this.listBetAmountMultiplier = listBetAmountMultiplier
  }
  setNextBetMultiplier() {return this.listBetAmountMultiplier}
}

// axios
var axios = async ({url, method, token, body}) => {
  var headers = new Headers();
  headers.append("Authorization", `Bearer ${token.access_token}`);
  headers.append("Content-Type", "application/json");

  const requestOptions = {
    method,
    headers,
    body,
    redirect: 'follow'
  };
  // console.log(token.accessToken)
  const response = await fetch(url, requestOptions)
  // let data = await response.text();

  return response.json()
}

// {"ok":true,"d":{"availableBalance":0.0000,"usdtAvailableBalance":0.0000,"demoBalance":913.0000,"aliAvailableBalance":0.0000,"aliPrice":19.31}}

goToActivityTab();
