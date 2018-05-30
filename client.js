//Olga Cobaquil, 13020
//Referencias: 
// He https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/RUSSIA/Final_Paper.pdf

var tournamentID=12;
var user_name='olgacob';
var socket = require('socket.io-client')('http://192.168.20.12:3000');
//var socket = require('socket.io-client')('http://10.171.219.47:3000');
var rMovs = [];

var pesos=[
	[ 4,-3, 2, 2, 2, 2,-3, 4],
	[-3,-4,-1,-1,-1,-1,-4,-3],
	[ 2,-1, 1, 0, 0, 1,-1, 2],
	[ 2,-1, 0, 1, 1, 0,-1, 2],
	[ 2,-1, 0, 1, 1, 0,-1, 2],
	[ 2,-1, 1, 0, 0, 1,-1, 2],
	[-3,-4,-1,-1,-1,-1,-4,-3],
	[ 4,-3, 2, 2, 2, 2,-3, 4]];

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
  console.log(b2d);
  

  var mov = validateMovement(b2d, playerTurnID);
  console.log("posibles: ", mov);
  //var flp = flipCoin(b2d2, playerTurnID);
  var prueba = 	[ [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 2, 0, 0, 0, 0, 0 ],
  [ 0, 0, 1, 2, 2, 2, 0, 0 ],
  [ 0, 0, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 0, 1, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0 ] ];
		
  //var board = nextBoard(prueba, 1, [22]);
  //console.log ("return reli: ",reli);	

  //var movimiento1=maxVal(prueba,2,-100000,100000, playerTurnID);	 
  var reli = flipCoinV2(prueba, 1, 22);
  console.log("Reurn flip ", reli);

  var bo = nextBoard(prueba, 1, [22]);
  console.log ("nuevo tablero flip: ",bo);	


  var tira = mov[Math.floor(Math.random() * mov.length)];
  
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

/*--------------- VALIDAR MOVIMIENTO -------------*/
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

/*--------------- Flip de fichas del tablero ------------------*/
function flipCoinV2(board2d, playerID, posiblesMovs){

	let newBoard = board2d.slice();

	let flipPosible = [];
	let movFinales = [];

	let other = getOponent(playerID);
	let movi = posiblesMovs;
	//let movi = posiblesMovs[Math.floor(Math.random() * posiblesMovs.length)];
	
	newBoard[Math.floor(movi/8)][movi%8]=playerID;
	

	let row = Math.floor(movi/8);
	let col = movi%8;

	//Arriba
	let i = row - 1;
	if (i >= 0 && newBoard[i][col] == other) {
		flipPosible.push(i*8 + col);
		i = i - 1;
		
		while (i >= 0 && newBoard[i][col] == other){
            flipPosible.push(i*8 + col);
 
            i = i - 1;
        }

        if (i >= 0 && newBoard[i][col] ==playerID){
        	for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}

            return movFinales;
        }
        else if(i >= 0 && newBoard[i][col] == 0){
        	flipPosible = [];
        }
        
	}

	//abajo
	i = row + 1;
	if (i < 8 && newBoard[i][col] == other) {
		flipPosible.push(i*8 + col);
		i = i + 1;
		
		while (i < 8 && newBoard[i][col] == other){

			flipPosible.push(i*8 + col);
            i = i + 1;
        }
        if (i < 8 && newBoard[i][col] == playerID){  
            for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        return movFinales;
        }
  	 	else if(i < 8 && newBoard[i][col] == 0){
  	 		flipPosible = [];
  	 	}
        			       
	}

	//derecha
	let j = col + 1;
	if (j < 8 && newBoard[row][j] == other) {
		flipPosible.push(row*8 + j);
		j = j + 1;
		
		while (j < 8 && newBoard[row][j] == other){
			flipPosible.push(row*8 + j);
            j = j + 1;   
        }
        if (j < 8 && newBoard[row][j] == playerID){   
            for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        	return movFinales;
        }
        else if (j < 8 && newBoard[row][j] == 0){
        	flipPosible = [];
        }
       
	}

	//izquierda
	j = col - 1;
	if (j >= 0 && newBoard[row][j] == other) {
		flipPosible.push(row*8 + j);
		j = j - 1;
		while (j >= 0 && newBoard[row][j] == other){
			flipPosible.push(row*8 + j);
            j = j - 1;
        }
        if (j >= 0 && newBoard[row][j] == playerID){
            for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        	return movFinales;
        }
        else if (j >= 0 && newBoard[row][j] == 0){
        	flipPosible = [];
        }    
	}

	//Diagonales
	//arriba derecha
	i = row - 1;
	j = col + 1;
	if (i >= 0 && j < 8 && newBoard[i][j] == other) {
		flipPosible.push(i*8 + j);
		i = i - 1;
		j = j + 1;
		
		while (i >= 0 && j < 8 && newBoard[i][j] == other){
			flipPosible.push(i*8 + j);
			i = i - 1;
			j = j + 1;
		} 

		if(i >= 0 && j < 8 && newBoard[i][j] == playerID){
			for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        	return movFinales;
		}

		else if(i >= 0 && j < 8 && newBoard[i][j] == 0){
			flipPosible = [];
		}
	}

	//arriba izquierda

	i = row - 1;
	j = col - 1;
	if (i >= 0 && j >= 0 && newBoard[i][j] == other) {
		flipPosible.push(i*8 + j);
		i = i - 1;
		j = j - 1;
		
		while (i >= 0 && j >= 0 && newBoard[i][j] == other){
			flipPosible.push(i*8 + j);
			i = i - 1;
			j = j - 1;
		} 

		if(i >= 0 && j >= 0  && newBoard[i][j] == playerID){
			for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        return movFinales;
		}
		else if(i >= 0 && j >= 0  && newBoard[i][j] == 0){
			flipPosible = [];
		}

	}

	//abajo derecha

	i = row + 1;
	j = col + 1;
	if (i <8 && j < 8 && newBoard[i][j] == other) {
		flipPosible.push(i*8 + j);
		i = i + 1;
		j = j + 1;
		
		while (i < 8 && j < 8 && newBoard[i][j] == other){
			flipPosible.push(i*8 + j);
			i = i + 1;
			j = j + 1;
		} 
		if(i < 8 && j < 8 && newBoard[i][j] == playerID){
			for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        	return movFinales;
		}
		else if(i < 8 && j < 8 && newBoard[i][j] == 0){
			flipPosible = [];
		}

	}

	//abajo izquierda
	i = row + 1;
	j = col - 1;
	if (i <8 && j >= 0 && newBoard[i][j] == other) {
		flipPosible.push(i*8 + j);
		i = i + 1;
		j = j - 1;
		
		while (i < 8 && j >= 0 && newBoard[i][j] == other){
			flipPosible.push(i*8 + j);
			i = i + 1;
			j = j - 1;
		} 

		if(i < 8 && j >= 0 && newBoard[i][j] == playerID){
			for(var x = 0; x < flipPosible.length; x++){
        		movFinales.push(flipPosible[x]);
        	}
        	return movFinales;
		}
		else if(i < 8 && j >= 0 && newBoard[i][j] == 0){
			flipPosible = [];
		}
		
	}

}

/*---------- Devolver el tablero con los flips ---------*/
function nextBoard(board, playerID, posibleM){
	let newBoard = board.slice();

	let voltear = flipCoinV2(board, playerID, posibleM);
	for(var i = 0; i<voltear.length; i++){
		newBoard[Math.floor(voltear[i]/8)][voltear[i]%8]=playerID;
	}
	return newBoard;
}

/*-----------------MAX VAL para minimax------------------*/
function maxVal(s,depth,alpha, beta, playerID){
	
	let valMayor = -10000;
	let resultadosFuturos;
	let ut; 
	let mejorAccion;
	//traer los movimientos validos
	let movis = validateMovement(s, playerID);

	for (var i = 0; i <movis.length; i++){
		resultadosFuturos = nextBoard(s, playerID, movis[i]);
		ut = minimax(resultadosFuturos, depth +1, alpha, beta);
		//console.log("ut ", ut);
		// alpha - beta 
		valMayor = Math.max(valMayor, ut);
		alpha = Math.max(alpha, valMayor);

		if(beta <= alpha){
			break;
		}
	}
	return valMayor;
}

/*------------------------MIN VAL para minimax----------------------*/

function minVal(s, depth, alpha, beta, oponentID){
	let valMenor = 10000;
	let resultadosFuturos;
	let ut;
	let mejorAccion;
	let movVal = validateMovement(s,oponentID);
	for(var j = 0; j < movVal.length; j++){
		resultadosFuturos = nextBoard(s,oponentID, movVal[i]);
		ut = minimax(resultadosFuturos, depth +1, alpha,beta);
		valMenor = Math.min(valMenor, ut);
		beta = Math.min(beta, valMenor);
		if(beta <= alpha){
			break;
		}
	}
	return valMenor;
}

/*--------------------------MINIMAX--------------------------------*/
function minimax (s, depth, alpha, beta, playerID, evaluatedP, pesosM){
	//segun un paper el depth que mejor funciona es 5
	if(depth == 5){
		console.log("Devolvere las heuristicas");
		return heuristicas(s, playerID, pesosM)
	}
	let opID = getOponent(playerID);
	
	var bestVal;

	//para todos los movimientos validos
	if ( playerID == evaluatedP){
		return maxVal(s, depth,alpha,beta, playerID);
	}
	else {
		return minVal(s, depth,alpha,beta,opID);
	}
}

/*----------------------Heuristicas-----------------------------*/

function heuristica(s, idMy, ps){
	return esquinas(s, idMy) + estabilidad(s, idMy, ps);
}

//Esquinas

function esquinas(S, myID){
	let opId = getOponent(myID);
	let playerE = 0;
	let oponentE = 0;
	//las esquinas para mi
	if(s[0][0] == myID){
		playerE++;
	}
	if(s[7][0]== myID){
		playerE++;
	}
	if(s[0][7] == myID){
		playerE++;
	}
	if(s[7][7]==myID){
		playerE++;
	}
    //oponnte
	if(s[0][0] == opId){
		oponentE++;
	}
	if(s[7][0]== opId){
		oponentE++;
	}
	if(s[0][7] == opId){
		oponentE++;
	}
	if(s[7][7]==opId){
		oponentE++;
	}
	if(playerE+oponentE !=0){
		return 100.0*(playerE-oponentE)/(playerE+oponentE);
	}
	else{
		return 0;
	}
}
//Estabilidad -> pesos

function estabilidad(s, miId, pes){
	let op = getOponent(miId);
	let mio = 0;
	let otro = 0;
	for(var i = 0; i < s.length; i++){
		for(var j = 0; s.length; j++){
			if(s[i][j] == miId){
				mio = mio + pes[i][j];
			}
			if (s[i][j] == op){
				otro = otro + pes[i][j];
			}
		}
	}
	return 100.0 * (mio-otro)/(mio+otro);
}

/*--------------------Posibles para todo el tablero------------------------*/
//no lo usare por el momento

/*
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
					flipPosible.push(i*8 + col);
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
					flipPosible.push(i*8 + col);
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
					flipPosible.push(row*8 + j);
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
					flipPosible.push(row*8 + j);
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
					flipPosible.push(i*8 + j);
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
					flipPosible.push(i*8 + j);
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
					flipPosible.push(i*8 + j);
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
					flipPosible.push(i*8 + j);
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
		}//
	}//aqui

	for (var k = 0; k<movFinales.length;k++){
  				//verificar que no se repitan los posibles movimientos 
                  if(!finalisima.includes(movFinales[k])){
                      finalisima.push(movFinales[k]);
                  }
              }
    //console.log("Finalisima" , finalisima);
	return finalisima;
}*/

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