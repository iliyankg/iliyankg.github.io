/** Player Model
*@constructor
*@property {int} _iHealth health value of the player's castle
*@property {Array int} _iChoice minion types chosen by the player
*@property {int} _iAttack attack value of the player's castle
*@property {int} _iWins number of wins in the game (2 wins means this player won)
*@property {string} _sName name of the player
*@property {bool} _bTeam local/remote player
*/
function Player()
{
    //PRIVATE
    this._iHealth;
    this._iChoice = new Array(3);
    this._iAttack;
    this._iWins;
    this._sName;
    this._bTeam;
    
    this.createPlayer = function(iHealth, iAttack, sName, bTeam)
    {
        this._iHealth = iHealth;
        this._iAttack = iAttack;
        this.setName(sName);
        this._bTeam = bTeam;
        this._iWins = 0;
    }
    
    /** Returns the name of the player
    *@return {String}
    */
    this.getName = function()
    {
        return this._sName;
    }
    /** Sets the name of the player
    *@param {String} sPlayerName New name
    */
    this.setName = function(sPlayerName)
    {
        this._sName = sPlayerName;   
    }
    
    /** Returns the choice of the player
    *@returns {Array (Int)}
    */
    this.getChoice = function()
    {
        return this._iChoice;    
    }
    /** Sets the choice of the player for the minion type
    *@param {int} choice1 First unit type
    *@param {int} choice2 Second unit type
    *@param {int} choice3 Third unit type
    */
    this.setChoice = function(choice1, choice2, choice3)
    {
        this._iChoice[0] = choice1;
        this._iChoice[1] = choice2;
        this._iChoice[2] = choice3;
    }
    
    /** Returns the number of wins this game
    *@return {int}
    */
    this.getWins = function()
    {
        return this._iWins;
    }
    /** Resets the number of wins to 0
    *@function
    */
    this.resetWins = function()
    {
        this._iWins = 0;
    }
    /** Adds a win to the player
    *@function
    */
    this.won = function()
    {
        this._iWins++;
    }
    
}