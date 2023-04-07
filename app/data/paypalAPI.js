const url = 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
const clientId = 'ASWgptaJ7XcbrfeGyHMdxWimT7EKERTpy7VHZP6wB2eYk8Pkop5cbU9-F6cNvtkq-_3B-7scpDsOogv_';
const secret = 'EDhVIGqszHffdah6hNXAV94ErhaignMJp3te8W4Mn4FBSYrBmJrfbN1EW7pWub2bPARFugTh1-bT6PnN';
const transactionURL = 'https://api-m.sandbox.paypal.com/v1/reporting/transactions?start_date=2023-04-05T00:00:00-0700&end_date=2023-04-05T23:59:59-0700'

export async function paypalGetAccessToken(){
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(clientId + ':' + secret)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    };
    
    try {
        const response = await fetch(url, options);
        if(!response.ok){
            const error = await response.json();
            console.log(error);
            throw new Error(error)
        }
        return response.json();
    } catch (error) {
        alert(error.message)
    }
    
}

export async function getTransactions(){
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await paypalGetAccessToken()).access_token}`
          }
      };
      
      try {
          const response = await fetch(transactionURL, options);
          if(!response.ok){
              const error = await response.json();
              console.log(error);
              throw new Error(error)
          }
          return response.json();
      } catch (error) {
          alert(error.message)
      }
}


