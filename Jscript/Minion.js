/** Minion Model
*@constructor
*@property {double} _dPosX position X of the minion
*@property {double} _dPosY position Y of the minion
*@property {int} _iType minion type
*@property {int} _iHealth health value of the minion
*@property {int} _iAttack attack value of the minion
*@property {int} _iHeight height of the minion sprite
*@property {int} _iWidth width of the minion sprite
*@property {bool} _bTeam if the minion belongs to the local or remote player
*@property {bool} _bDead if the minion is dead or not
*@property {view} _view stores the minion sprite
*/
var bIsReadyToDraw = false;
var minionViews = [];
var loadedSoFar = 0;

function Minion()
{
    this._dPosX;
    this._dPoxY;
    this._iType;
    this._iHealth = 20;
    this._iAttack = 10;
    this._iHeight = 35;
    this._iWidth = 35;
    this._bTeam;
    this._bDead;
    this._view = new Image();
    
    this.createMinion = function(iType, bTeam, dPosX, dPosY)
    {
        this._iType = iType;
        this._bTeam = bTeam;
        this._dPosX = dPosX;
        this._dPosY = dPosY;
        this._bDead = false;
    }
    
    this.getViewIndex = function()
    {
        var index;
        if(this._bTeam)
        {
            index = this._iType;
        }
        else
        {
            index = this._iType + 3;//Add 3 to the index to get the enemy sprites   
        }
        
        if(gameController._iTurnNum > 6)
        {
            return index + 6;//Units are retreating
        }
        return index;
    }
    
    this.loadMinions = function()
    {
        for(var k=0; k <=1; k++)
        { 
            for(var i=0; i <= 1; i++)
             {
                for(var j=0; j <=2; j++)
                {
                    minionViews[k*6 + i*3 + j] = new Image();
                    minionViews[k*6 + i*3 + j].onload = function() 
                    {
                        loadedSoFar++;
                        if(loadedSoFar == 6)
                        {
                            bIsReadyToDraw = true;
                        }
                    };
                    minionViews[k*6 + i*3 + j].src = "Assets/Minion_"+ k + i + j + ".png";
                }
             }
        }
    }
    
    this.getPosX = function()
    {
        return this._dPosX;
    }
    this.setPosX = function(dPosX)
    {
        this._dPosX = dPosX;
    }
    
    this.getPosY = function()
    {
        return this._dPosY;
    }
    this.setPosY = function(dPosY)
    {
        this._dPosY = dPosY;
    }
    
    this.getType = function()
    {
        return this._iType;
    }
    
    this.getAttack = function()
    {
        return this._iAttack;
    }
    
    this.getHealth = function()
    {
        return this._iHealth;
    }
    /** Damages the minion taking into account the type attacking it
    *@function
    *@param {int} type
    */
    this.damage = function(type)
    {
        if(this._iType - type == 1 || this._iType - type == -2)
        {
            this._bDead = true;    
        }
        else
        {
            this._bDead = false;    
        }
    }
    
    /** Returns the status of the minion
    *@function
    */
    this.isDead = function()
    {
        return this._bDead;
    }
}
