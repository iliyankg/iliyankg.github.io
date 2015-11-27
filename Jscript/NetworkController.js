var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var scope = 'https://www.googleapis.com/auth/games'; //Unused

handleAuthResult = function(auth)
{
    if(auth && !auth.error)
    {
        console.log("LoginSuccess");
        console.log(auth);
        gapi.client.load('games', 'v1', function(response)
        {
            console.log("Games Loaded");
            
        });
        
        gapi.client.load('plus', 'v1', function(response)
        {
            var request = gapi.client.plus.people.get(
            {
                'userId' : 'me'                
            });
                        
            request.execute(function(resp)
                           {
                console.log("Display Name: \n")
                console.log(resp.displayName);
            })
        });
        
        
        console.log(gapi.client);
    }
    else
    {
        console.log("LoginError");
    }
}

handleClientLoad = function()
{
    gapi.client.setApiKey(apiKey);
    //window.setTimeout(checkAuth, 1);
}

_getLocalPlayerName = function()
{
    
        gapi.client.load('plus', 'v1', function(response)
        {
            var request = gapi.client.plus.people.get(
            {
                'userId' : 'me'                
            });
                        
            request.execute(function(resp)
            {
                return resp.displayName;
            })
        });
}




