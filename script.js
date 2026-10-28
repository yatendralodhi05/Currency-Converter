const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdown = document.querySelectorAll(".drop-down select");
const btn =  document.querySelector("form button");
const fromCurr =  document.querySelector(".from select");
const toCurr =  document.querySelector(".to select");
const msg = document.querySelector(".msg");


for(let select of dropdown){
    select.innerHTML = "";
    for(let currCode in countryList){
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

     if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        
    select.append(newOption);
}
 select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    })
}


// const updateExchangeRate = async () => {
//   let amount = document.querySelector(".amount input");
//   let amtVal = amount.value;
//   if (amtVal === "" || amtVal < 1) {
//     amtVal = 1;
//     amount.value = "1";
//   }
//   const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
//   let response = await fetch(URL);
//   let data = await response.json();
//   let rate = data[toCurr.value.toLowerCase()];

//   let finalAmount = amtVal * rate;
//   msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
// };


const updateFlag = (element) => {
    let currCode =  element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img =element.parentElement.querySelector("img");
    img.src = newSrc;
}





btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    if (amount.value.trim() === "" || amtVal < 1 || !Number.isFinite(amtVal)) {
        amtVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();

    if (from === to) {
        msg.innerText = `${amtVal} ${fromCurr.value} = ${amtVal} ${toCurr.value}`;
        return;
    }

    const URL = `${BASE_URL}/${from}.json`;

    try {
        msg.innerText = "Converting...";

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to fetch currency rates");
        }

        const data = await response.json();
        const rate = data[from][to];

        if (rate === undefined) {
            throw new Error("Currency rate not available");
        }

        const finalAmount = amtVal * rate;

        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        console.error(error);
        msg.innerText = "Unable to get exchange rate. Please try again.";
    }
});

// Set initial flags
updateFlag(fromCurr);
updateFlag(toCurr);