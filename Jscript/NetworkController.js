var clientID = '247812372074-s6v0cjlf12q04cm7gbajipmfv1ee9iu8';
var apiKey = 'AIzaSyCCaQb_poHUrGjOjX34w7uZKhpuY_NZOqc';
var scope = 'https://www.googleapis.com/auth/games';

function handleClientLoad()
{
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth, 1);
}

function checkAuth()
{ gapi.auth.authorize({client_id: clientID, scope: scope, immediate: true}, handleAuthResult);
}

  function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          
        } else {
          //gapi.auth.authorize({client_id: clientID, scope: scope, immediate: false}, handleAuthResult);
            gapi.auth.signIn();
        }
      }

checkAuth();
