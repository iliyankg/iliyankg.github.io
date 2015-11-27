//PUBLIC
var battlefield = new Array(20);//Array to be filled with minions; Can change the size;
var playerController = new PlayerController();//Instance of the PlayerController
var view = new View();
var gameController = new GameController();

var leftPlatoon = new Array(3);
var rightPlatoon = new Array(3);
var platoonLength = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("click", click, false);
view.update();



function GameController() 
//Public
{
    this.gameState = "menu"
    
    //PRIVATE
    this._iSpawnNum;//Number of spawns so far
    this._iTurnNum = 0;//Number of turns so far
    this._iBlueFirst = 0;
    
    /*this._turn = function(leftType, rightType)
    {
        // 5 turns per side 
        int this._turnNum(i = 0; i < 5; i++);  
        {
            this._leftType = this._advanceRight();
        }
        int this._turnNum(j = 0; j < 5; j++);
        {
            this._rightType = this.advanceLeft();
        }
    }
    */
    
    /** Facilitates the combat between the frontmost minions.
    *@function
    */
    this._battle = function()
    {
        console.log(this._iBlueFirst);
        if(battlefield[this._iBlueFirst + 1] != null)
        {
            battlefield[this._iBlueFirst].damage(battlefield[this._iBlueFirst + 1].getAttack(), battlefield[this._iBlueFirst + 1].getType());
            battlefield[this._iBlueFirst + 1].damage(battlefield[this._iBlueFirst].getAttack(), battlefield[this._iBlueFirst].getType()); 
            
            if(battlefield[this._iBlueFirst].getHealth() <= 0)
            {
                //battlefield[this._iBlueFirst] = battlefield[this._iBlueFirst + 1];
                battlefield[this._iBlueFirst] = null;
            }
            if(battlefield[this._iBlueFirst + 1].getHealth() <= 0)
            {
                //battlefield[this._iBlueFirst + 1] = battlefield[this._iBlueFirst];
                battlefield[this._iBlueFirst + 1] = null;
            }
        }
        else
        {
            this._iBlueFirst = 0;
        }
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
    
    /** Runs through the battlefield array for minions and makes them advance or battle
    *@function
    */
    this._advance = function()
    {
        var tempBattlefield = [];
        this._iTurnNum++;
        for(i = 0; i < battlefield.length; ++i)
        {
            tempBattlefield[i] = battlefield[i];
        }
        for(var i = 0; i < tempBattlefield.length; i++)
        {
            //Verify is there is a Minion in the "i" position of the array
            if(tempBattlefield[i] != null)
            {
                //Verify the team of the Minion
                if(tempBattlefield[i]._bTeam)
                {
                    //Verify if the Minion is at the edge of the array/map
                    if(this._isTheEdge(i, tempBattlefield[i]))
                    {
                        //this._gameOver(true);
                        break;
                    }
                    else
                    {
                        //Verify if the next space is empty
                        if(battlefield[i + 1] == null)
                        {
                            battlefield[i] = null;
                            battlefield[i + 1] = tempBattlefield[i];
                            battlefield[i + 1].setPosX(battlefield[i + 1].getPosX() + 35);   
                            
                            if(this._iBlueFirst < i + 1)
                            {
                                this._iBlueFirst = i + 1;
                            }
                        }                            
                    }
                }
                else
                {
                    //Verify if the Minion is at the edge of the array/map
                    if(this._isTheEdge(i, tempBattlefield[i]))
                    {
                        //_gameOver(false);
                        break;
                    }
                    else
                    {
                        console.log(battlefield[i-i]);
                        //Verify if the previous space is empty
                        if(battlefield[i - 1] == null)
                        {
                            battlefield[i] = null;
                            battlefield[i - 1] = tempBattlefield[i];
                            battlefield[i - 1].setPosX(battlefield[i - 1].getPosX() - 35);
                        }
                    }
                }
            }
        }
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
    
    /** Verify if the index is at the edge of the array
    *@returns {Bool}
    */
    this._isTheEdge = function(index, minion)
    {
        if(index == battlefield.length - 1 && minion._bTeam)
            return true;
        
        if(index == 0 && !minion._bTeam)
            return true;
        
        return false;
    }
    
    /**Spawns the minions.
    *@function
    */
    this._spawn = function()
    {
        battlefield[0] = new Minion();
        battlefield[0].createMinion(1, true, 100, 240);
        
        battlefield[battlefield.length - 1] = new Minion()
        battlefield[battlefield.length - 1].createMinion(2, false, canvasContext.canvas.width - 135, 240);
        console.log(battlefield[0]);
    }
    
    /**Spawns the minions according to the new combat system.
    *@function
    */
    this._newSpawn = function()
    {
        for(var i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i] = new Minion();  
            leftPlatoon[i].createMinion((Math.floor((Math.random() * (2 - 0 + 1)) + 0)), true,170 - i * 35, 240);
        }
        for(var i = 0; i < platoonLength; i++)
        {
            rightPlatoon[i] = new Minion();  
            rightPlatoon[i].createMinion((Math.floor((Math.random() * (2 - 0 + 1)) + 0)), false, canvasContext.canvas.width - 205 + i * 35, 240);
        }
    }
    
    /*this._gameOver(int leftFortress, int rightFortress)
    {
        if(this._rightMinion = this._leftFortress);
        {
            this._gameOver;
            bool this.rightTeamWin;
        }
        else
        {
            if(this._leftMinion = this._rightFortress);
            this._gameOver;
            bool this.LeftTeamWin;
        }
    }
    */
    
    this._timer_ChangeTime = function()
    {        
        if(gameController._iTurnNum == 10)
        {
            gameController._iTurnNum = 0;
        }
        
        if(gameController._iTurnNum == 0)
        {
            
            //gameController._timer();
            gameController._newSpawn();    
        }
        else if(gameController._iTurnNum == 5)
        {
            gameController._newBattle();
        }
        else if(gameController._iTurnNum > 5)
        {
            gameController._newRetreat();
        }
        else
        {
            gameController._newAdvance();
        }
        
        //gameController._advance();
        gameController._iTurnNum++;
    }
    this._timer_TimeoutAdvance = function(timer)
    {
        clearInterval(timer);
        gameController._newSpawn();
    }
    this._timer_TimeoutRetreat
    
    this._timer = function()
    {
        var timerInt = setInterval(this._timer_ChangeTime, 1000);
        //var timerTime = setTimeout(gameController._timer_TimeoutFunc, 5000, timerInt);
    }
    
    this.startGame = function()
    {
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
        
        gameController._timer();
    }
}

function keyDownHandler(e)
{
    if(e.keyCode == 39)//right arrow
    {
        gameController._newSpawn();
    }
    
    if(e.keyCode == 37)//left arrow
    {
        for(i = 0; i < platoonLength; i++)
        {
            leftPlatoon[i] = null;
            rightPlatoon[i] = null; 
        }
        playerController._left = new Player();
        playerController._left.createPlayer(10,10,"Local_Player", 0);
        playerController._right = new Player();
        playerController._right.createPlayer(10,10,"Remote_Player", 1);
    }
    
    if(e.keyCode == 38)//up arrow
    {
        if(gameController._iTurnNum == 10)
        {
            gameController._iTurnNum = 0;
        }
        
        if(gameController._iTurnNum == 0)
        {
            
            gameController._timer();
            //gameController._newSpawn();    
        }
        else if(gameController._iTurnNum == 5)
        {
            gameController._newBattle();
        }
        else if(gameController._iTurnNum > 5)
        {
            gameController._newRetreat();
        }
        else
        {
            gameController._newAdvance();
        }
        
        //gameController._advance();
        //gameController._iTurnNum++;
    }
}

function click(e)
{
    if(gameController.gameState == "menu")
    {
        console.log('click: ' + e.offsetX + '/' + e.offsetY);
        var rect = view._collides(view._rects, e.offsetX, e.offsetY);
        if (rect) 
        {
            if(rect.t == "play")
            {
                playerController._recievePlayer();
                gameController.startGame();
            }
            else if(rect.t == "google")
            {
                gapi.auth.signIn();
            }
            console.log('collision: ' + rect.x + '/' + rect.y);
        } 
        else
        {
            //console.log('no collision');
        }
    }
}


        

        
        
            
        
    

