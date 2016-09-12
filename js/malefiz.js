
"use strict";

//Programm wird erst ausgeführt wenn das Fenster vollstÃ¤ndig geladen wurde
window.onload = function(){

	
	//Array mit den Classen der einzelnen Feldstatus
	var status_arr = new Array("feld_leer", "spieler_eins", "spieler_zwei", "spieler_drei", "spieler_vier", "feld_rot", "feld_schwarz", "feld_ziel", "feld_auswahl");
	
 	// Diese Funktion das Element aus ID, Klasse und Name zurÃ¼ckgeben.
 	var $ = function (selector)
	{
		// Wenn das erste Zeichen des Ãœbergebenenparameter eine "#" beinhaltet, wird das Elememt mit dieser ID zurÃ¼ckgegeben
		if(selector.substr(0,1) == "#")
		{
			return document.getElementById(selector.substr(1));
		}
		// Wenn das erste Zeichen des Ãœbergebenenparameter eine "." beinhaltet, wird da Element mit dieser Klasse zurÃ¼ckgegeben.
		else if(selector.substr(0,1) == ".")
		{
			return document.getElementsByClassName(selector.substr(1));
		}
		// Wenn der Ãœbergabeparameter keinen zeichen am anfang enthÃ¤lt, wird das Element mit diesem Namen zurÃ¼ckgegeben.
		else
		{
			return document.getElementsByName(selector);
		}
	}
	
	
	var angemeldetAls = function(){
		var nickname = login.getNickname();
		var lobby = $("#angemeldetals");
		var text = document.createTextNode(" Nickname: "+nickname);
		var frag = document.createDocumentFragment();
		var div = document.createElement("DIV");
		div.appendChild(text);
		div.setAttribute("id", "durch?");
		lobby.appendChild(div);
	}
	
	var lobby = new function(){
	
		var lobby_id = $("#lobby");
		var frag = document.createDocumentFragment();
		var spielerAnzahl1 = 0;
		var spielerAnzahl2 = 0;
		var spielNr = 0;
		var meinSpiel;
		var meinSpielAnz;
				
		this.lobbyAnzeigen = function (){
			var button = document.createElement("INPUT");
			button.setAttribute("type", "button");
			button.setAttribute("id", "spiel_anlegen");
			button.setAttribute("value", "Neues Spiel anlegen");
			button.setAttribute("style", "margin: 0 auto; width: 200px; margin-bottom: 20px;");
			button.addEventListener("click", spielAnlegen);
			frag.appendChild(button);			
			lobby_id.appendChild(frag);
		}
		
		
		var spielAnlegen = function (){
			meinSpiel = "spiel_"+login.getNickname();
			meinSpielAnz = 1;
			var div = document.createElement("DIV");
			div.setAttribute("id", "div");
			var text = document.createTextNode(" Eingeloggte User: ");
			var span = document.createElement("SPAN");
			span.setAttribute("id", "anzahlSpieler");
			span.appendChild(document.createTextNode(meinSpielAnz));
			div.setAttribute("style", "font-size: 13px; margin-bottom: 20px;");
			div.appendChild(text);
			div.appendChild(span);
			frag.appendChild(div);
		
			lobby_id.appendChild(frag);
			$("#spiel_anlegen").style.display = "none";
			var spielButton = $(".spielbutton");
			for(var i = 0; i<spielButton.length; i++)
			{
				spielButton[i].style.display = "none";
	
			}
			
			aktuellesSpiel.setaktuellesGame(meinSpiel, 1);

			var lobbymsg = new Object();
			lobbymsg.typ = "lobby";
			lobbymsg.sender = login.getNickname();
			lobbymsg.spielid = meinSpiel;
			lobbymsg.spielerAnzahl = meinSpielAnz;
			netzwerk.send(lobbymsg);
		}
		
		var startSpiel = function (){
			aktuellesSpiel.init(meinSpielAnz);
		
			var lobbymsg = new Object();
			lobbymsg.typ = "lobby";
			lobbymsg.sender = login.getNickname();
			lobbymsg.spielid = meinSpiel;
			lobbymsg.startSpiel = meinSpielAnz;
			netzwerk.send(lobbymsg);
		}
		
		this.setGame = function (msg){
			
			if(msg.spielid == meinSpiel)
			{
				if(msg.spielerAnzahl == 4)
				{
					meinSpielAnz = 4;
				}
				else{
					meinSpielAnz = msg.spielerAnzahl;
					$("#anzahlSpieler").innerHTML = meinSpielAnz;
					if(meinSpielAnz >=2 && $("#spielStarten") === null){
						var button_start = document.createElement("INPUT");
						button_start.setAttribute("type", "button");
						button_start.setAttribute("style", "margin: 0 auto; width: 200px; margin-bottom: 20px;");
						button_start.setAttribute("value", "Spiel Starten");
						button_start.setAttribute("id", "spielStarten");
						button_start.addEventListener("click", startSpiel);
						frag.appendChild(button_start);
						lobby_id.appendChild(frag);
					}
					
					var lobbymsg = new Object();
					lobbymsg.typ = "lobby";
					lobbymsg.sender = login.getNickname();
					lobbymsg.spielid = meinSpiel;
					lobbymsg.spielerAnzahl = meinSpielAnz;
					netzwerk.send(lobbymsg);
				}
			}
			else
			{
				if(msg.startSpiel === undefined ){
				
					if(aktuellesSpiel.getspielerNr() == 0)
					{
						if($("#spiel_"+msg.sender) === null)
						{
							var button_game = document.createElement("INPUT");
							button_game.setAttribute("type", "button");
							button_game.setAttribute("style", "margin: 0 auto; width: 200px; margin-bottom: 20px;");
							button_game.setAttribute("anzahlSpieler", msg.spielerAnzahl);
							button_game.setAttribute("erzeuger", msg.sender);
							button_game.setAttribute("value", "In "+msg.sender+"'s Spiel einloggen?");
							button_game.setAttribute("class","spielbutton");
							button_game.setAttribute("id", "spiel_"+msg.sender);
							button_game.addEventListener("click", beitreten);
							frag.appendChild(button_game);
							lobby_id.appendChild(frag);
						}
						else
						{
							$("#spiel_"+msg.sender).setAttribute("anzahlSpieler", msg.spielerAnzahl);
						}
					}
				}
				else{
					aktuellesSpiel.init(msg.startSpiel);
				}
			}
		}
		
		var beitreten = function (){
			var div = document.createElement("DIV");
			var anzahlSpieler = parseInt(this.getAttribute("anzahlSpieler"))+1;
			
			div.setAttribute("id", "div");
			var text = document.createTextNode("In "+this.getAttribute("erzeuger")+"'s Spiel eingeloggte User: ");
			var span = document.createElement("SPAN");
			span.setAttribute("id", "anzahlSpieler");
			span.appendChild(document.createTextNode(anzahlSpieler));
			div.setAttribute("style", "font-size: 13px; margin-bottom: 20px;");
			div.appendChild(text);
			div.appendChild(span);
			frag.appendChild(div);
		
			lobby_id.appendChild(frag);
			$("#spiel_anlegen").style.display = "none";
			var spielButton = $(".spielbutton");
			for(var i = 0; i<spielButton.length; i++)
			{
				spielButton[i].style.display = "none";
	
			}
			aktuellesSpiel.setaktuellesGame(this.id, anzahlSpieler);
			
			var lobbymsg = new Object();
			lobbymsg.typ = "lobby";
			lobbymsg.sender = login.getNickname();
			lobbymsg.spielid = this.id;
			lobbymsg.spielerAnzahl = anzahlSpieler;
			netzwerk.send(lobbymsg);
		}
		
		this.setWin = function(winmsg)
		{
			
			if(winmsg.message == 'reset')
			{
				if(winmsg.spiel == aktuellesSpiel.aktuellesGame)
				{
					alert("Spieler "+winmsg.nickname+" hat das Spiel gewonnen");
					location.href = location.href;
				}
			}
		}
	}
	
	// Die Klasse ist dazu dar, um die Chatnachricht auszugeben bzw. anzuzeigen
	var chat = new function() {
		var ws;
		
		// Diese Methode wird von der Methode "send" der Klasse "Netzwerk" aufgerufen, denn diese wird dann in allen Chatfenstern angezeigt. Sie erwartet als Parameter ein Objekt, welches zu eine Nachricht verarbeitet wird.
		this.netzSchreiben = function(msg){
			var sender = msg["sender"];
			var nachricht = msg["message"];
			var aktuellesGame = msg['aktuellesGame'];
			
			if(aktuellesSpiel.getaktuellesGame() == 0 || aktuellesSpiel.getaktuellesGame() == aktuellesGame)
				$("#outputID").innerHTML = sender+": "+nachricht + "<br>" + $("#outputID").innerHTML;
		}
		
		// Diese Methode wird nur dann aufgerufen, wenn die Ã¼bergebene Nachricht lokal an das Chatfenster anzeigt werden soll.
		this.systemSchreiben = function(nachricht){
			$("#outputID").innerHTML = "System: "+nachricht + "<br>" + $("#outputID").innerHTML;
		}
		
		// Diese Methode wird dient dazu, das ohne einen Button ein Abschicken des Inhaltes im Textfeld ermÃ¶glicht wird. "e.keyCode == 13" bedeutet soviel wie, wurde die Entertaste betÃ¤tigt? Sobal die Taste gedrÃ¼ckt wird, wird die Nachhricht als Objekt an die Methode "send" der Klasse "netzwerk" Ã¼bergeben. Das hat zur Folge das alle, die die Seite geÃ¶ffnet haben diese Nachricht erhalten.
		var buttonpressed = function(e){
			if(e.keyCode == 13){
				var chatmsg = new Object();
				chatmsg.typ = "chat";
				chatmsg.sender = login.getNickname();
				chatmsg.message = $("#inputID").value;
				chatmsg.aktuellesGame = aktuellesSpiel.getaktuellesGame();
				
				netzwerk.send(chatmsg);
				$("#outputID").innerHTML = chatmsg.sender+": "+chatmsg.message + "<br>" + $("#outputID").innerHTML;
			}
		}
		$("#inputID").addEventListener("keydown", buttonpressed);
	}
	// Die Klasse ist das wichtigste an dem ganzen Programm. Ohne diese Klasse kann ein Spielen Ã¼ber das Netzwerk bzw. an verschiedenen Client nicht erfolgen. Sie dient dazu, Pakete ins Netzwerk zu senden und diese Pakete werden im weiteren so verarbeitet, dass das Spiel und Chatnachricht bei allen Clients ankommt.
	var netzwerk = new function() {
		var ws;
		
		// Diese Methode sorgt dafÃ¼r, dass nur Objekte mit dem typ "chat" ins Chatfenster von allen Client angezeigt wird.
		function parseJson(myJSONtext){
			var jsonobj = JSON.parse(myJSONtext);
			if(jsonobj.typ === "chat")
				chat.netzSchreiben(jsonobj);
				
			if(jsonobj.typ === "game")
				aktuellesSpiel.setNetzwek(jsonobj);
				
			if(jsonobj.typ === "lobby")
				lobby.setGame(jsonobj);
			
			if(jsonobj.typ === "win")
				lobby.setWin(jsonobj);
		}
		
		// Diese Methode erwartet eine Zeichenkette, die verschlÃ¼sselt werden soll. Die VerschlÃ¼sselung sieht wie folt aus. Jedes Zeichen wird einzelnd verarbeitet und in ein Ascii-Zeichen umgewandelt, dieser Zahl wird mit 12 addiert und zurÃ¼ckgewandelt. Nun ist die Nachricht verschlÃ¼sselt und nichtmehr leserlich.
		function encode (str){
		var nachricht = "";
		for(var i=0; i<str.length; i++){
			nachricht += String.fromCharCode(str.charCodeAt(i)+12);
		}
		return nachricht;
		}
		 
		// Diese Methode erwartet eine verschlÃ¼sselte Zeichenkette, der Vorgang von der Methode "encode" ist mit diesem Vorgang sehr Ã¤hnlich. Jedes Zeichen wird wieder einzelne verarbeitet. Es wird in ein Ascii-Zeichen umgewandelt und diese Zahl wird mit 12 subtrahiert und zurÃ¼ckgewandelt. Die Nachricht kann vom Anwender gelesen werden.
		function decode (str){
		  var nachricht = "";
		  for(var i=0; i<str.length; i++){
				nachricht += String.fromCharCode(str.charCodeAt(i)-12);
		  }
		  return nachricht;
		}
		
		// Diese Methode erzeugt ein neues Objekt vom WebSocket und dient dazu eine Verbindung zu ihm herzustellen. Desweiteren wird nach dem PrÃ¤fix "maggi_chat" in der Nachricht gesucht, sollte dieser nicht Vorhanden sein, wird ein er nicht im Chat angezeigt.
		function init(){
			try {
					ws = new WebSocket("ws://xalpha.eye-projekt.de:1241"); // Jens Server
				//	ws = new WebSocket("ws://borsti1.inf.fh-flensburg.de:8080"); // FH Server
					ws.onopen = function() {
					
					};
					ws.onmessage = function(e) {
						var messageAfterSend = decode(e.data);
						if(messageAfterSend.substr(0, 11) === "maggis_chat"){
							messageAfterSend = messageAfterSend.substring(11);
							parseJson(messageAfterSend);
						}
					};
					ws.onclose = function() {
						chat.systemSchreiben("Verbindung zum Server verloren.");
					};
			  }
			  catch(e) {
					chat.systemSchreiben(e.message);
			  }
		}
		// Diese Methode VerschlÃ¼sselt die Nachricht die als Parameter Ã¼bergeben wird, durch die Methode "encode". Die Methode "ws.send" der Klasse "Websocket" ermÃ¶glicht das Senden von Objekt oder Nachricht Ã¼ber das Netzwerk. Als Parameter wird ein Objekt erwartet, welches dann in ein JSON Objekt transformiert wird.
		this.send = function (msg){
			try{
				ws.send(encode("maggis_chat"+JSON.stringify(msg)));
			}
			catch(e) {
				chat.systemSchreiben(e.message);
			}
		}
	// Aufruf von init, um Verbindung herzustellen
		init();
	}						
	
	// Diese Klasse erzeugt das Loginfenster. In dem Fenster ist kann man einen Nicknamen eintragen. Dieser wird fÃ¼r den gesamten Spielverlauf weiterhin verwendet..
	var login = new function()
	{
		var nickname = "Noname";
		
		// Diese Methode dient dazu, das man Ã¼ber die ID den eingegebenen Namen bekommt und diesen speichert. Beim Login wird auÃŸerdem eine Meldung bei allen Clients ausgeben, dass sich ... angemeldet hat.
		var saveNick = function(){
			var textfeld = document.getElementById("nickname");
			var submit = document.getElementById("nickname_submit");
			document.getElementById("dialog").style.display = "none";
			
			var loginmsg = new Object();
			loginmsg.typ = "chat";
			if(textfeld.value !== "")
			{
				nickname = textfeld.value;
			}
				loginmsg.sender = nickname;
			loginmsg.message = "Hat sich eingeloggt";
			netzwerk.send(loginmsg);
			chat.systemSchreiben("Willkommen "+nickname+", viel SpaÃŸ beim Spielen!");
			angemeldetAls();
			lobby.lobbyAnzeigen();
		}
		// Diese Methode dient eingelitch nur um den nicknamen Ã¼berall verwenden zu kÃ¶nnen.
		this.getNickname = function()
		{
			return nickname;
		}
		// Mithilfe diese Funktion erzeugt man einen eventlistener auf dem Submit button vom Anfang
		var submit = document.getElementById("nickname_submit");
			submit.addEventListener("click", saveNick);
	}
	
	// Die Klasse Spielfeld ist dazu dar um ein Spielfeld in erster Linie darzustellen.
	var spielfeld = new function()
	{
		//Im arrX wird der Spielfeldplan anglegt
		var arrX = new Array();
		 arrX[0] = new Array(0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0);
		 arrX[1] = new Array(6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6);
		 arrX[2] = new Array(6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6);
		 arrX[3] = new Array(6,6,6,6,6,6,6,6,5,6,6,6,6,6,6,6,6);
		 arrX[4] = new Array(0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0);
		 arrX[5] = new Array(0,0,0,0,0,0,6,6,5,6,6,0,0,0,0,0,0);
		 arrX[6] = new Array(0,0,0,0,0,0,6,0,0,0,6,0,0,0,0,0,0);
		 arrX[7] = new Array(0,0,0,0,6,6,5,6,6,6,5,6,6,0,0,0,0);
		 arrX[8] = new Array(0,0,0,0,6,0,0,0,0,0,0,0,6,0,0,0,0);
		 arrX[9] = new Array(0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0);
		arrX[10] = new Array(0,0,6,0,0,0,6,0,0,0,6,0,0,0,6,0,0);
		arrX[11] = new Array(5,6,6,6,5,6,6,6,5,6,6,6,5,6,6,6,5);
		arrX[12] = new Array(6,0,0,0,6,0,0,0,6,0,0,0,6,0,0,0,6);
		arrX[13] = new Array(6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6);
		arrX[14] = new Array(0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0);
		arrX[15] = new Array(0,1,0,1,0,2,0,2,0,3,0,3,0,4,0,4,0);
		arrX[16] = new Array(0,1,0,1,0,2,0,2,0,3,0,3,0,4,0,4,0);
		
		//Initalisierung von arrObj, das Array speichert die Objekte der Spielsteine
		var arrObj = new Array(arrX.length);
		for (var i = 0; i < arrObj.length; ++i)
		  arrObj[i] = new Array(arrX.length);
		
		//Initalisierung des home-Arrays, das Array speichert die Home-Positionen der einzelnen Spieler
		var home = new Array(4);
		 home[0] = new Array();
		 home[1] = new Array();
		 home[2] = new Array();
		 home[3] = new Array();
		
		//Get-Funktion der arrX länge
		this.getObjlength = function()
		{
			return arrX.length;
		}
		
		//Get-Funktion des Home-Arrays
		this.gethome = function(spielerNr)
		{
			return home[spielerNr-1];
		}
		
		//Get-Funktion eines einzelnen Objektes aus dem arrObj-Arrays
		this.getObj = function(y,x){
			return arrObj[y][x];
		}
		
		//Spielfeld Initalisierung wird nach dem Laden der Seite aufgerufen
		this.init = function(){
			var spielfeld = $("#spielfeld");
			var frag = document.createDocumentFragment();
			var spieler;
			var lfnr = 0;
			
			//Durchlauf des von arrX
			for(var y = 0; y<arrX.length; y++)
			{
				for(var x = 0; x<arrX.length; x++)
				{
		            //Anlegen eines neuen Spielfelds auf dem Spielbrett
					var div = document.createElement("DIV");
		            
		            //Wenn der Status des Feldes im arrX-Arrays nicht 0 is
					if(arrX[y][x] != 0)
		            {
						//wird im arrObj-Array an der entsprechenden Stelle ein neues Spielstein-Objekt angelegt
						arrObj[y][x] = new stein(y,x);
						
						//Wenn der Status der arrX-Arrays einen Spielerstein eintspricht
						if(arrX[y][x] <= 4)
						{
							//wird die ID des Objektes im Home-Array gespeichert
							home[(arrX[y][x])-1].push(y+","+x);
						}
						
					}
		            
		            //Setzen der ensprechenden Classe
		            //Wenn der Status des arrX-Arrays nicht 0 und kein Spielerstein ist (1-4) und kein Sperrstein 5 
		            if(arrX[y][x] == 0 || arrX[y][x] > 5)
		            {
						//Dann wird der Status aus dem Status-Array geladen
						div.setAttribute("class", status_arr[arrX[y][x]]+" spielfeld");
					}
					//Wenn aber der Status ein Spieler Stein ist 
					else if(arrX[y][x] > 0 && arrX[y][x] < 5)
					{
						//dann wird die Klasse feld_home vergeben
						div.setAttribute("class", "feld_home spielfeld");
					}
					//Ansonsten
					else
					{
						//wird die Klasse für ein normales Spielfeld vergeben	
						div.setAttribute("class", "feld_schwarz spielfeld");
					}
		
					//Nun wird die id für das DIV gesetzt
					div.setAttribute("id", y+","+x);
		
					frag.appendChild(div);
				}
				
				var umbruch = document.createElement("DIV");
				umbruch.setAttribute("style", "clear: both;");
				frag.appendChild(umbruch);
			}
			
			var wurfeln = document.createElement("BR");
			var wurfeln_input = document.createElement("IMG");
			wurfeln_input.setAttribute("src", "./img/0.png");
			wurfeln_input.setAttribute("id", "wuerfelanz");
			wurfeln_input.style.display = "none";
			
			//Setzten des Event-Handlers für das Clicken auf den Würfel
			//setwuerfel() fürt eine Random-Funktion aus
			wurfeln_input.addEventListener("click", aktuellesSpiel.setwuerfel, false);
			spielfeld.appendChild(wurfeln_input);
			spielfeld.appendChild(wurfeln);
			
			spielfeld.appendChild(frag);
			
			//Erneutes durchlaufen des arrX-Arrays
			for(var y = 0; y<arrX.length; y++)
			{
				for(var x = 0; x<arrX.length; x++)
				{
					//Wenn der Status nicht 0 ist
					if(arrX[y][x] > 0 )
		            {
						//Wird nach Nachbarn des Steines gesucht und in einem Array gespeichert
						var nachbar = new Array();
		                //wenn der linker Stein ein Spielstein ist
		                if(x >= 0 && arrX[y][x-1] > 0)
		                {
		                    //wird dieser Stein zum Array hinzugefügt
							arrObj[y][x].addnachbar(arrObj[y][x-1]);
		                }
		                //Oberer Stein Spielstein? s.o.
		                if(y > 0 && arrX[y-1][x] > 0)
		                {
		                     arrObj[y][x].addnachbar(arrObj[y-1][x]);
		                }
		                //Rechter Stein Spielstein? s.o.
		                if((x+1) < arrX.length && arrX[y][x+1] > 0)
		                {
		                    arrObj[y][x].addnachbar(arrObj[y][x+1]);
		                }
		                //Unterer Stein Spielstein? s.o.
		                if((y+1) < arrX.length && arrX[y+1][x] > 0)
		                {
		                    arrObj[y][x].addnachbar(arrObj[y+1][x]);
		                }
		            }
		            
		            //Wenn der Status ein ein Spielerstein oder ein Sperrstein ist
	                if(arrX[y][x] != 0 && arrX[y][x] <= 5)
	                {
						//wird ein neues spielStein-Objekt angelegt, die Laufendenummer dient als id
						spieler = new spielSteine(lfnr, arrX[y][x]);
						lfnr++;
						// und das Objekt wird mit der Funktion setKind() des Spielfeld-Objekts dem Spielfeld-Objekt angefügt.
						// die Funktion setkind() erstelt, nun das div
						arrObj[y][x].setKind(spieler);
						
						//Wenn der Status einem Spielstein des aktuellen Spielers entspricht 
						if(arrX[y][x] == aktuellesSpiel.getspielerNr())
						{
							//dann wird das Objekt dem spielerSteine-Array angehängt
							aktuellesSpiel.spielerSteine.push(spieler);
						}
					}
				}
			}
		}
		
		// Die Funktion getNachbarn() ist eine sich sich selbst Aufrufende Funktion die die Nachbarn des Spielfeldsteines herausfindet 
		// bis die Würfelzahl erreicht ist
		this.getNachbarn = function (position_vorher, position_aktuell, counter)
		{
			//auslesen des Nachbarn-Arrays aus dem aktuellen Spielstein
			var nb = position_aktuell.getnachbar();
			//die Würfelzahl wird um eins vermindert
			counter--;
			//Wenn der Counter noch nicht 0 ist
			if(counter != 0)
			{
				//Durchlaufen der Nachbarn
				for(var a = 0; a<nb.length; a++)
				{
					//Wenn die ID des vorherigen Spielsteins, nicht die ID des aktuellen Nachbarns ist
					//(Während eines Zuges darf nicht erst nach vorne und dann nach hinten gegangen werden)
					if(position_vorher.getid() != nb[a].getid())
					 {		  
							//Wenn der Aktuelle Spielstein ein Kind hat
							if(position_aktuell.getKind() !== false)
							{
								//Wird geprüft ob das Kind ein Sperrstein ist, wenn dies nicht der Fall ist
								if(position_aktuell.getKind().getStatus() != 5)
								{
									//dann wird die Funktion erneut aufgerufen
									//				    vorherige Position, aktuelle Position, verminderter Counter					
									spielfeld.getNachbarn(position_aktuell,       nb[a],          counter);
								}
									
							}
							else
							{
								//wenn kein Kind vorhanden ist wird die Funktion erneut aufgerufen
								//				    vorherige Position, aktuelle Position, verminderter Counter	
								spielfeld.getNachbarn(position_aktuell,     nb[a],              counter);
							}				  
					 }
				}
			}
			//Wenn der Counter 0 ist
			else
			{
				var display = true;
				//Wenn das aktuelle Spielfeld ein Kind hat
				if(position_aktuell.getKind() !== false)
				{
					//Wird geprüft ob der Spielstein ein eigener Spielstein ist
					if(position_aktuell.getKind().getStatus() == aktuellesSpiel.getspielerNr())
					{
						//wird das Flag display auf false gesetzt (dies verhindert das eigene Spielsteine auswählbar sind)
						display = false;
					}
					//Wenn das Kind den Spielstein ein Spielerstein oder ein Sperrstein ist
					else if(position_aktuell.getKind().getStatus() <= 5)
					{
						if(!$("#"+position_aktuell.getid()).classList.contains("feld_home"))
						{
							//wird der Stein ausgeblendet
							$("#"+position_aktuell.getid()).childNodes[0].style.display="none";
						}
					}
				}
				
				if($("#"+position_aktuell.getid()).classList.contains("feld_home"))
				{
					display = false;
				}
				
				//Wenn das Flag auf true gesetzt ist
				if(display === true)
				{
					//wird der Spielstein als auswählbar markiert.
					$("#"+position_aktuell.getid()).classList.add("feld_auswahl");
					$("#"+position_aktuell.getid()).addEventListener("click", aktuellesSpiel.setFigur, false);
					//Im Array markiert wird die Markierten Spielsteine gespechert um sie einfach wieder entfernen zu können
					aktuellesSpiel.markiert.push(position_aktuell.getid());
				}
			}
		}
		
		//Diese Function wird aufgerufen wenn dem Spieler die möglichen Zielfelder angezeiggt werden sollen
		this.getoptionen = function(y,x)
		{
			//Wenn der Spieler drann ist und er gewürfelthat
			if(aktuellesSpiel.dran() && aktuellesSpiel.getwuerfel() != 0)
			{	
				//wird die Würfelzahl ausgelesen
				var wuerfelzahl = aktuellesSpiel.getwuerfel();
				//Wenn der Spielstein noch im Haus steht
				if(y >= 14 )
				{
					//Wird die Position auf das Feld über dem Haus gendert
					var startpos = new Array(0, 2, 6, 10, 14 );
					y = 13;
					x = startpos[aktuellesSpiel.getspielerNr()];
					wuerfelzahl--;
				}
				//Die Funktion getNachbarn() wird aufgerufen um die möglichen Zielfelder zu bestimmen
				spielfeld.getNachbarn(spielfeld.getObj(y,x), spielfeld.getObj(y,x), ++wuerfelzahl);
			}	
		}
		
		//Diese Funktion entfernt die Markierungen der Zielfelder
		this.clearauswahl = function()
		{
			//Durchlaufen aller Spielsteine die Markiert sind (wurden im Array Markiert gespeichert)
			for(var a = 0; a < aktuellesSpiel.markiert.length; a++)
			{
				//Entfernen nicht mehr benötigter Klassen
				$("#"+aktuellesSpiel.markiert[a]).classList.remove("feld_auswahl");
				$("#"+aktuellesSpiel.markiert[a]).classList.remove("feld_rot");
				//Entfernen nicht mehr benötigter EventListener
				$("#"+aktuellesSpiel.markiert[a]).removeEventListener("click", aktuellesSpiel.setFigur, false);
				$("#"+aktuellesSpiel.markiert[a]).removeEventListener("click", aktuellesSpiel.setSperre, false);
				$("#"+aktuellesSpiel.markiert[a]).removeEventListener("mouseover", aktuellesSpiel.SperrsteinOver, false);
				$("#"+aktuellesSpiel.markiert[a]).removeEventListener("mouseout", aktuellesSpiel.SperrsteinOut, false);
				//Wieder anzeigen von ausgeblendeten Kindern
				if($("#"+aktuellesSpiel.markiert[a]).childNodes.length > 0)
					$("#"+aktuellesSpiel.markiert[a]).childNodes[0].style.display="block";
			}
			
			//Leeren des Arrays mit den markierten Steinen
			aktuellesSpiel.markiert = new Array();
		}
	}
	
	//Klasse für die Spielsteine
	var stein = function(y,x)
	{
		//erstellen der ID
		var Id = y+","+x;
		var X = x;
		var Y = y;
		var Nachbar = new Array;
		var Kind = 0;
		
		//Get-Funktion der ID
		this.getid = function(){
			return Id;
		}
		
		//Set-Funktion von Objekten des Types Stein in das Array Nachbars
		this.addnachbar = function(nb){
			Nachbar.push(nb);
		}
		
		//Get-Funktion der Nachbar-Objekte als Array
		this.getnachbar = function(){
			return Nachbar;
		}
		
		//Set-Funktion eines Kindes (Objekt vom Typ spielSteine) in den aktuellen Spielstein
		this.setKind = function(kind){
			Kind = kind;
			$("#"+Id).appendChild(Kind.createKind());
		}
		
		//Remove-Funktion des Kindes in diesem Spielstein
		this.removeKind = function(){
			Kind = 0;
  			$("#"+Id).removeChild($("#"+Id).firstChild);
		}
		
		//Get-Finktion des KIndes als Objekt wenn vorhanden 
		this.getKind = function(){
			if(Kind === 0)
				return false;
			else
				return Kind;
		}
	}
	
	//Klasse für die Spielersteine
	var spielSteine = function(ID, art){
		var Art = art;
		var id = ID;
		
		//Get-Funktion der Klasse
		this.getClass = function(){
			return status_arr[Art];
		}
		
		//Get-Funktion des Status
		this.getStatus = function(){
			return art;
		}
		
		//Diese Funktion wird aufgerufen wenn auf den Spielerstein geklickt wird
		var clickevent = function()
		{
			//Wenn der Spieler drann ist und er schon gewürfelt hat
			if(aktuellesSpiel.dran() && aktuellesSpiel.getwuerfel() != 0)
			{
				//wird zunächst die Markierungen entfernt
				spielfeld.clearauswahl();
				//Und die ID des Spielsteins unter (Parent) des gerad angeklickten Steines ausgelesen
				var id_parent = $("#"+this.id).parentNode.id;
				var id_split = id_parent.split(",");
				var y = id_split[0];
				var x = id_split[1];
				
				//Das Flag Fix wird gesetzt um clearauswahl nicht durch die mousemoveout-Funktion wieder aufzurufen
				aktuellesSpiel.setfix(true);
				//Setzen der ID als angeklickter Stein
				aktuellesSpiel.setActiveFigur(id_parent);
				//Anzeigen der Optionen
				spielfeld.getoptionen(y, x);
			}
		}
		
		//Diese Funktion wird aufgerufen wenn der Spielerstein mit dem Mauszeiger berührt wird
		var moveevent = function()
		{
			//Prüfung ob der Spieler dran ist und ob er gewürfelt hat
			if(aktuellesSpiel.dran() && aktuellesSpiel.getwuerfel() != 0)
			{
				//die ID des Spielsteins unter (Parent) des gerad angeklickten Steines wird ausgelesen
				var id_parent = $("#"+this.id).parentNode.id;
				var id_split = id_parent.split(",");
				var y = id_split[0];
				var x = id_split[1];
				
				//Wenn das Flag Fix nicht gesetzt ist
				if(aktuellesSpiel.getfix() === false)
				{
					//Werden die Möglichen Zielsteine für dieses Feld angezeigt
					spielfeld.getoptionen(y,x);
				}
					
			}
		}
		
		//Diese Funktion wird aufgerufen wenn der Mauszeiger den Spielerstein nicht mehr berührt
		var mouseoutevent = function()
		{
			//Wenn das Flag Fix nicht gesetzt ist
			if(aktuellesSpiel.getfix() === false)
			{
				//werden die Markierungen entfernt
				spielfeld.clearauswahl();
			}
		}

		//Diese Funktion wird aufgerufen wenn dieser Spielerstein auf einem Spielstein erstellt werden soll
		this.createKind = function(){
			var kind_div = document.createElement("DIV");
				kind_div.setAttribute("class", this.getClass()+" spielfeld");
				kind_div.id = id;
				
				//wenn der Spielerstein ein eigener Stein ist
				if(aktuellesSpiel.eigenerStein(art))
				{
					//Werden die Eventlistener erstellt
					kind_div.addEventListener("mouseover", moveevent, false);
					kind_div.addEventListener("mouseout", mouseoutevent, false);
					kind_div.addEventListener("click", clickevent, false);
				}
			return kind_div;
		}
	}
	
	//Objekt mit den Informationen über das Aktuelle Spiel
	var aktuellesSpiel = new function(){
		//Nummer der Spielers
		var spielerNr = 0;
		//Nummer des Spieles
		var aktuellesGame = 0;
		//Anzahl der Spieler in diesem Spiel
		var anzahlSpieler = 0;
		//Token des Hochgezählt wird und den Spieler anzeigt der dran ist
		var token = 1;
		var wuerfelZahl = 0;
		//Flag zum Sperren der Markierungsaufhebung
		var fix = false;
		//Speichert temporär die ID des angeklickten Spielerstein
		var activeFigur;
		//Speichert Temporär einen zu verschebenden Sperrstein
		var sperreStein;
		//Array das die Spielersteine speichert
		this.spielerSteine = new Array();
		//Speichert Temporär die markierten Steine
		this.markiert = new Array();
		
		//Get-Funktion der Spielernummer
		this.getspielerNr = function(){
			return spielerNr;
		}
		
		//Get-Funktion der Spielernummer
		this.getaktuellesGame = function(){
			return aktuellesGame;
		}
		
		this.setaktuellesGame = function(gameNr, spielernr){
			spielerNr = spielernr;
			aktuellesGame = gameNr;
		}
		
		this.init = function(anzSpieler){
			anzahlSpieler = anzSpieler;
			spielfeld.init();
			
			$("#lobby").style.display="none";
			if(spielerNr == 1){
				$("#wuerfelanz").style.display="block";
			}
		}
		
		//Get-Funktion des Tokens
		this.gettoken = function(){
			return token;
		}
		
		//Set-Funktion des Tokens
		this.settoken = function(setToken){
			token = setToken;
		}
		
		//Get-Funktion der gewürfelten Zahl
		this.getwuerfel = function(){
			return wuerfelZahl;
		}
		
		//Set-Funktion der Würfelzahl, durch eine Zufallszahl
		this.setwuerfel = function(){
			
			if(aktuellesSpiel.dran() && wuerfelZahl == 0)
			{
				//erstellen einer Zufallszahl zwischen 1 und 6
				wuerfelZahl = Math.floor(Math.random()*6)+1;
				//Setzen des entsprechendem Bildes
				$("#wuerfelanz").setAttribute("src", "./img/"+wuerfelZahl+".png");
				
				//Versenden einer Nachricht um den Spielern die gewürfelte Zahl mitzuteilen
				var loginmsg = new Object();
				loginmsg.typ = "chat";
				loginmsg.sender = login.getNickname();
				loginmsg.message = "Hat eine "+wuerfelZahl+", gewürfelt!";
				loginmsg.aktuellesGame = aktuellesSpiel.getaktuellesGame();
				netzwerk.send(loginmsg);
				chat.netzSchreiben(loginmsg);
			}
			else
			{
				alert("Mal nicht so voreilig, du bist nicht dran.");
			}
		}
		
		//Get-Funktion des Fix-Flags
		this.getfix = function(){
			return fix;
		}
		
		//Set-Funktion des Fix-Flags
		this.setfix = function(setFix){
			fix = setFix;
		}
		
		//Set-Funktion der gerade angeklickten Spielersteins
		this.setActiveFigur = function(ActiveFigur){
			activeFigur = ActiveFigur;
		}
		
		//Event-Funktion die aufgerufen wird wenn der Sperrstein neu gesetzt werden soll und ein mögliches Feld berührt wird
		this.SperrsteinOver = function()
		{
			//Das Feld wird rot und nicht mehr grau angezeigt
			this.classList.remove("feld_auswahl");
			this.classList.add("feld_rot");
		}
		
		//Event-Funktion wenn der Spielstein nicht mehr berührt wird
		this.SperrsteinOut = function()
		{
			//Das Feld wird wieder grau statt rot angezeigt
			this.classList.remove("feld_rot");
			this.classList.add("feld_auswahl");
		}
		
		//Set-Funktion wenn ein Spielerstein verschoben werden soll
		this.setFigur = function()
		{
			//der Würfel wird ausgeblendet
			$("#wuerfelanz").style.display = "none";
			//und die gewürfelte Zahl auf Null gesetzt
			wuerfelZahl = 0;
			//und das Bild des Würfels wird zurückgesetzt
			$("#wuerfelanz").setAttribute("src", "./img/0.png");
			
			var figur_move = '';
			//Splitten der ID des gerade angeklickten Spielersteins und auslesen des Objekts
			var id_alt = activeFigur.split(",");
			var y_alt = id_alt[0];
			var x_alt = id_alt[1];
			var obj_alt = spielfeld.getObj(y_alt, x_alt);
			
			//Splitten der ID der neuen Position und auslesen des Objekts
			var id_neu = this.id.split(",");
			var y_neu = id_neu[0];
			var x_neu = id_neu[1];
			var obj_neu = spielfeld.getObj(y_neu, x_neu);
			var obj_all = 0;
			
			//String erstellen mit der Anweisung des verschiebens für die anderen Spieler des Spiels
			figur_move += y_alt+','+x_alt +':'+y_neu+','+x_neu;
			
			//Entfernen der Markierten Spielsteine
			spielfeld.clearauswahl();
			//Deaktivieren des Fix-Flags
			fix = false;
			
			//Wenn die neue Position schon ein Kind hat
			if(obj_neu.getKind() !== false)
			{
				//Wird geprüft ob die neue Position ein Spielerstein oder ein Sperrstein ist
				if(obj_neu.getKind().getStatus() <= 5)
				{
					//Wenn das Kind ein Sperrstein ist
					if(obj_neu.getKind().getStatus() == 5)
					{
						//wird das Fix-Flag wieder gesetzt
						fix = true;
						//der Sperrstein wird temporär gespeichert
						sperreStein = obj_neu.getKind();
						
						//Durchlauf der Spielsteine
						for(var y = 0; y<spielfeld.getObjlength()-4; y++)
						{
							for(var x = 0; x<spielfeld.getObjlength(); x++)
							{
								//wenn der Spielstein kein Kind hat und die Klasse feld_schwarz vorhanden ist
								if($("#"+y+","+x+"").childNodes.length == 0 && $("#"+y+","+x+"").classList.contains("feld_schwarz"))
								{
									//werden diese Spielsteine als mögliche Auswahl angezeigt
									$("#"+y+","+x+"").classList.add("feld_auswahl");
									//EventListener werden gesetzt
									$("#"+y+","+x+"").addEventListener("click", aktuellesSpiel.setSperre, false);
									$("#"+y+","+x+"").addEventListener("mouseover", aktuellesSpiel.SperrsteinOver, false);
									$("#"+y+","+x+"").addEventListener("mouseout", aktuellesSpiel.SperrsteinOut, false);
									aktuellesSpiel.markiert.push(y+","+x);
								}
							}
						}
						
						//wenn die alte Position nicht im Hausliegt
						if(!$("#"+obj_alt.getid()).classList.contains("feld_home") && y_alt < (spielfeld.getObjlength()-4))
						{
							//wird dieser Spielsteine ebenfalls als mögliche Auswahl angezeigt
							$("#"+obj_alt.getid()).classList.add("feld_auswahl");
							$("#"+obj_alt.getid()).addEventListener("click", aktuellesSpiel.setSperre, false);
							$("#"+obj_alt.getid()).addEventListener("mouseover", aktuellesSpiel.SperrsteinOver, false);
							$("#"+obj_alt.getid()).addEventListener("mouseout", aktuellesSpiel.SperrsteinOut, false);
							aktuellesSpiel.markiert.push(obj_alt.getid());
						}
						//Das Kind auf der neuen Position wird entfernt
						obj_neu.removeKind();
					}
					else
					{
						//Wenn die neue Position ein gegnerische Spielstein ist
						//Werden die Homesteine des Spielers ausgelesen
						var home = spielfeld.gethome(obj_neu.getKind().getStatus());
						//und geprüft welcher Homestein noch frei ist
						for(var i = 0; i < home.length; i++)
						{
							if($("#"+home[i]).childNodes.length == 0)
							{
								var id_home = home[i].split(',');
								//Das Objekt des Homefeldes wird ausgelesen
								var y_home = id_home[0];
								var x_home = id_home[1];
								var obj_home = spielfeld.getObj(y_home, x_home);
								//Der Spielerstein wird in sein Haus verschoben
								obj_home.setKind(obj_neu.getKind());
								obj_neu.removeKind();
								//der String wird erweitert mit der Anweisung des verschiebens für die anderen Spieler des Spiels
								figur_move += '|'+y_neu+','+x_neu+':'+y_home+','+x_home;
								break;
							}
						}
						
					}
				}
			}			
			
			//Verschieben des Spielsteins an seine neue Position
			obj_neu.setKind(obj_alt.getKind());
			obj_alt.removeKind();
			
			//Wenn das Fix-Flag nicht mehr gesetzt ist
			if(!fix)
			{
				//wenn die SpielerNr gleich der Anzahl der Spieler in diesem Spiel ist
				if(spielerNr == anzahlSpieler)
				{
					//wird der token auf 0 gesetzt
					token = 0;
				}
				//der Token wird erhöht
				token++;
			}
			
			//Versenden der Spielinformation das sich etwas geändert hat
			var tokenmsg = new Object();
			tokenmsg.typ = "game";
			tokenmsg.spiel = aktuellesGame;
			tokenmsg.anzahlSpieler = anzahlSpieler;
			tokenmsg.sender = spielerNr;
			tokenmsg.message = figur_move;
			tokenmsg.token = token;
			netzwerk.send(tokenmsg);
			
			if(y_neu == 0 && x_neu == 8)
			{
				var winmsg = new Object();
				winmsg.typ = "win";
				winmsg.spiel = aktuellesGame;
				winmsg.anzahlSpieler = anzahlSpieler;
				winmsg.sender = spielerNr;
				winmsg.nickname = login.getNickname();
				winmsg.message = 'reset';
				netzwerk.send(winmsg);
				
				alert("Sie haben das Ziel erreicht");
				location.href = location.href;
			}
		}		
		//Wenn der Sperrstein bewegt werden soll wird diese Funktion aufgerufen
		this.setSperre = function()
		{
			//Auslesen des gerade angeklickten Auswahlfeldes
			var id_neu = this.id.split(",");
			var y_neu = id_neu[0];
			var x_neu = id_neu[1];
			//und auslesen des Objektes
			var obj_neu = spielfeld.getObj(y_neu, x_neu);
			
			//Entfernen des Fix-Flags
			fix = false;
			
			//Setzen des Sperrsteins
			obj_neu.setKind(sperreStein);
			//entfernen der Markierungen
			spielfeld.clearauswahl();
			
			//String  für die Information der anderen Spieler
			var figur_move = 'sperrstein:'+y_neu+","+x_neu;
			
			//wenn die SpielerNr gleich der Anzahl der Spieler in diesem Spiel ist
			if(spielerNr == anzahlSpieler)
			{
				//wird der Token auf 0 gesetzt
				token = 0;
			}
			//der Token wird erhöht
			token++;
			
			//Und die anderen Spieler über die änderung informiert
			var tokenmsg = new Object();
			tokenmsg.typ = "game";
			tokenmsg.spiel = aktuellesGame;
			tokenmsg.sender = spielerNr;
			tokenmsg.anzahlSpieler = anzahlSpieler;
			tokenmsg.message = figur_move;
			tokenmsg.token = token;
			netzwerk.send(tokenmsg);
		}
		
		//Funktion zum Prüfen ob Spieler dran ist um dann Würfel ein bzw. aus zu blenden
		var spielerdran = function(){
			if(aktuellesSpiel.dran())
			{
				$("#wuerfelanz").style.display = "block";
			}
			else
			{
				$("#wuerfelanz").style.display = "none";
			}
		}
		
		//Funktion um zu Prüfen ob der Spieler drann ist
		this.dran = function(){
			if(token == spielerNr)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
		//Prüfung ob der übergebene Stein ein eigener Stein ist
		this.eigenerStein = function(nr){
			if(spielerNr == nr)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		var temp;
		//Funktion zum Auslesen der empfangenen Spielfeld änderungen
		this.setNetzwek = function(msg)
		{
			//auslesen der Infos
			var Game = msg["spiel"];
			
			
			
			if(Game == aktuellesGame)
			{
				var spielerNr = msg["sender"];
				var anzahlSpieler = msg["anzahlSpieler"];
				var figur_move = msg["message"].split("|");
				token = msg["token"];
				
				//Auslesen des ersten Spielfeld änderung
				var ids = figur_move[0].split(":");
				
				//Wenn die erste Stelle ein Sperrstein ist
				if(ids[0] != "sperrstein")
				{
					//Wird die ID des ersten Spielersteins und das Objekt ausgelesen
					var id_alt = ids[0].split(",");
					var y_alt = id_alt[0];
					var x_alt = id_alt[1];
					var obj_alt = spielfeld.getObj(y_alt, x_alt);
				}
				
				//Die ID und das Objekt der neuen Position wird ausgelesen
				var id_neu = ids[1].split(",");
				var y_neu = id_neu[0];
				var x_neu = id_neu[1];
				var obj_neu = spielfeld.getObj(y_neu, x_neu);
				var obj_all = 0;
				
				//wenn die neue Position ein Kind hat	
				if(obj_neu.getKind() !== false)
				{
					//und das Kind ein Spielerstein oder ein Sperrstein ist
					if(obj_neu.getKind().getStatus() <= 5)
					{
						//wenn das Kind ein Spielerstein ist
						if(obj_neu.getKind().getStatus() == 5)
						{
							//wird der Sperrstein in eine Temporäre Variable gespeichert
							temp = obj_neu.getKind();
							//und das Kind entfernt
							obj_neu.removeKind();
						}
						else
						{
							//Wenn es ein Spielerstein ist wir die zweite Stelle ausgelsen in der sich die Anweisung 
							//zum verschieben des gegenerischen Steins in das Haus befindet
							var ids_2 = figur_move[1].split(":");
							var id_alt_2 = ids_2[0].split(",");
							var y_alt_2 = id_alt_2[0];
							var x_alt_2 = id_alt_2[1];
							var obj_alt_2 = spielfeld.getObj(y_alt_2, x_alt_2);
							
							var id_neu_2 = ids_2[1].split(",");
							var y_neu_2 = id_neu_2[0];
							var x_neu_2 = id_neu_2[1];
							var obj_neu_2 = spielfeld.getObj(y_neu_2, x_neu_2);
							var obj_all = 0;
							
							//Verschieben des gegnerischen Steins ins Haus
							obj_neu_2.setKind(obj_alt_2.getKind());
							obj_alt_2.removeKind();
						}
					}
				}	
						
				if(ids[0] != "sperrstein")
				{
					//verschieben des Steines wenn kein Sperrstein betroffen ist
					obj_neu.setKind(obj_alt.getKind());
					obj_alt.removeKind();
				}
				else
				{
					//verschiben des Sperrsteins
					obj_neu.setKind(temp);
					temp = "";
				}
				spielerdran();
			}
		}
	}
	};