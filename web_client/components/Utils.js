
var Config = require('Config');

export default function get_data(url, token, method='GET', data=null){
  data = data ? JSON.stringify(data) : data;
  if(token){
    return fetch(Config.serverUrl + url,{
      method: method,
			headers:{
        'Authorization': 'Token ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: data || null
		})
  }
  else{
    return fetch(Config.serverUrl + url)
  }
}
