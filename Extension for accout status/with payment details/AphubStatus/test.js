const { json } = require("stream/consumers");
const readlineSync = require("readline-sync");

const {cookie} = require('../cookieStore')



const read = () => {
  let lines = [];
let emptyCount = 0;

console.log("Enter multiple lines (press ENTER twice to stop):");

while (true) {
  let line = readlineSync.question("");

  if (line === "") {
    emptyCount++; // Count empty lines
    if (emptyCount === 2) break; // Stop if empty twice
  } else {
    emptyCount = 0; // Reset count if non-empty input
    lines.push(line);
  }
}
return lines;
};

const fetchFromArray = (arr) => {


    arr.map((item) => {
        // console.log(`${item}`)
        // let nItem = JSON.stringify(item)
        fetch("https://hub.tipalti.com/api/v0/PayeeInfo/PayableStatusReasons", {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              baggage:
                "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250310.19,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=749c3b2b834148cda7477b73c1897522,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payee-loading-payments,sentry-sampled=true",
              "content-type": "application/json",
              "h-rvt":
                "CfDJ8BiZcASKWE5Nk38g9zjD6ZfVE2Dh6wv0mkguXGCcaa9W9FjY8aqoniyP11UJtpDN1Iho-xvqD3-ckYuZPqHz8QoAwDM2ytFLDlGxAGcqKgCYCvxSm58ClkV-vsjUAOY-1rHn-jeEnKceY4aSW-zLUJDwzfmSPh4Bq4hAj8a33a85hNi3LjSqbIDuTOvZt_V78Q",
              priority: "u=1, i",
              "sec-ch-ua":
                '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "sentry-trace": "749c3b2b834148cda7477b73c1897522-bfb9f608ce21bbbc-1",
              "x-requested-with": "XMLHttpRequest",
              cookie: `${cookie}`,
              Referer:
                "https://hub.tipalti.com/dashboard/payees/information/d39c18f9-8b1d-4f86-9ecc-448af6e56f96/payments",
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
          //   body: '{"idap":"d39c18f9-8b1d-4f86-9ecc-448af6e56f96"}',
          body: `{"idap":"${item}"}`,
          
            method: "POST",
          })
            .then((res) => res.json())
            .then((res) => {

              console.log(`idap - ${item} - `)
              if(res.isPayeePayable){
                console.log("Payable - Yes")
                console.log("-----------------------------------------------\n")
              }else{
                console.log("Payable - No")
                console.log("Reason - ", res.statusReasons)
                console.log("-----------------------------------------------\n")

              }
            //   console.log(res)
            });
          
    })
    }

    const arr = read()
fetchFromArray(arr)