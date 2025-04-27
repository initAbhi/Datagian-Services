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

const fetchFromArray = async (arr) => {

    for(const item of arr){
        const res = await  fetch("https://hub.tipalti.com/api/v0/PayeeInfo/PayableStatusReasons", {
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9",
              baggage:
                "sentry-environment=PROD,sentry-release=dashboard-single-spa.20250310.19,sentry-public_key=6751b2dc7285436d91497c835b88b53d,sentry-trace_id=dd86fc91f1094056b4cbb12c0b92f826,sentry-replay_id=63704e3815ca48d5ad79d2b0d1b78d2d,sentry-sample_rate=0.2,sentry-transaction=payee-loading%23payees-list-load,sentry-sampled=false",
                "content-type": "application/json",
              "h-rvt":
                "CfDJ8BiZcASKWE5Nk38g9zjD6ZeK0lF-jNw5nAqlQ2Sd5qsKLJJdLNGATIgQUmrGQAK5M3Y365fRQMjhorJOcLuTyhWs26iQR_5j4MocVFQ73lnGWccbo659yRpLgvbCi2QV3H7OH795rzA_J_1caWd8cVhCG2gcUf__sNdc0EMDOIsWHR8m6zxz7u3R3djhtZ28_g",
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
              cookie: "_cq_duid=1.1740692088.hhzmESILqf0z9U2f; _vwo_consent=1%3A~; _vwo_uuid=D31CEFDE417B2E7F908DD8D7AA59DE5AB; _zitok=74e9c4a2441521a271e81740692089; _vwo_ds=3%3Aa_0%2Ct_0%3A0%241740692088%3A72.97627239%3A%3A%3A%3A1; ajs_anonymous_id=b3c29f23-1b24-4e4b-9804-098516448fd0; _gcl_au=1.1.222765982.1740692090; _fbp=fb.1.1740692091123.991480729375774137; _vwo_uuid_v2=D9C0FE8C21C203C5F00D6984DDBD88695|b21ef5bafa53c7a298cb9a73b48d85c3; _ga_1Z3K2F0B29=GS1.1.1741020511.2.1.1741020541.0.0.0; __stripe_mid=52224b52-7e3b-41e6-a253-935ed622c3c454ffb6; __zlcmid=1QbnSFbeSSxxMKM; _ga_3NW1T0Y66T=GS1.2.1741648313.3.1.1741649053.0.0.0; _ga_RNKV062SNG=GS1.2.1741802968.28.1.1741803210.0.0.0; _ga=GA1.1.569259907.1740596775; _vis_opt_s=2%7C; _uetsid=9c86d2c0008211f0a870f783382f27c6|118nd6c|2|fu7|0|1899; __q_state_7SPkB37RaEWMPQDQ=eyJ1dWlkIjoiZDU0MTM5YTktNTkxNy00NjJmLWE3ZTEtMTQ0NjY2ZmNlM2I3IiwiY29va2llRG9tYWluIjoidGlwYWx0aS5jb20iLCJhY3RpdmVTZXNzaW9uSWQiOm51bGwsInNjcmlwdElkIjoiMTYwNjI1NzA1MDA4MzQyNzYyMyIsIm1lc3NlbmdlckV4cGFuZGVkIjpmYWxzZSwicHJvbXB0RGlzbWlzc2VkIjpmYWxzZSwiY29udmVyc2F0aW9uSWQiOiIxNjExMDIzNTI1MDgwMzAyODU5In0=; _uetvid=ad0d00b0f55211efbfd0037949fa7c15|1p5yj19|1741925276823|1|1|bat.bing.com/p/insights/c/w; _ga_TB51JZRT33=GS1.1.1741947909.3.0.1741947909.60.0.0; .AspNetCore.Antiforgery.VyLW6ORzMgk=CfDJ8BiZcASKWE5Nk38g9zjD6ZceJcPlNJRND4K5oe0yXuV4D7vTHYsqBBt8hWwS11KHtDy5m3miFQoXwnR1hbKvbMtrZrPtm7MANjhlwuxzLMnrw5HPBtdO4UugEEJazH6_RkcdeIm6T3tJcJmUXG989zU; ASP.NET_SessionId=xr00bmqkm5n2g24flmw5wvuh; Tipalti.LoginSessionDetails.CircuitBreaker={%22open%22:false}; Tipalti.OidcLoginState=bc262cdc-768c-4b70-818d-0e35d558c37b; idsrv=CfDJ8AUWgzVqN85LumYVHBLhlg241HDRw6ADRlbDwsUZLwOQW91KImDi-WeRh4ayUjQmnCKTgTJ79vyxP2M6n2uf3YOepBIuYq6XfiXwtAzUA8tHZugEeHGRWnGyTN68Q-zKfCPVplG4rjsCwKmjYuem-fFK8nWmb9w-_H-UB27WFcws932SXKEceUdZ28TUJ1lKh288xxs65B26Jol94ud4JFFGsKPmlyIMy4b7lA1U-Om37xbZMEHiXSUQ1B1o0g335WY7se1K9tBvtKCIYFJQ1mqytnoJhg0GoljYhUk1vGMfeA8ccfGQjTaaWdxzgG7Tk4Aj53dFRZRsEOajEEtgEzn71KuFnyLdV-arpS9lE4NQfPnRQQZGlPpvnu-bsHmN_hiJKbv79g58rs22fNoQdkncxUARhMgkXe-UqvoZcWMwqkCFNiA3RjpMKkAQUJq1WSn0mKHvQIyGzbWT0d-FBnY0eqKaKTajzUO-H1PYJLDEOfLe3MCQcoWYVChnXsO_NhBKv8wzaYIMFk8pPLgdd3sarC4c9vlf_gc1vaoSAF3R1WuMv8EaHFr27eY1b9c9p3RATjqM6m6m3v0RPGrqVfmkBgfyCppP75XjwPlqGTW-l6oC9hnZtCp5NWKxlily1gYeJNWmpd_yy1mNS_Ws1PuJwXNi_cT_4avaAa7TMKOm; tipalti_cookie=995AC5F37FCDC4801AC7EF3D3A060991313F584D346F1FA0D0429DFCD83E4DD709BF26F8264BE86D876A8A59AA8D211CD2BFC1A7BC656C27BC1FB14A0470588B232791798EF05C9D20EDC398DF9FB603CCE1C36AFADF1A41B379A24C5746E9C4BBC85CA2273A87C2067FAFDCA6140D8271A14FCE2CEAF84EAA094F6B295D5410589C21872C386FD9A0949C4CD893F2F7; Tipalti.AccessToken=E992CD6D7AD11F632027EBFCDC77392CCFBEF299322005DD6BB3F46A2EC2127E-1; AccessToken.Shared=E992CD6D7AD11F632027EBFCDC77392CCFBEF299322005DD6BB3F46A2EC2127E-1; Tipalti.LoginSessionDetails={\"LastActivityMilliseconds\":1741979644048,\"SessionLengthMilliseconds\":1800000}; PayerToken=1365; mp_544cdced821b61f3a0ae838de0c32c4f_mixpanel=%7B%22distinct_id%22%3A%20%22%24device%3A1955cf0b41d131e-0d3be546a088d6-26011a51-13c680-1955cf0b41d131e%22%2C%22%24device_id%22%3A%20%221955cf0b41d131e-0d3be546a088d6-26011a51-13c680-1955cf0b41d131e%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fhub.tipalti.com%2Fdashboard%22%2C%22%24initial_referring_domain%22%3A%20%22hub.tipalti.com%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fhub.tipalti.com%2Fdashboard%22%2C%22%24initial_referring_domain%22%3A%20%22hub.tipalti.com%22%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24search_engine%22%3A%20%22google%22%7D; C-RVT=CfDJ8BiZcASKWE5Nk38g9zjD6ZeK0lF-jNw5nAqlQ2Sd5qsKLJJdLNGATIgQUmrGQAK5M3Y365fRQMjhorJOcLuTyhWs26iQR_5j4MocVFQ73lnGWccbo659yRpLgvbCi2QV3H7OH795rzA_J_1caWd8cVhCG2gcUf__sNdc0EMDOIsWHR8m6zxz7u3R3djhtZ28_g; _ga_HJ2T572FNW=GS1.1.1741979619.36.1.1741979654.0.0.0",
      "Referer": "https://hub.tipalti.com/dashboard/payees/information/3a89bcea-707a-4860-b844-b88f9dd2e6b6/payments",
              Referer:
                "https://hub.tipalti.com/dashboard/payees/information/d39c18f9-8b1d-4f86-9ecc-448af6e56f96/payments",
              "Referrer-Policy": "strict-origin-when-cross-origin",
            },
          //   body: '{"idap":"d39c18f9-8b1d-4f86-9ecc-448af6e56f96"}',
          body: "{\"idap\":\"3a89bcea-707a-4860-b844-b88f9dd2e6b6\"}",
          
            method: "POST",
          });
    
  
          console.log(res)
       
    const data = await res.json();

    console.log(`idap - ${item} - `);
    if (data.isPayeePayable) {
      console.log("Payable - Yes");
    } else {
      console.log("Payable - No");
      console.log("Reason - ", data.statusReasons);
    }
    console.log("-----------------------------------------------\n");
}
   
    }

    const arr = read()
fetchFromArray(arr)