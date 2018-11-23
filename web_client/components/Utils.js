
var Config = require('Config');

export default function get_data(url, token){
  if(token){
    return fetch(Config.serverUrl + url,{
			headers:{
				'Authorization': 'Token ' + localStorage.getItem('token'),
			}
		})
  }
  else{
    return fetch(Config.serverUrl + url)
  }
}