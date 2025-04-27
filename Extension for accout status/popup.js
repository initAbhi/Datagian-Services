//-------------------------------------------------
//frontend taking input
let idapList;

// ----------------------------------------------------------------
// sending data to backend
document.getElementById("extractCookies").addEventListener("click", () => {
  const inputText = document.getElementById("idapInput").value;
  idapList = inputText
    .split("\n")
    .map((id) => id.trim())
    .filter((id) => id);
  if (idapList.length === 0) {
    alert("Please enter at least one IDAP.");
    return;
  }

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "Fetching data...";
  console.log(idapList);

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.cookies.getAll({ url: activeTab.url }, function (cookies) {
      let cookieString = "";
      let cRVT = ""; // Variable to store C-RVT cookie

      // Iterate through cookies and build the cookie string
      cookies.forEach((cookie) => {
        if (cookie.name === "C-RVT") {
          cRVT = cookie.value; // Store the C-RVT cookie separately
        } else {
          cookieString += `${cookie.name}=${cookie.value}; `;
        }
      });

      // If C-RVT cookie exists, include it in the cookie string as well
      if (cRVT) {
        cookieString += `C-RVT=${cRVT}; `;
      }

      // Log the formatted cookie string and the separate C-RVT variable
      console.log("Formatted Cookies:", cookieString);
      console.log("C-RVT:", cRVT);

      fetchFromArray(idapList, cookieString, cRVT);
    });
  });
});

//------------------------------------------------
const fetchFromArray = async (arr, cookieString, cRVT) => {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = ""; // Clear previous results

  for (const item of arr) {
    try {
      const response = await fetch("https://backend-for-tipalti-extension.onrender.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cookies: cookieString, // All cookies in one string
          cRVT: cRVT, // C-RVT as a separate variable
          idap: item,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      // Create new HTML entry
      let entry = `<p><b>IDAP:</b> ${item}</p>`;
      entry += `<p><b>Payable:</b> ${
        data.data.isPayeePayable ? "Yes" : "No"
      }</p>`;

      if (!data.data.isPayeePayable) {
        entry += `<p><b>Reason:</b> ${data.data.statusReasons.join(", ")}</p>`;
      }
      entry += `<hr>`;

      // Append to the outputDiv as each request completes
      outputDiv.innerHTML += entry;
    } catch (error) {
      console.error("Error sending request:", error);
      outputDiv.innerHTML += `<p style="color: red;"><b>Error fetching data for IDAP ${item}</b></p><hr>`;
    }
  }
};
