//Olga Cobaquil, 13020
//Referencias: 
// He https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/RUSSIA/Final_Paper.pdf

var tournamentID=12;
var user_name='olgacob';
//casa var socket = require('socket.io-client')('http://192.168.0.18:3000');
var socket = require('socket.io-client')('http://10.171.219.47:3000');
var rMovs = [];

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
  var hola = getBoard1d(board);
  var hola2 = getBoard1d(board);
  var b2d = transform(board);
  var b2d2 = transform(hola2);
  
  //validateMovement(board, oponente, playerTurnID);
  
  // TODO: Your logic / user input here
  //var movimientos = [];
  //var movimientosOp = [];
/*
  for(var i = 0; i <b2d[0].length; i++){
  	for(var j = 0; j < b2d[0].length; j++){
  		//si es el id del jugador
  		if (b2d[i][j] == playerTurnID){
  			//validar los posibles movimientos en base al tablero
  			var mov = validateMovement(b2d, j, i, playerTurnID);
  			for (var k = 0; k<mov.length;k++){
  				//verificar que no se repitan los posibles movimientos 
                  if(!movimientos.includes(mov[k])){
                      movimientos.push(mov[k]);
                  }
              }

  		}
  		
  		if(b2d[i][j] == oponente){
  			var movOp = validateMovement(b2d, j, i, oponente);
  			for (var k = 0; k<movOp.length;k++){
  				//verificar que no se repitan los posibles movimientos 
                  if(!movimientosOp.includes(movOp[k])){
                      movimientosOp.push(movOp[k]);
                  }
            }
  		}

  	}
  }*/
  

  var mov = validateMovement(b2d, playerTurnID);
  console.log("posibles: ", mov);
  var flp = flipCoin(b2d2, playerTurnID);
  console.log("flip ", flp);

  //console.log("hd ", hola);
  /*
  for(var i =0; i<mov.length; i++){
        var move = mov[i];
        //console.log("b" ,board);
        var next =createBoard(hola , playerTurnID, mov);
    }*/

  //var alfa = runAlphaBeta(b2d, -100000, 100000);
  //console.log("oponente: ", movimientosOp);
  var tira = mov[Math.floor(Math.random() * mov.length)];
  var rand = Math.floor(Math.random() * 64); //random para probar
  console.log("Movimiento: ",tira);
  socket.emit('play', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: tira //aqui va lo que hay que mandar
  });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  console.log("fin");
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

function getBoard1d(board){
	var d1b = board.slice();
	return d1b;

} 

function transform(board){
	var board2D = [];
	while(board.length) board2D.push(board.splice(0,8));
	//console.log(board2D);
	return board2D;
}

function validateMovement(board2d, playerID){
	movPosibles = [];
	movFinales =[];
	var i, j = 0;
	var other = 1;
	if (playerID ==1){
		other = 2;
	}

	if (row < 0 || row > 7 ||col < 0 || col > 7){
		return movFinales;
	} 
	//comienza la evaluacion de posibles movimientos (arriba, abajo, derecha izquierda)

	for(var row = 0; row <board2d[0].length; row++){
  		for(var col = 0; col < board2d[0].length; col++){

  			if (board2d[row][col] == playerID){

				//Arriba
				i = row - 1;
				if (i >= 0 && board2d[i][col] == other) {
					i = i - 1;
					while (i >= 0 && board2d[i][col] == other){
			            i = i - 1;
			        }
			        if (i >= 0 && board2d[i][col] == 0){
			            movPosibles.push(i*8 + col);
			            //console.log("arriba posible");
			        }
				}

				//abajo
				i = row + 1;
				if (i < 8 && board2d[i][col] == other) {
					i = i + 1;
					while (i < 8 && board2d[i][col] == other){
			            i = i + 1;
			        }
			        if (i < 8 && board2d[i][col] == 0){   
			            movPosibles.push(i*8 + col);
			            //console.log("abajo posible");
			        }
				}

				//derecha
				j = col + 1;
				if (j < 8 && board2d[row][j] == other) {
					j = j + 1;
					while (j < 8 && board2d[row][j] == other){
			            j = j + 1;
			        }
			        if (j < 8 && board2d[row][j] == 0){   
			            movPosibles.push(row*8 + j);
			      
			        }
				}

				//izquierda
				j = col - 1;
				if (j >= 0 && board2d[row][j] == other) {
					j = j - 1;
					while (j >= 0 && board2d[row][j] == other){
			            j = j - 1;
			        }
			        if (j >= 0 && board2d[row][j] == 0){
			            movPosibles.push(row*8 + j);
			        }
				}

				//Diagonales
				//arriba derecha
				i = row - 1;
				j = col + 1;
				if (i >= 0 && j < 8 && board2d[i][j] == other) {
					i = i - 1;
					j = j + 1;
					while (i >= 0 && j < 8 && board2d[i][j] == other){
						i = i - 1;
						j = j + 1;
					} 
					if(i >= 0 && j < 8 && board2d[i][j] == 0){
						movPosibles.push(i*8 + j);
					}
				}

				//arriba izquierda

				i = row - 1;
				j = col - 1;
				if (i >= 0 && j >= 0 && board2d[i][j] == other) {
					i = i - 1;
					j = j - 1;
					while (i >= 0 && j >= 0 && board2d[i][j] == other){
						i = i - 1;
						j = j - 1;
					} 
					if(i >= 0 && j >= 0  && board2d[i][j] == 0){
						movPosibles.push(i*8 + j);
					}
				}

				//abajo derecha

				i = row + 1;
				j = col + 1;
				if (i <8 && j < 8 && board2d[i][j] == other) {
					i = i + 1;
					j = j + 1;
					while (i < 8 && j < 8 && board2d[i][j] == other){
						i = i + 1;
						j = j + 1;
					} 
					if(i < 8 && j < 8 && board2d[i][j] == 0){
						movPosibles.push(i*8 + j);
					}
				}

				//abajo izquierda
				i = row + 1;
				j = col - 1;
				if (i <8 && j >= 0 && board2d[i][j] == other) {
					i = i + 1;
					j = j - 1;
					while (i < 8 && j >= 0 && board2d[i][j] == other){
						i = i + 1;
						j = j - 1;
					} 
					if(i < 8 && j >= 0 && board2d[i][j] == 0){
						movPosibles.push(i*8 + j);
					}
				}
			}
		}
	}

	for (var k = 0; k<movPosibles.length;k++){
  				//verificar que no se repitan los posibles movimientos 
                  if(!movFinales.includes(movPosibles[k])){
                      movFinales.push(movPosibles[k]);
                  }
              }
	return movFinales;
}

function flipCoin(board2d, playerID){
	//console.log("adentro flip: ", board2d);
	flipPosible = [];
	movFinales =[];
	finalisima = [];
	var i, j = 0;
	var other = 1;
	if (playerID ==1){
		other = 2;
	}

	//comienza la evaluacion de posibles movimientos (arriba, abajo, derecha izquierda)

	for(var row = 0; row <board2d[0].length; row++){
  		for(var col = 0; col < board2d[0].length; col++){

  			if (board2d[row][col] == playerID){

				//Arriba
				i = row - 1;
				if (i >= 0 && board2d[i][col] == other) {
					i = i - 1;
					while (i >= 0 && board2d[i][col] == other){
			            flipPosible.push(i*8 + col);
			            i = i - 1;
			        }

			        if (i >= 0 && board2d[i][col] ==playerID){
			        	for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
			            
			        }
			        
				}

				//abajo
				i = row + 1;
				if (i < 8 && board2d[i][col] == other) {
					i = i + 1;
					while (i < 8 && board2d[i][col] == other){

						flipPosible.push(i*8 + col);
			            i = i + 1;
			        }
			        if (i < 8 && board2d[i][col] == playerID){  
			            for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
			        }
			        			       
				}

				//derecha
				j = col + 1;
				if (j < 8 && board2d[row][j] == other) {
					j = j + 1;
					while (j < 8 && board2d[row][j] == other){
						flipPosible.push(row*8 + j);
			            j = j + 1;   
			        }
			        if (j < 8 && board2d[row][j] == playerID){   
			            for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
			        }
			       
				}

				//izquierda
				j = col - 1;
				if (j >= 0 && board2d[row][j] == other) {
					j = j - 1;
					while (j >= 0 && board2d[row][j] == other){
						flipPosible.push(row*8 + j);
			            j = j - 1;
			        }
			        if (j >= 0 && board2d[row][j] == playerID){
			            for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
			        }
			        
			     
				}

				//Diagonales
				//arriba derecha
				i = row - 1;
				j = col + 1;
				if (i >= 0 && j < 8 && board2d[i][j] == other) {
					i = i - 1;
					j = j + 1;
					while (i >= 0 && j < 8 && board2d[i][j] == other){
						flipPosible.push(i*8 + j);
						i = i - 1;
						j = j + 1;
					} 

					if(i >= 0 && j < 8 && board2d[i][j] == playerID){
						for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
					}
				}

				//arriba izquierda

				i = row - 1;
				j = col - 1;
				if (i >= 0 && j >= 0 && board2d[i][j] == other) {
					i = i - 1;
					j = j - 1;
					while (i >= 0 && j >= 0 && board2d[i][j] == other){
						flipPosible.push(i*8 + j);
						i = i - 1;
						j = j - 1;
					} 

					if(i >= 0 && j >= 0  && board2d[i][j] == playerID){
						for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
					}

				}

				//abajo derecha

				i = row + 1;
				j = col + 1;
				if (i <8 && j < 8 && board2d[i][j] == other) {
					i = i + 1;
					j = j + 1;
					while (i < 8 && j < 8 && board2d[i][j] == other){
						flipPosible.push(i*8 + j);
						i = i + 1;
						j = j + 1;
					} 
					if(i < 8 && j < 8 && board2d[i][j] == playerID){
						for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
					}
			
				}

				//abajo izquierda
				i = row + 1;
				j = col - 1;
				if (i <8 && j >= 0 && board2d[i][j] == other) {
					i = i + 1;
					j = j - 1;
					while (i < 8 && j >= 0 && board2d[i][j] == other){
						flipPosible.push(i*8 + j);
						i = i + 1;
						j = j - 1;
					} 

					if(i < 8 && j >= 0 && board2d[i][j] == 0){
						for(var x = 0; x < flipPosible.length; x++){
			        		movFinales.push(flipPosible[x]);
			        	}
					}
					
				}
			}
		}
	}

	for (var k = 0; k<movFinales.length;k++){
  				//verificar que no se repitan los posibles movimientos 
                  if(!finalisima.includes(movFinales[k])){
                      finalisima.push(movFinales[k]);
                  }
              }
    console.log("Finalisima" , finalisima);
	return finalisima;
}
/*
//esta no funciono 

function nextBoard(mov,s,playerID){
	
	var flipCoin=[];
	s[Math.floor(mov/8)][mov%8]=playerID;
	for(var i = 0 ; i<movFinales.length;i++){
		if(movFinales[i][0]==mov){
			flipCoin=fichasCambiar.concat(movFinales[i][1]);
		}
	}
	for(var i=0; i<flipCoin.length;i++){
		s[Math.floor(flipCoin[i]/8)][flipCoin[i]%8]=playerID;
	}
	return s;

}*/

// othello logic, entonctrar las fuchas para hacer flip
var black = 1;
var white = 2;
var n = 8;
var empty = 0;

function  flip( board, player, posibles){
	myPlayer = player;
	opPlaley = getOponent(player);

	for (var i = 0; i < posibles.length; i++){

	}
}
/*
//no funciona 

function posibleFlip (board, playerID, pos){
	var opositeColor = playerID === black ? white : black;
	var pmoves = {
		izquierda: (-1) * n + (0), 
		derecha: 1*n + 0,  
        abajo: 0*n + 1,
        arriba: 0*n + (-1),
        iabajo: (-1)*n + 1,
        dabajo: 1*n + 1,
        iarriba: (-1) * n + (-1),
        darriba: 1*n + (-1)
	};

	var movsDerecha = [pmoves.derecha, pmoves.dabajo, pmoves.darriba];
	var movsIzquierda = [pmoves.izquierda, pmoves.iabajo, pmoves.iarriba];
	var fichasAcambiar = [];

	//recorrer todo el tablero 
	for(var index in pmoves){
		var cambio = pmoves[index], current = pos, cambiados = [], cColor = false;
		while (current >= 0 && current < (n*n)){
			if(current !== pos){
				//si hay oponente
				if(board[current] === opositeColor){
					cambiados.push[current];
				}
				else {
					cColor = board[current] !== empty;
					break;
				}
			
			}
			if ((current % n === 0 && movsIzquierda.indexOf(cambio) > -1) || ((current % n === n-1) && movsDerecha.indexOf(cambio) > -1)){
				break;
			}
			current += cambio;
			
		}

		if (cColor){
			for (var i = 0; i < cambiados.length; i++){
				fichasAcambiar.push(cambiados[i]);
			}
		}

	}
	console.log( "fichas: ",fichasAcambiar);
	return fichasAcambiar;
}*/
//AQUI AQUI
/*
function createBoard(board, player, mov){
	var sl = board.slice();
	console.log(sl);
	var fp = posibleFlip(sl, player, mov);
	for(var i= 0; i<fp.length; i++){
        sl[fp[i]] = player;
    }
    sl[mov] = player;
    //console.log("que s1 ", sl)
    return sl;

}*/
/*--------------------------MINIMAX--------------------------------*/
function minimax (s, depth, alpha, beta, playerID){
	//if node is a leaf node : return value of the node
	if (depth ==9){
		console.log('llegamos a depth 9');
	}

	
	var bestAction;
	var res;
	var movs = validateMovement(s, playerTurnID);
	var movOp = validateMovement(s, oponente);
	var bestVal;

	//para todos los movimientos validos
	if ( playerTurnID == playerTurnID){
		bestVal = -10000;
		for (var i = 0; i < movs.length; i++){
			res = nextBoard(movs[i], s, playerTurnID); 
			ut = minimax(res, depth + 1, alpha, beta)[1];
			bestVal = Math.max(bestVall, ut);
			alpha = Math.max(alpha, bestVal);
			if (beta <= alpha){
				break;
			}
		}
	}
	else {
		bestVal = 10000;
		for (var i = 0; i < movOp.length; i++){
			res = nextBoard(movOp[i], s, oponente);
			ut = minimax(res, depth + 1, alpha, beta)[1];
			minVal = Math.min(minVal, ut);
			beta = Math.min(beta, minVal);
			if (beta <= alpha){
				break;
			}
		}
	}
	
	return bestVal;
}

function runAlphaBeta(s, alpha,beta){
	var ab = minimax(s, 3, alpha, beta);
	return ab;
}
