const fromSelect = document.getElementById("fromCurrency");
const amountInput = document.getElementById("amount");
const unitSpan = document.querySelector(".input-wrap .unit");
const resultsDiv = document.getElementById("results");

// 固定JSON
//const ratesData = {
//  "USD": {"JPY":148.095,"GBP":0.81,"KRW":1325.4,"CNY":6.9},
//  "JPY": {"USD":0.00676,"GBP":0.0055,"KRW":7.4,"CNY":0.0467},
//  "GBP": {"USD":1.23,"JPY":179.4,"KRW":1630.5,"CNY":8.5},
//  "KRW": {"USD":0.00075,"GBP":0.00061,"JPY":0.135,"CNY":0.0052},
//  "CNY": {"USD":0.145,"GBP":0.118,"KRW":192.0,"JPY":21.1}
//};
//JSON外部化
let ratesData = {}; // 先に空オブジェクトを作る

// JSON読み込み
fetch("rates.json")
  .then(res => res.json())
  .then(data => {
    ratesData = data;
    updateResults(); // 読み込み後に初期計算
  })
  .catch(err => {
    console.error("JSON読み込み失敗", err);
  });


const currencyMap = {
  "USD":"アメリカ",
  "GBP":"イギリス",
  "KRW":"韓国",
  "CNY":"中国",
  "JPY":"日本"
};

// 数値を億・万単位でフォーマット
function formatAmount(num){
  if(typeof num !== "number" || isNaN(num)) return "-";
  if(num >= 100000000) return (num/100000000).toFixed(2)+"億";
  if(num >= 10000) return (num/10000).toFixed(2)+"万";
  return num.toFixed(0);
}

function updateResults(){
  const from = fromSelect.value;
  const amount = parseFloat(amountInput.value);
  if(!amount) {
    resultsDiv.innerHTML = "";
    return;
  }

  //unitSpan.textContent = from;
const unitMap = { "USD":"$", "JPY":"円", "GBP":"£", "KRW":"₩", "CNY":"元" };
unitSpan.textContent = unitMap[from] || from;

  // 出力順を指定
  let order = ["USD","GBP","KRW","CNY","JPY"].filter(c=>c!==from);
  if(from==="JPY") {
    order = ["USD", ...order.filter(c=>"USD"!==c)];
  } else {
    order = ["JPY", ...order.filter(c=>"JPY"!==c)];
  }

  // 結果表示
  resultsDiv.innerHTML = "";
  order.forEach(to=>{
    const rate = ratesData[from][to];
    const converted = rate * amount;
    const div = document.createElement("div");
    div.className = "result-box";
    //div.innerHTML = `<div>${currencyMap[to]}</div><div><span class="num">${formatAmount(converted)}</span><span class="unit"> ${to}</span></div>`;
    //const unitMap = { "USD":"$", "JPY":"円", "GBP":"£", "KRW":"₩", "CNY":"元" };
    const unitMap = { "USD":"ドル", "JPY":"円", "GBP":"ポンド", "KRW":"ウォン", "CNY":"元" };
    div.innerHTML = `<div>${currencyMap[to]}</div><div><span class="num">${formatAmount(converted)}</span><span class="unit"> ${unitMap[to]}</span></div>`;

    
    resultsDiv.appendChild(div);
  });
}

// イベント
fromSelect.addEventListener("change", updateResults);
amountInput.addEventListener("input", updateResults);

// 初期表示
updateResults();
