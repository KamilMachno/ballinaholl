
document.querySelector('#btn_start').addEventListener('click', appStart)




function appStart(){
  //Ukrycie planszy poczatkowej 
  document.querySelector('#start_window').style.display = 'none';
  //Odkrycie canvasa
  document.querySelector('#canv_main').style.display = 'inline';
  //
  document.querySelector('#end_window').style.display = 'none';
  document.querySelector('#timer_div').style.display = 'block';

  let gameplay = true;
  let canvas = document.querySelector('#canv_main');
  let canWidth = canvas.width;
  let canHeight = canvas.height;
  let ballSize = 20;
  let ballLeft;
  let ballTop;
  let hollSize = 27;
  let hollTop = 100;
  let hollLeft = 400;
  let timeCurrent;

  let ctx = canvas.getContext("2d");

  //Timer
  startTimer();
  var startTime, interval;

  function startTimer(){
      startTime = Date.now();
      interval = setInterval(function(){
        //Wyświetlanie timera
        timeCurrent = ((Date.now() - startTime)/1000).toFixed(2)
        document.querySelector('#timer_div').innerHTML = timeCurrent;
      });
  }
  function stopTimer(){
    clearInterval(interval);
  }
  


  //Załadowanie przeszkód
  drawHoll(hollLeft,hollTop,hollSize);

  function handleOrientation(event) {
    let y = event.beta;  
    let x = event.gamma; 

    //Ograniczenia planszy
    let maxX = canWidth-ballSize;
    let maxY = canHeight-ballSize;
    // Ograniczenia ruchu
    if (x >  30) { x =  30}; //dla kąta powyzej 30 wartosc x jest 30
    if (x < -30) { x = -30};
    if (y >  25) { y =  25}; //dla kąta powyzej 25 wartosc y jest 25
    if (y < -25) { y = -25};
  
  //Aby ulatwic liczenie - brak katow ujemnych 
    x += 30; //zakres od 0 do 60 stopni
    y += 25; //zakres od 0 do 50 stopni
  
  
    moveBall(x*maxX/60,y*maxY/50)

    /*
    output.innerHTML  = "beta : " + x + "\n";
    output.innerHTML += "gamma: " + y + "\n";
    output.innerHTML  += "maxY : " + maxY + "\n";
    output.innerHTML  += "top : " + y*maxY/50 + "\n";
    */
    
  }
  
  window.addEventListener('deviceorientation', handleOrientation);
    
  //Ruch kulą
  function moveBall(x,y){
    //Jezeli gra trwa
    if(gameplay){
      ctx.clearRect(0, 0, canWidth, canHeight);
      drawHoll(hollLeft,hollTop,hollSize);
      ballLeft = x+ballSize/2;
      ballTop = y+ballSize/2;
      ctx.beginPath();
      ctx.arc(ballLeft, ballTop, ballSize, 0, Math.PI*2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
      kolizjaHoll();
    }
  }

  //Kolizja z dziurą
  function kolizjaHoll(){
    //wzór na odległość 2 punktów
    let odlPunkt = Math.sqrt(Math.pow(ballLeft-hollLeft,2)+Math.pow(ballTop-hollTop,2));

    //Roznica promieni
    let rozPromien = hollSize/2-ballSize/2;

    //Wzajemne polozenie okregow
    if(odlPunkt<=rozPromien+6) // okręgi rozłączne wewnętrznie / zmniejszenie tolerancji trafienia (+6)
      gameOver();
  }

  //Rysowanie dziur
  function drawHoll(x,y,s){
    ctx.beginPath();
    ctx.arc(x,y,s,0,2*Math.PI);
    ctx.fillStyle = "grey";
    ctx.fill(); 
  }

  //Game Over
  function gameOver(){
    gameplay = false; //Koniec reakcji na sensory 
    stopTimer();

    document.querySelector('#end_window').style.display = 'block';
    document.querySelector('#canv_main').style.display = 'none';
    document.querySelector('#timer_div').style.display = 'none';

    document.querySelector('#score').innerHTML = timeCurrent+" sec.";
  
    document.querySelector("#btn_new").addEventListener('click', function newGame(){
      appStart();
    })  
    document.querySelector("#btn_finish").addEventListener('click', function endGame(){
      location.reload();
    })  
  }

}



