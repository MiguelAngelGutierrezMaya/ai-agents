const Agent = require('../core/Agent');

/**
 * Simple reflex agent. Search for an object whithin a labyrinth. 
 * If the object is found the agen take it.
 */
class RatonAgent2 extends Agent {
    constructor(value) {
        super(value);
        //LEFT, UP, RIGHT, DOWN, CELL
        this.table = {
            "0,0,0,0,0": "UP",
            "0,0,0,1,0": "UP",
            "0,0,1,0,0": "UP",
            "0,0,1,1,0": "LEFT",
            "0,1,0,0,0": "LEFT",
            "0,1,0,1,0": "RIGHT",
            "0,1,1,0,0": "LEFT",
            "0,1,1,1,0": "LEFT",
            "1,0,0,0,0": "UP",
            "1,0,0,1,0": "RIGHT",
            "1,0,1,0,0": "DOWN",
            "1,0,1,1,0": "UP",
            "1,1,0,0,0": "RIGHT",
            "1,1,0,1,0": "RIGHT",
            "1,1,1,0,0": "DOWN",
            "default": "TAKE"
        };

        this.bigNumber=20;
        this.model = [];
        this.currentPosition={};
        this.actions = ["LEFT", "UP", "RIGHT", "DOWN"]

    }


    setup(state0){
        for(let i=0;i<this.bigNumber;i++){
            this.model.push([]);
            for(let j=0; j<this.bigNumber;j++){
                this.model[i][j]=0;
            }
        }
        this.currentPosition = {...state0};
    }

     /**
     * 
     * @param {*} number 
     * This function gets the available position based on array ordered [LEFT, UP, RIGHT, DOWN] with the code received
     */
    getAvailablePosition(number) {
        return this.actions[number]
    }

    updateModel(){
        
        let left = 0, right = 0, up = 0, down = 0
        if (this.currentPosition.y > 0) {
            up = this.currentPosition.y - 1            
            if (this.model[up][this.currentPosition.x] === 0) this.model[up][this.currentPosition.x] = this.perception[1] * this.bigNumber
        }
        down = this.currentPosition.y + 1
        if (this.model[down][this.currentPosition.x] === 0) this.model[down][this.currentPosition.x] = this.perception[3] * this.bigNumber
        if (this.currentPosition.x > 0) {
            left = this.currentPosition.x - 1
            if (this.model[this.currentPosition.y][left] === 0) this.model[this.currentPosition.y][left] = this.perception[0] * this.bigNumber
        }
        right = this.currentPosition.x + 1
        if (this.model[this.currentPosition.y][right] === 0) this.model[this.currentPosition.y][right] = this.perception[2] * this.bigNumber

        
    }

    // this function returns the next position in the model depending on the selected action
    getNextPosition(action) {
        let x = this.currentPosition.x, y = this.currentPosition.y
        switch (action) {
            case "LEFT":
                x = x - 1
                break;
            case "UP":
                y = y - 1
                break;
            case "RIGHT":
                x = x + 1
                break;
            case "DOWN":
                y = y + 1
                break;
            default:
                break;
        }
        return { x, y }
    }

     /**
     * 
     * @param {*} action 
     * This function updates the current agent's position and increments the value of the current position.
     */
    updateCurrentPosition(action) {
        this.model[this.currentPosition.y][this.currentPosition.x] += 1
        this.currentPosition = { ...this.getNextPosition(action) }       
    }

    verifyMovement() {
        let action = null;
        let availablePositions=[], nextPositions=[];

        if(this.perception[4]==1){            
            action = "TAKE";
            return action;
        }     
        
        for(let i =0; i < this.perception.length-1;i++){
            if (this.perception[i] === 0) {availablePositions.push(this.getAvailablePosition(i));} 
        }
        for(let i=0; i< availablePositions.length; i++){
            let nextPosition=this.getNextPosition(availablePositions[i]);
            nextPositions.push({ action: availablePositions[i], position: nextPosition, timesVisited: this.model[nextPosition.y][nextPosition.x] })
        }
        
        let temp=this.bigNumber;
        let index=0;
        for(let i=0; i< nextPositions.length; i++){
            if(nextPositions[i].timesVisited<temp){
                temp=nextPositions[i].timesVisited;
                index=i;
            }
            
        }
        
        return nextPositions[index].action;      
        
    }

    /**
     * We override the send method. 
     * In this case, the state is just obtained as the join of the perceptions
     */
    send() {
        this.updateModel(this.perception)
        let viewKey = this.perception.join();
        let accion = this.verifyMovement(this.table[viewKey]);
        this.updateCurrentPosition(accion);

        //print model
        let arrText = '';
        for (var i = 0; i < this.model.length; i++) {
            for (var j = 0; j < this.model[i].length; j++) {
                arrText += this.model[i][j] + '    ';
            }
            console.log(arrText);
            arrText = '';
        }
        
        if (accion) {
            return accion;
        }
    }

}

module.exports = RatonAgent2;