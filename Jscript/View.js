var canvas = document.getElementById("Placeholder");
var canvasContext = canvas.getContext("2d");

var gameWidth = 960;
var gameHeight = 540;

var currentWidth = gameWidth;
var currentHeight = gameHeight;

canvas.width = gameWidth;
canvas.height = gameHeight;

/** View is responsible for the visual aspects of the game and the interactivity within it.
*@constructor
*@property {Draw} _Minion
*@property {Draw} _UI
*@property {Draw} _Background
*/
function View()
{
    this._fAspect =currentWidth / gameWidth;
    
    this._rectsMenu = [{x: currentWidth/2 - 200 * this._fAspect, y: currentHeight/2 + 100 * this._fAspect, w: 150, h: 50, t: "play"},//Play game
                   {x: currentWidth/2, y: canvas.height/2 + 100, w: 150, h: 50, t: "google"}];//Google play
    this._rectsMinionsLocal = [{x: canvas.width/2 - 75, y: canvas.height - 125, w: 50, h: 50, t: "firstLS", m: null},
                              {x: canvas.width/2 - 25, y: canvas.height - 125, w: 50, h: 50, t: "secondLS", m: null},
                              {x: canvas.width/2 + 25, y: canvas.height - 125, w: 50, h: 50, t: "thirdLS", m: null}];
    this._rectsMinionSelection = [{x: canvas.width/2 - 60, y: canvas.height - 165, w: 35, h: 35, t: "firstM", m: 0},
                                 {x: canvas.width/2 - 10, y: canvas.height - 165, w: 35, h: 35, t: "secondM", m: 1},
                                 {x: canvas.width/2 + 40, y: canvas.height - 165, w: 35, h: 35, t: "thirdM", m: 2}];
    this._rectsLobby = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "create"}];
    this._rectsGame = [{x: canvas.width - 150, y: 0, w: 150, h: 50, t: "lobby", c: "white"},
                      {x: canvas.width/2 - 75, y: canvas.height - 70, w: 150, h: 50, t: "send", c: "white"}];
    this._rectsFriendsList;
    this._rectsGamesList;
    
    this._bHasGames = false;
    
    this._resize = function()
    {
        var ratio =  gameHeight / gameWidth;
    
        currentWidth = window.innerWidth;
        currentHeight = ratio * currentWidth;

        canvas.style.width = currentWidth + 'px';
        canvas.style.height = currentHeight + 'px';

        // we use a timeout here because some mobile
            // browsers don't fire if there is not
            // a short delay
            window.setTimeout(function() {
                    window.scrollTo(0,1);
            }, 1);
        
        this._fAspect =currentWidth / gameWidth;
    
    }

    this._resizeRects = function()
    {
        this._rectsMenu = [{x: currentWidth/2 - 200 * this._fAspect, y: currentHeight/2 + 100 * this._fAspect, w: 150 * this._fAspect, h: 50 * this._fAspect, t: "play"},//Play game
                          {x: currentWidth/2, y: canvas.height/2 + 100, w: 150, h: 50, t: "google"}];//Google play
        this._rectsMinionsLocal = [{x: canvas.width/2 - 75, y: canvas.height - 125, w: 50, h: 50, t: "firstLS", m: null},
                                  {x: canvas.width/2 - 25, y: canvas.height - 125, w: 50, h: 50, t: "secondLS", m: null},
                                  {x: canvas.width/2 + 25, y: canvas.height - 125, w: 50, h: 50, t: "thirdLS", m: null}];
        this._rectsMinionSelection = [{x: canvas.width/2 - 60, y: canvas.height - 165, w: 35, h: 35, t: "firstM", m: 0},
                                     {x: canvas.width/2 - 10, y: canvas.height - 165, w: 35, h: 35, t: "secondM", m: 1},
                                     {x: canvas.width/2 + 40, y: canvas.height - 165, w: 35, h: 35, t: "thirdM", m: 2}];
        this._rectsLobby = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "create"}];
        this._rectsGame = [{x: canvas.width - 150, y: 0, w: 150, h: 50, t: "lobby", c: "white"},
                          {x: canvas.width/2 - 75, y: canvas.height - 70, w: 150, h: 50, t: "send", c: "white"}];
        //this.createRectsGames();
        this.createRectsFriends();
    }
    
    this.createRectsFriends = function(lenght)
    {
        view._rectsFriendsList = new Array(lenght);
        for(var i = 0; i < lenght; i++)
        {
            this._rectsFriendsList[i] = {x: canvas.width - 200, y: 50 + i * 50, w: 150, h:50, t: "friend", f: friends[i], c: "black"};
        }
    }
    
    this.resetRectsFriendsColor = function()
    {
        for(var i = 0; i < view._rectsFriendsList.length; i++)
        {
            view._rectsFriendsList[i].c = "black";
        }
    }
    
    this.createRectsGames = function(lenght)
    {
        this._bHasGames = false;
        if(allGames != null)
        {
            this._rectsGamesList = new Array(lenght);
            for(var i = 0; i < lenght; i++)
            {
                this._rectsGamesList[i] = {x: canvas.width - 400, y: 50 + i * 50, w: 150, h:50, t: "games", g: allGames[i]};
                this._bHasGames = true;
            }
        }
    }
    
    this._Minion =  function()
    {
        //Sprites are drawn for the left and right side.
        this._drawMinion;
        this._leftMinionSprite1;
        this._leftMinionSprite2;
        this._leftMinionSprite3;
        this._rightMinionSprite1;
        this._rightMinionSprite2;
        this._rightMinionSprite3;
    }
    
    this._UI = function()
    {
        //UI is drawn
        this._drawUI;
        // a button is pressed which will send the data, retrun and record the choice made by the player.
        this._buttonPress; 
        {
            this._sendChoice;
            this._returnChoice;
            this._reccordPlayerChoice;
            this._resolvePlayers;
            this._getLeftChoice;
            this._getRightChoice;
        }
    }
    
    //Background of a match is drawn   
    this._drawBackground = function()
    {
        gameController.loadBackground();
        minion.loadMinions();
        if(bBackDraw)
        {
            canvasContext.drawImage(backgorundImage, 0, 0); 
        }
    }

    this._drawUI = function()
    {
        //Player names
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText(playerController._left.getName(), 100, 180);
        canvasContext.fillStyle = "red";
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
        
        //Timer
        canvasContext.fillStyle = "black";
        canvasContext.fillText(10 - gameController._iTurnNum, canvas.width/2, 400);
        
        //Minion selection
        if(gameController.iMinionSelection != -1)
        {
            for (var i = 0, len = this._rectsMinionSelection.length; i < len; i++) 
            {
                var rect = this._rectsMinionSelection[i];
                canvasContext.drawImage(minionViews[rect.m], rect.x, rect.y);
            }
        }
        
        //Local selection boxes
        for (var i = 0, len = this._rectsMinionsLocal.length; i < len; i++) 
        {
            var local = this._rectsMinionsLocal[i];
            canvasContext.strokeRect(local.x, local.y, local.w, local.h);
            
            if(local.m != null)
            {
                canvasContext.drawImage(minionViews[local.m], local.x + 13, local.y + 7);
            }
            else
            {
                canvasContext.drawImage(plusView, local.x + 7, local.y + 7);
            }
        }
        
        //UI
        for (var i = 0; i < view._rectsGame.length; i++)
        {
            var rect = view._rectsGame[i];
            
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = rect.c;
            if(rect.t == "send" && !gameController.checkUnits() && gameController.bCanMakeTurn)
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.t, rect.x + 75, rect.y + 30);
        }
        
        //Player names
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "black";
        canvasContext.fillText(playerController._left.getName(), 100, 180);
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
    }

    this._drawMinions = function()
    {
        for(var i = 0; i < 20; ++i)
        {
            if(battlefield[i] == null)
            {
                
            }
            else
            {
                battlefield[i].loadMinions();
                if(bIsReadyToDraw)
                {
                    canvasContext.drawImage(minionViews[battlefield[i].getViewIndex()], battlefield[i].getPosX(), battlefield[i].getPosY());
                }
            }
        }
    }
    
    this._newDrawMinions = function()
    {
        for(var i = 0; i < 3; ++i)
        {
            if(leftPlatoon[i] != null)
            {
                leftPlatoon[i].loadMinions();
//                if(bIsReadyToDraw)
//                {
                    canvasContext.drawImage(minionViews[leftPlatoon[i].getViewIndex()], leftPlatoon[i].getPosX(), leftPlatoon[i].getPosY()); 
//                }
            }
            
            if(rightPlatoon[i] != null)
            {
                rightPlatoon[i].loadMinions();
//                if(bIsReadyToDraw)
//                {
                    canvasContext.drawImage(minionViews[rightPlatoon[i].getViewIndex()], rightPlatoon[i].getPosX(), rightPlatoon[i].getPosY());
//                }
            }
        }
    }
    
    this._drawMenuScrren = function()
    {
        canvasContext.fillStyle = "black";
        for (var i = 0, len = this._rectsMenu.length; i < len; i++) 
        {
            canvasContext.fillRect(this._rectsMenu[i].x, this._rectsMenu[i].y, this._rectsMenu[i].w, this._rectsMenu[i].h);
            console.log(this._rectsMenu[i].x);
        }
        
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Sign In", canvas.width/2 + 125, canvas.height/2 + 130, 150);
        if(!bIsLogged)
            canvasContext.fillStyle = "gray";
        canvasContext.fillText("Play game", canvas.width/2 - 125, canvas.height/2 + 130, 150);
        
        canvasContext.font = "50px Arial";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText("Minion", canvas.width/2 - 80, canvas.height/2 - 130, 150);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wars", canvas.width/2 + 80, canvas.height/2 - 130, 150);
        
        canvasContext.fillText(currentWidth + " x " + currentHeight, 50, 50, 100);
    }
    
    this._drawFriendsList = function()
    {
        for(var i = 0; i < friends.length; i++)
        {
            var rect = this._rectsFriendsList[i];
            canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = rect.c;
            canvasContext.fillText(friends[i].displayName, rect.x + 75, rect.y + 30, 150);
        }
    }
    
    this._drawGamesList = function()
    {
        for(var i = 0; i < allGames.length; i++)
        {
            var rect = this._rectsGamesList[i];
            canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "black";
            if(localPlayer.playerId == allGames[i].participants[0].player.playerId)
            {
                canvasContext.fillText(allGames[i].participants[1].player.displayName, rect.x + 75, rect.y + 15, 150);
            }
            else
            {
                canvasContext.fillText(allGames[i].participants[0].player.displayName, rect.x + 75, rect.y + 15, 150);
            }
            canvasContext.fillText(allGames[i].userMatchStatus, rect.x + 75, rect.y + 45, 150);
        }
    }
    
    this._drawLobby = function()
    {
        canvasContext.fillStyle = "black";
        var rect = this._rectsLobby[0];
        canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
        
        canvasContext.font = "20px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "white";
        if(gameController.playerToInvite == null)
            canvasContext.fillStyle = "gray";
        canvasContext.fillText("Create game", rect.x + 75, rect.y + 30, 150);
    }
    
    this._drawLeaderboards = function()
    {
        
    }
    
    this._drawBackToMenu = function()
    {
        
    }
    
    this._collides = function(rects, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects.length; i < len; i++) 
        {
            var left = rects[i].x, right = rects[i].x+rects[i].w;
            var top = rects[i].y, bottom = rects[i].y+rects[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects[i];
            }
        }
        return isCollision;
    }
    this._collides2 = function(rects1, rects2, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects1.length; i < len; i++) 
        {
            var left = rects1[i].x, right = rects1[i].x+rects1[i].w;
            var top = rects1[i].y, bottom = rects1[i].y+rects1[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects1[i];
            }
        }
        
        for (var i = 0, len = rects2.length; i < len; i++) 
        {
            var left = rects2[i].x, right = rects2[i].x+rects2[i].w;
            var top = rects2[i].y, bottom = rects2[i].y+rects2[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects2[i];
            }
        }
        return isCollision;
    }
    this._collides3 = function(rects1, rects2, rects3, x, y)
    {
        var isCollision = false;
        for (var i = 0, len = rects1.length; i < len; i++) 
        {
            var left = rects1[i].x, right = rects1[i].x+rects1[i].w;
            var top = rects1[i].y, bottom = rects1[i].y+rects1[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects1[i];
            }
        }
        
        for (var i = 0, len = rects2.length; i < len; i++) 
        {
            var left = rects2[i].x, right = rects2[i].x+rects2[i].w;
            var top = rects2[i].y, bottom = rects2[i].y+rects2[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects2[i];
            }
        }
        
        for (var i = 0, len = rects3.length; i < len; i++) 
        {
            var left = rects3[i].x, right = rects3[i].x+rects3[i].w;
            var top = rects3[i].y, bottom = rects3[i].y+rects3[i].h;
            
            if (right >= x && left <= x && bottom >= y && top <= y) 
            {
                isCollision = rects3[i];
            }
        }
        return isCollision;
    }
    
    this.update = function()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        
        view._resize();
        view._resizeRects();
        
        if(gameController.gameState == "menu")
        {
            view._drawBackground();
            view._drawMenuScrren();
        }
        else if(gameController.gameState == "lobby")
        {
            view._drawFriendsList();
            if(view._bHasGames)
                view._drawGamesList();
            view._drawBackToMenu();
            view._drawLobby();
        }
        else if(gameController.gameState == "game")
        {
            view._drawBackground();
            if(gameController.bShowTurn)
                view._newDrawMinions();
            view._drawUI();
        }
        else if(gameController.gameState == "leaderboards")
        {
            view._drawLeaderBoards();
            view._drawBackToMenu();
        }
        
        requestAnimationFrame(view.update);
    }
}


