/**
 * Gets the desired element on the client page and clicks on it
 */
 function goToActivityTab() {
    const activityTab = document.getElementsByClassName("btnSuccess")[0];

    const config = { attributes: true, childList: true, subtree: true };
    
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // console.log('A child node has been added or removed.');
            }
            else if (mutation.type === 'attributes') {
                // console.log('The ' + mutation.attributeName + ' attribute was modified.');
              if(mutation.attributeName === 'disabled'){
                if(!activityTab.disabled) {
                  const userToken = JSON.parse(localStorage.getItem('USER_TOKEN'));
                  console.log(userToken)
                  dat_lenh({
                    betAccountType: "DEMO",
                    betAmount: 10,
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
    
    const observer = new MutationObserver(callback);
    
    observer.observe(activityTab, config);
    
}

const dat_lenh = ({betAccountType, betAmount, betType, token}) => {
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
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

goToActivityTab();
