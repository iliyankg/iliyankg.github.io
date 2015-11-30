var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';

handleAuthResult = function(auth)
{
    //Successfull login
    if(auth && !auth.error)
    {
        console.log("LoginSuccess");
        console.log(auth);
        gapi.client.load('games', 'v1', function(response)
        {
            console.log("Games Loaded");
            console.log(gapi.client.games.turnBasedMatches);
        });
        
        gapi.client.load('plus', 'v1', function(response)
        {
            console.log("Plus loaded");
        });
        bIsLogged = true;
    }
    //Bad login
    else
    {
        
    }
}