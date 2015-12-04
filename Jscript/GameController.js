//PUBLIC
var battlefield = new Array(20);//Array to be filled with minions; Can change the size;
var playerController = new PlayerController();//Instance of the PlayerController
var view = new View();
var gameController = new GameController();
var minion = new Minion();
var backgorundImage;
var bBackDraw = false;
var sLocalPlayerName = "Loading...";

var leftPlatoon = new Array(3);
var rightPlatoon = new Array(3);
var platoonLength = 3;
var bIsLogged = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("click", click, false);
view.update();



function GameController() 
//Public
{
    this.gameState = "menu";
    this.iMinionSelection = -1;
    this.playerToInvite = null;
    this.activeMatch = null;
    
    
    //PRIVATE
    this._iSpawnNum;//Number of spawns so far
    this._iTurnNum = 1;//Number of turns so far
    this._iBlueFirst = 0;
    this._fLobbyTimer = 0;
    
    this.loadBackground = function()
    {
        backgorundImage = new Image();
        backgorundImage.onload = function() 
        {
                bBackDraw = true;
        };
        backgorundImage.src = "Assets/Background.png";
    }
    
    /** Facilitates the combat between the frontmost minions.
    *@function
    */
    this._newBattle = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i].damage(rightPlatoon[i].getType());
            rightPlatoon[i].damage(leftPlatoon[i].getType());
            
            if(leftPlatoon[i].isDead())
            {
                leftPlatoon[i] = null;
            }
            
            if(rightPlatoon[i].isDead())
            {
                rightPlatoon[i] = null;
            }
        }
        
        //Check how many minions each side has left
        var leftMinions = 0;//Number of minions on the left side that survived
        var rightMinions = 0;//Number of minions on the right side that survived
        
        for(var i = 0; i < platoonLength; i++)
        {
            if(leftPlatoon[i] != null)
            {
                leftMinions++;
            }
            
            if(rightPlatoon[i] != null)
            {
                rightMinions++;
            }
        }
        
        
        if(leftMinions > rightMinions)
        {
            playerController._left.won();
        }
        else if(rightMinions > leftMinions)
        {
            playerController._right.won();
        }
        
        this._checkWinner();
        
        this._clearPlatoons();
    }
    
    /** Checks for winners and reset the win counter if necessary
    *@function
    */
    this._checkWinner = function()
    {
        if(playerController._left.getWins() == 2)
        {
            //Local player wins
            console.log("Local player won");
        }
        else if(playerController._right.getWins() == 2)
        {
            //Remote player wins
            console.log("Remote player won");
        }
        
        if(playerController._left.getWins() == playerController._right.getWins())
        {
            playerController._left.resetWins();
            playerController._right.resetWins();
        }
    }
    
    this._clearPlatoons = function()
    {
        for(var i = 0; i < 3; i++)
        {
//            view._rectsMinionsLocal[i].m = null;
//            view._rectsMinionsRemote[i].m = null;
        }
        this.iMinionSelection = 0;
    }
    
    /** Runs through the battlefield array for minions and makes them advance or battle
    *@function
    */
    this._newAdvance = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i].setPosX(leftPlatoon[i].getPosX() + 60);
            rightPlatoon[i].setPosX(rightPlatoon[i].getPosX() - 60);
        }
    }
    
    /** Used in the new combat model system to return the minions once the battle has finished.
    *@function
    */
    this._newRetreat = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(leftPlatoon[i] != null)
            {
                leftPlatoon[i].setPosX(leftPlatoon[i].getPosX() - 60);
            }
            
            if(rightPlatoon[i] != null)
            {
                rightPlatoon[i].setPosX(rightPlatoon[i].getPosX() + 60);
            }
        }
    }
    
    /**Spawns the minions according to the new combat system.
    *@function
    */
    this._newSpawn = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(view._rectsMinionsLocal[i].m == null)
            {
                leftPlatoon[i] = new Minion();
                var iMinionType = (Math.floor((Math.random() * (2 - 0 + 1)) + 0));
                leftPlatoon[i].createMinion(iMinionType, true,170 - i * 35, 240);
                view._rectsMinionsLocal[i].m = iMinionType;
            }
            else
            {
                leftPlatoon[i] = new Minion();
                leftPlatoon[i].createMinion(view._rectsMinionsLocal[i].m, true,170 - i * 35, 240);
            }
        }
        for(var i = 0; i < platoonLength; i++)
        {
            rightPlatoon[i] = new Minion();  
            var iMinionType = (Math.floor((Math.random() * (2 - 0 + 1)) + 0));
            rightPlatoon[i].createMinion(iMinionType, false, canvasContext.canvas.width - 205 + i * 35, 240);
            view._rectsMinionsRemote[i].m = iMinionType + 3;
        }
    }
    
    this._timer_RefreshList = function()
    {        
        listActiveGames();
    }
    this._timer_Timeout = function(timer)
    {
        clearInterval(timer);
    }
    this._timer = function(timer, interval)
    {
        timer = setInterval(this._timer_RefreshList, interval);
    }
    
    this._firstTurn = function()
    {
        if(gameController._iTurnNum == 10)
        {
            gameController._iTurnNum = 0;
            gameController._newSpawn();
            clearInterval(gameController._fFirstTimer);
            gameController._timer();
        }
        gameController._iTurnNum++;
    }
    
    this.startGame = function()
    {
        minion.loadMinions();
        gameController._timer_Timeout(gameController._fLobbyTimer);
        this.gameState = "game";
        for(i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i] = null;
            rightPlatoon[i] = null; 
        }
        playerController._left = new Player();
        playerController._left.createPlayer(10,10,"Local_Player", 0);
        playerController._right = new Player();
        playerController._right.createPlayer(10,10,"Remote_Player", 1);
        
        //gameController._timer();
        //gameController._fFirstTimer = setInterval(this._firstTurn, 1000);
        
    }
    
    this._joinGame = function(game)
    {
        if(game.userMatchStatus == "USER_TURN")
        {
            this.startGame();
        }
        else
        {
            //get the player platoon choice and show on screen
        }
    }
    
    this.populateMatch = function()
    {
        
        
        playerController._left.createPlayer(10, 10, sLocalPlayerName, 0);
        for(var i = 0; i < 2; i++)
        {
            var sName = gameController.activeMatch.participants[i].player.displayName;
            if(sName != sLocalPlayerName)
            {
                playerController._right.createPlayer(10, 10, sName, 1);
            }
        }
        console.log(this.activeMatch.userMatchStatus);
        
        if(this.activeMatch.userMatchStatus != "USER_AWAITING_TURN")
        {
            if(gameController.activeMatch.matchVersion != 1)
            {
                console.log(atob(gameController.activeMatch.data.data));
            }
        }
    }
    
    this.resetGameState = function()
    {
        gameController.iMinionSelection = -1;
        for(var i = 0; i < 3; i++)
        {
            view._rectsMinionsLocal[i].m = null;
        }
        playerController._left.setName(null);
        playerController._right.setName(null);
    }
    
    this.checkUnits = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            if(view._rectsMinionsLocal[i].m == null)
            {
                return false;
            }
        }
        return true;
    }
    
    this.goToLobby = function()
    {
        this.resetGameState();
        this.gameState = "lobby";
        this.activeMatch = null;
        listActiveGames();
        minion.loadMinions();
        gameController._timer(gameController._fLobbyTimer, 10000);
    }
}

function keyDownHandler(e)
{
    if(e.keyCode == 39)//right arrow
    {
        initiateData();
    }
    
    if(e.keyCode == 37)//left arrow
    {
        cancelGame(0);
    }
    
    if(e.keyCode == 38)//up arrow
    {
        takeTurn(0);

    }
    if(e.keyCode == 40) //down arrow
    {
        //joinGame(0);
        listActiveGames();
    }
    if(e.keyCode == 32) //spacebar
    {
        getGame(gameController.activeMatch.matchId);
    }
}

function click(e)
{
    if(gameController.gameState == "menu")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rect = view._collides(view._rectsMenu, e.offsetX, e.offsetY);
        if (rect) 
        {
            if(rect.t == "play" && bIsLogged)
            {
                gameController.goToLobby();
            }
            else if(rect.t == "google")
            {
               gapi.auth.signIn();
            }
            console.log('collision: ' + rect.x + '/' + rect.y);
        }
    }
    else if(gameController.gameState == "lobby")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rect = view._collides3(view._rectsFriendsList, view._rectsLobby, view._rectsGamesList, e.offsetX, e.offsetY);
        if (rect) 
        {
            if(rect.t == "create" && gameController.playerToInvite != null)
            {
                createJoinGame();
                console.log("Player ID: " + gameController.playerToInvite);
                gameController.gameState = "game";
                //gameController.startGame();
            }
            else if(rect.t == "friend")
            {
                console.log(rect.f.displayName);
                console.log(rect.f.id);
                view.resetRectsFriendsColor();
                rect.c = "green";
                gameController.playerToInvite = rect.f.id;
            }
            else if(rect.t == "games")
            {
                console.log(rect.g);
                if(rect.g.userMatchStatus == "USER_INVITED")
                {
                    joinGame(rect.g.matchId);
                    gameController.gameState = "game";
                }
                else if(rect.g.userMatchStatus == "USER_AWAITING_TURN")
                {
                    getGame(rect.g.matchId);
                    gameController.gameState = "game";
                }
                else if(rect.g.userMatchStatus == "USER_TURN")
                {
                    getGame(rect.g.matchId);
                    gameController.gameState = "game";
                }
            }
            console.log('collision: ' + rect.x + '/' + rect.y + ' type: ' + rect.t);
        }
    }
    else if(gameController.gameState == "game")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rectM = view._collides(view._rectsMinionSelection, e.offsetX, e.offsetY);
        var rectL = view._collides(view._rectsMinionsLocal, e.offsetX, e.offsetY);
        var rect = view._collides(view._rectsGame, e.offsetX, e.offsetY);
        
        if(rectM && gameController.iMinionSelection != -1)
        {
            if(rectM.t == "firstM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 0;
            }
            else if(rectM.t == "secondM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 1;
            }
            else if(rectM.t == "thirdM")
            {
                view._rectsMinionsLocal[gameController.iMinionSelection].m = 2;
            }
            gameController.iMinionSelection = -1;
        }
        else if(rectL)
        {
            if(rectL.t == "firstLS")
            {
                gameController.iMinionSelection = 0;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
            else if(rectL.t == "secondLS")
            {   
                gameController.iMinionSelection = 1;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
            else if(rectL.t == "thirdLS")
            {
                gameController.iMinionSelection = 2;
                view._rectsMinionsLocal[gameController.iMinionSelection].m = null;
            }
        }
        else if(rect)
        {
            if(rect.t == "lobby")
            {
                gameController.goToLobby();
                //Do something to "cancel" the game
            }
            else if(rect.t == "send" && playerController._left.getName() != null && gameController.checkUnits())
            {
                //POST the data
                //Where to get the choices:
                //view._rectsMinionsLocal[0-2].m
                var chosenTurn = view._rectsMinionsLocal[0].m.toString() + view._rectsMinionsLocal[1].m.toString() + view._rectsMinionsLocal[2].m.toString(); 
                takeTurn(chosenTurn, 0, 0);
            }
        }
    }
}


        

        
        
            
        
    

 