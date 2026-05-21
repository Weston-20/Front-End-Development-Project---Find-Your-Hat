const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    static PLAYER = '*';
    static HOLE = 'O';
    static EMPTY = '░';
    static GOAL = '^';
    constructor(field){
        this.field = field;

        this.hat = '^';
        this.hole = 'O';
        this.fieldCharacter = '░';
        this.pathCharacter = '*';

        this.playerX = 0;
        this.playerY = 0;

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    print(){
        console.clear();
        return this.field.forEach(row => {
            console.log(row.join(' '));
        });
    }

    inputHandler(){
        return new Promise(resolve => {
        this.rl.question('Which way? (w/a/s/d) ', answer => {
            resolve(answer.trim().toLowerCase());
            });
        });
    }

    movePlayer(direction){
        let dx = 0;
        let dy = 0;

    switch (direction) {
        case 'w': dy = -1; break;
        case 's': dy = 1; break;
        case 'a': dx = -1; break;
        case 'd': dx = 1; break;
        default: return;
    }

    const newX = this.playerX + dx;
    const newY = this.playerY + dy;

    // Out of bounds
    if (
      newY < 0 || newY >= this.field.length ||
      newX < 0 || newX >= this.field[0].length
    ) {
      console.log('Out of bounds!');
      return;
    }

    const tile = this.field[newY][newX];

    if (tile === this.hole) {
      this.endField('Sorry, you fell in a hole!');
      return;
    }

    if (tile === this.hat) {
      this.endField('Congrats, you found your hat!');
      return;
    }

    // Move player
    this.field[this.playerY][this.playerX] = this.pathCharacter;
    this.field[newY][newX] = this.pathCharacter;

    this.playerX = newX;
    this.playerY = newY;
  }

  endField(message) {
    console.clear();
    console.log(message);
    this.rl.close();
    process.exit();
  }

  async start() {
    while (true) {
      this.print();
      const move = await this.inputHandler();
      this.movePlayer(move);
    }
  }

  static generateField(width, height, holePercentage) {
    const field = [];

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(Math.random() < holePercentage
          ? Field.HOLE
          : Field.EMPTY
        );
      }
      field.push(row);
    }

    field[0][0] = Field.PLAYER;

    let goalX, goalY;
    do {
      goalX = Math.floor(Math.random() * width);
      goalY = Math.floor(Math.random() * height);
    } while (field[goalY][goalX] !== Field.EMPTY);

    field[goalY][goalX] = Field.GOAL;

    return field;
  }

}


const myField = [
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
];

const field = Field.generateField(8, 6, 0.25);
const game = new Field(field);
game.start();
