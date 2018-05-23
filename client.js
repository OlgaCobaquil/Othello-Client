//Olga Cobaquil, 13020

var tournamentID=12;
var user_name='olgacob';
var socket = require('socket.io-client')('http://192.168.0.10:3000');

socket.on('connect', function(){
  socket.emit('signin', {
    user_name: user_name,
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});


socket.on('ready', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var board = data.board;
  var oponente = getOponent(playerTurnID);
  var b2d = transform(board);
  //validateMovement(board, oponente, playerTurnID);
  
  // TODO: Your logic / user input here
  var movimientos = [];
  for(var i = 0; i <b2d[0].length; i++){
  	for(var j = 0; j < b2d[0].length; j++){
  		//si es el id del jugador
  		if (b2d[i][j] == playerTurnID){
  			//validar los posibles movimientos en base al tablero
  			var mov = validateMovement(b2d, j, i, playerTurnID);
  			for (var k = 0; k<mov.length;k++){
                  if(!movimientos.includes(mov[k])){
                      movimientos.push(mov[k]);
                  }
              }

  		}
  	}
  }
  console.log("posibles: ", movimientos);
  
  var tira = movimientos[Math.floor(Math.random() * movimientos.length)];
  var rand = Math.floor(Math.random() * 64); //random para probar
  console.log(rand);
  socket.emit('play', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: rand //aqui va lo que hay que mandar
  });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  
  // TODO: Your cleaning board logic here

  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});

function getOponent(playerID){
	if (playerID === 1){
		return 2
	}
	else {
		return 1
	}
}

function transform(board){
	var board2D = [];
	while(board.length) board2D.push(board.splice(0,8));
	console.log(board2D);
	return board2D;
}

function validateMovement(board2d, col, row, playerID){
	movPosibles = []
	var i, j = 0;
	var other = 1;
	if (playerID ==1){
		other = 2;
	}

	if (row < 0 || row > 7 ||col < 0 || col > 7){
		return movPosibles;
	} 
	//comienza la evaluacion de posibles movimientos
	//Arriba
	i = row - 1;
	if (i >= 0 && board2d[i][col] == other) {
		i = i - 1;
		while (i >= 0 && board2d[i][col] == other){
            i = i - 1;
        }
        if (i >= 0 && board2d[i][col] == 0){
            
            movPosibles.push(i*8 + col);
            console.log("arriba posible");
        }
	}
	return movPosibles;
}



