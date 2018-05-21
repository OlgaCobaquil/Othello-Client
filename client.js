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
  transform(board);
  //validateMovement(board, oponente, playerTurnID);
  
  // TODO: Your logic / user input here
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

function getOponent(playerTurnID){
	if (playerTurnID === 1){
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

function validateMovement(board2d, oponentID, myId){
	movPosibles = []
	var legal = false;
	for (i = 0; i < board.length; i++) {

		if(board[i]===0){
    		console.log('vacio');
    		//para los horizontales
			for (x = -1; x<= 1; x++) {
				
				var found = false;
				var temp = i + x;
				current = board[i + x];
				
				while (!found){
					temp += x;
					current = board[temp]
					if (current === oponentID){
						found = true;
						legal = true;
						console.log('encontre valido');

					}

				}
			}
    	}
		//asegurarse que el adyacente no es del mismo color
		//if (board[i+1]!= oponentID && board[i+2] == 0){
		//	console.log('posible tiro en ', i+2)
		//} 
    	
	}
	
	return board
}

