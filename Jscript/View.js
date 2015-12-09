var canvas = document.getElementById("Placeholder");
var canvasContext = canvas.getContext("2d");

/** View is responsible for the visual aspects of the game and the interactivity within it.
*@constructor
*@property {Draw} _Minion
*@property {Draw} _UI
*@property {Draw} _Background
*/
function View()
{
    this._rectsMenu = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "play", s: "Lobby"},//Play game
                      {x: canvas.width/2 - 75, y: canvas.height/2 + 200, w: 150, h: 50, t: "google", s: "Sign In"},//Google play
                      {x: canvas.width/2 + 50, y: canvas.height/2 + 100, w: 150, h: 50, t: "leaderboards", s: "Leaderboards"}];//Leaderboards
    this._rectsMinionsLocal = [{x: canvas.width/2 - 75, y: canvas.height - 125, w: 50, h: 50, t: "firstLS", m: null},
                              {x: canvas.width/2 - 25, y: canvas.height - 125, w: 50, h: 50, t: "secondLS", m: null},
                              {x: canvas.width/2 + 25, y: canvas.height - 125, w: 50, h: 50, t: "thirdLS", m: null}];
    this._rectsMinionSelection = [{x: canvas.width/2 - 60, y: canvas.height - 165, w: 35, h: 35, t: "firstM", m: 0},
                                 {x: canvas.width/2 - 10, y: canvas.height - 165, w: 35, h: 35, t: "secondM", m: 1},
                                 {x: canvas.width/2 + 40, y: canvas.height - 165, w: 35, h: 35, t: "thirdM", m: 2}];
    this._rectsLobby = [{x: canvas.width/2 - 200, y: canvas.height/2 + 100, w: 150, h: 50, t: "create", s: "Create game"},
                       {x: 10, y: canvas.height - 60, w: 150, h: 50, t: "menu", s: "Menu"}];
    this._rectsGame = [{x: canvas.width - 150, y: 0, w: 150, h: 50, t: "lobby", c: "white"},
                      {x: canvas.width/2 - 75, y: canvas.height - 70, w: 150, h: 50, t: "send", c: "white"}];
    this._rectsLeaderboards = [{x: 10, y: canvas.height - 60, w: 150, h: 50, t: "menu", s: "Menu"}];
    this._rectsFriendsList;
    this._rectsGamesList;
    this._rectsLeaderboardsList;
    
    this._bHasGames = false;
    
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
    
    this.createRectsLeaderboards = function(lenght)
    {
        view._rectsLeaderboardsList = new Array(lenght);
        for(var i = 0; i < lenght; i++)
        {
            var places = gameController.leaderboard[i];
            this._rectsLeaderboardsList[i] = {x: 100, y: 100 + i * 100, w: 500, h: 50, s: places.scoreValue, f: places.formattedScoreRank, p: places.player.displayName};
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
        if(playerController._left.getWins() > 0)
        {
            canvasContext.fillText("Won", 120, 200);
        }
        canvasContext.fillStyle = "red";
        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
        if(playerController._right.getWins() > 0)
        {
            canvasContext.fillText("Won", canvas.width - 120, 200);
        }
        
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
        
        //Win chart
        
        canvasContext.drawImage(winChartImage, 200, canvas.height - 150);
        
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
//        canvasContext.font = "20px Arial";
//        canvasContext.textAlign = "center";
//        canvasContext.fillStyle = "black";
//        canvasContext.fillText(playerController._left.getName(), 100, 180);
//        canvasContext.fillText(playerController._right.getName(), canvas.width - 100, 180);
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
    
    this._drawMenuScreen = function()
    {
        //Buttons
        for (var i = 0, len = this._rectsMenu.length; i < len; i++) 
        {
            var rect = this._rectsMenu[i];
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            if(!bIsLogged && rect.t == "play")
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
        
//        canvasContext.font = "20px Arial";
//        canvasContext.textAlign = "center";
//        canvasContext.fillStyle = "white";
//        canvasContext.fillText("Sign In", canvas.width/2, canvas.height/2 + 230, 150);
//        canvasContext.fillText("Leaderboards", canvas.width/2 + 125, canvas.height/2 + 130, 150);
//        if(!bIsLogged)
//            canvasContext.fillStyle = "gray";
//        canvasContext.fillText("Play game", canvas.width/2 - 125, canvas.height/2 + 130, 150);
        
        
        //Title
        canvasContext.font = "50px Arial";
        canvasContext.fillStyle = "blue";
        canvasContext.fillText("Minion", canvas.width/2 - 80, canvas.height/2 - 130, 150);
        canvasContext.fillStyle = "red";
        canvasContext.fillText("Wars", canvas.width/2 + 80, canvas.height/2 - 130, 150);
    }
    
    this._drawFriendsList = function()
    {
        canvasContext.fillStyle = "black";
        canvasContext.fillText("Friends", this._rectsFriendsList[0].x + 75, this._rectsFriendsList[0].y - 10, 150);
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
        canvasContext.fillStyle = "black";
        canvasContext.fillText("Games", this._rectsGamesList[0].x + 75, this._rectsGamesList[0].y - 10, 150);
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
        for(var i = 0; i < this._rectsLobby.length; i++)
        {
            var rect = this._rectsLobby[i];
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            if(gameController.playerToInvite == null && rect.t == "create")
                canvasContext.fillStyle = "gray";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
//        var rect = this._rectsLobby[0];
//        
//        canvasContext.font = "20px Arial";
//        canvasContext.textAlign = "center";
//        canvasContext.fillStyle = "white";
//        if(gameController.playerToInvite == null)
//            canvasContext.fillStyle = "gray";
//        canvasContext.fillText("Create game", rect.x + 75, rect.y + 30, 150);
    }
    
    this._drawLeaderboards = function()
    {
        for(var i = 0; i < this._rectsLeaderboards.length; i++)
        {
            var rect = this._rectsLeaderboards[i];            
            canvasContext.fillStyle = "black";
            canvasContext.fillRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "center";
            canvasContext.fillStyle = "white";
            canvasContext.fillText(rect.s, rect.x + 75, rect.y + 30, rect.w);
        }
    }
    
    this._drawLeaderboardsList = function()
    {
        for(var i = 0; i < this._rectsLeaderboardsList.length; i++)
        {
            var rect = this._rectsLeaderboardsList[i];
            canvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h);
            
            canvasContext.font = "20px Arial";
            canvasContext.textAlign = "left";
            canvasContext.fillStyle = "black";
            canvasContext.fillText(rect.f, rect.x + 10, rect.y + 30, 50);
            canvasContext.fillText(rect.p, rect.x + 80, rect.y + 30, 150);
            canvasContext.fillText(rect.s, rect.x + 250, rect.y + 30, 50);
        }
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
        
        if(gameController.gameState == "menu")
        {
            view._drawBackground();
            view._drawMenuScreen();
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
            view._drawLeaderboards();
            if(gameController.leaderboard != null)
            {
                view.createRectsLeaderboards(gameController.leaderboard.length);
                view._drawLeaderboardsList();
            }
            view._drawBackToMenu();
        }
        
        requestAnimationFrame(view.update);
    }
}


