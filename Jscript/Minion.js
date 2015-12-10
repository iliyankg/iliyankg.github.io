/**@fileoverview Minion model. Contains all the data associated with minions.
*@name Minion.js
*@author Gustavo Sanches
*/

var bIsReadyToDraw = false;
var minionViews = [];
var plusView;
var loadedSoFar = 0;

/** Minion Model
*@constructor
*@property {double} _dPosX position X of the minion
*@property {double} _dPosY position Y of the minion
*@property {int} _iType minion type
*@property {int} _iHeight height of the minion sprite
*@property {int} _iWidth width of the minion sprite
*@property {bool} _bTeam if the minion belongs to the local or remote player
*@property {bool} _bDead if the minion is dead or not
*@property {view} _view stores the minion sprite
*/
function Minion()
{
    this._dPosX;
    this._dPoxY;
    this._iType;
    this._iHeight = 35;
    this._iWidth = 35;
    this._bTeam;
    this._bDead;
    this._view = new Image();
    
    /** Creates a minion.
    *@param {int} iType Minion type.
    *@param {bool} bTeam Team the minion belongs to.
    *@param {double} dPosX Horizontal position of the minion.
    *@param {double} dPosY Vertical position of the minion.
    *@return {Minion}
    */
    this.createMinion = function(iType, bTeam, dPosX, dPosY)
    {
        var newMinion = new Minion();
        newMinion._setMinionStats(iType, bTeam, dPosX, dPosY);
        return newMinion;
    }
    
    /** Setter for all minion properties.
    *@param {int} iType Minion type.
    *@param {bool} bTeam Team the minion belongs to.
    *@param {double} dPosX Horizontal position of the minion.
    *@param {double} dPosY Vertical position of the minion.
    */
    this._setMinionStats = function(iType, bTeam, dPosX, dPosY)
    {
        this._iType = iType;
        this._bTeam = bTeam;
        this._dPosX = dPosX;
        this._dPosY = dPosY;
        this._bDead = false;
    }
    
    /**Gets the index of the sprite to be desplayed.
    *@function
    */
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
    
    /**Loads all minion sprites.
    *@function
    */
    this.loadMinions = function()
    {
        plusView = new Image();
        plusView.onload = function()
        {
            loadedSoFar++;
        };
        plusView.src = "Assets/Plus.png";
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
                        if(loadedSoFar == 7)
                        {
                            bIsReadyToDraw = true;
                        }
                    };
                    minionViews[k*6 + i*3 + j].src = "Assets/Minion_"+ k + i + j + ".png";
                }
             }
        }
    }
    /**Gets the horizontal position of the minion.
    *@function
    *@return {doulbe}
    */
    this.getPosX = function()
    {
        return this._dPosX;
    }
    /**Sets the horizontal position of the minion.
    *@param {double} dPosX New horizontal position.
    *@function
    */
    this.setPosX = function(dPosX)
    {
        this._dPosX = dPosX;
    }
    /**Gets the vertical position of the minion.
    *@function
    *@return {doulbe}
    */
    this.getPosY = function()
    {
        return this._dPosY;
    }
    /**Sets the horizontal position of the minion.
    *@param {double} dPosY New vertical position.
    *@function
    */
    this.setPosY = function(dPosY)
    {
        this._dPosY = dPosY;
    }
    
    /**Gets the type of the minion.
    *@function
    *@return {int}
    */
    this.getType = function()
    {
        return this._iType;
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
    *@return {bool}
    */
    this.isDead = function()
    {
        return this._bDead;
    }
}
