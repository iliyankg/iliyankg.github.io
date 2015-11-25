var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var scope = 'https://www.googleapis.com/auth/games'; //Unused

handleAuthResult = function(auth)
{
    if(auth && !auth.error)
    {
        gapi.client.load('games', 'v1', function(response)
        {
            console.log("LoginSuccess");
            console.log(gapi.client);
        });
        
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




