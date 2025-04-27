const { json } = require("stream/consumers");
const readlineSync = require("readline-sync");

const { cookie } = require("../cookieStore");

const read = () => {
  let lines = [];
  let emptyCount = 0;

  console.log("Enter multiple IDAP");

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

const fetchFromArray = async (arr) => {
  for (const item of arr) {
    const res = await fetch(
      "https://hub.tipalti.com/api/v0/PayeeInfo/PayableStatusReasons",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          baggage:
            "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250310.19,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=749c3b2b834148cda7477b73c1897522,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payee-loading-payments,sentry-sampled=true",
          "content-type": "application/json",
          "h-rvt":
            "CfDJ8BiZcASKWE5Nk38g9zjD6Zd8aV9hC8ZDIxIWG9AWSxKklZ0PprWokgU7ql2_ksFK0UWzZNPyHdBkleHnwdPMR_NtJkqkSeRmkh1go0fRNxrJVzPph5VcJajGHyWvS-5_-AUbA3w-1w96zL8mi0Xq8UIqLDvB6toJxivSL2Fu2Jb4LnDgNT3epLMUT747Xqwq_w",
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
      }
    );

    const PayeePaymentHistory = await fetch(
      "https://hub.tipalti.com/api/v0/PayeePaymentHistory/GetPayeePaymentHistory",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          baggage:
            "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250310.19,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=e24110400d4f41309053eddcc397b7aa,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payees-list-load,sentry-sampled=false",
          "content-type": "application/json;charset=UTF-8",
          "h-rvt":
            "CfDJ8BiZcASKWE5Nk38g9zjD6Zd8aV9hC8ZDIxIWG9AWSxKklZ0PprWokgU7ql2_ksFK0UWzZNPyHdBkleHnwdPMR_NtJkqkSeRmkh1go0fRNxrJVzPph5VcJajGHyWvS-5_-AUbA3w-1w96zL8mi0Xq8UIqLDvB6toJxivSL2Fu2Jb4LnDgNT3epLMUT747Xqwq_w",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sentry-trace": "e24110400d4f41309053eddcc397b7aa-ae8d86940fb55293-0",
          "x-requested-with": "XMLHttpRequest",
          cookie: `${cookie}`,
          Referer:
            "https://hub.tipalti.com/dashboard/payees/information/3e8d21dd-9950-4e1e-824e-4f741684c5e2/payments",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{\"idap\":\"${item}\",\"pagingData\":{\"PageCount\":1,\"PageSize\":10}}`,
        method: "POST",
      }
    );

    const data = await res.json();
    const history = await PayeePaymentHistory.json();

    console.log(`idap - ${item} - `);
    if (data.isPayeePayable) {
      console.log("Payable - Yes");
    } else {
      console.log("Payable - No");
      console.log("Reason - ", data.statusReasons);
    }
    if (history.totalNumberOfPayments > 0) {
      console.log("Number of payments made - ", history.totalNumberOfPayments);
      console.log("payments - "); //payeePaymentHistoryModels
      history.payeePaymentHistoryModels.map((payment) => {
        console.log(
          "payment ref code - ",
          payment.paymentRefcode,
          "| Status - ",
          payment.status,
          "| Payment method -  ",
          payment.paymentMethod,
          "| Date - ",
          payment.date
        );
      });
    } else {
      console.log("Number of payments made - ", history.totalNumberOfPayments);
    }
    console.log(
      "=======================================================================================================\n"
    );
  }
};

const arr = read();
fetchFromArray(arr);
