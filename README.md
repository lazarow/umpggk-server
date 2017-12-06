# Serwer zawodów z serii UMPGGK

Uczelniane Mistrzostwa Programów Grających w gry Kombinatoryczne są cyklicznym konkursem
rozgrywanym w Instytucie Informatyki Uniwersytetu Śląskiego.
Niniejszy serwer służy do rozegrania gier turniejowych.

### Uruchomienie serwera

Do uruchomienia serwera należy zainstalować [node.js](https://nodejs.org/en/). W czasie testów korzystaliśmy
z najnowszej wersji 8.x.x.

Aby uruchomić serwer należy w pierwszej kolejności pobrać wymagane biblioteki przy pomocy narzędzia `npm`.
```
git clone https://github.com/lazarow/umpggk-server.git
cd umpggk-server/server
npm install
./node_modules/bower/bin/bower install // dla Windows: node ./node_modules/bower/bin/bower install
node server.js // uruchomienie serwera
```
Uruchomiony serwer działa na domyślnym porcie 6789, a aplikacja webowa służąca do startu turnieju oraz podglądu bieżących danych uruchamia się na domyślnym porcie 8000.

### Turniej

Turniej składa się z rund, których liczba wyliczana jest w zależności od liczby zawodników i systemu. Rundy
składają się z meczy, mecz składają się z gier. Wynik meczu określany jest na podstawie stosunku wygranych gier pomiędzy zawodnikami.

### Konfiguracja serwera

W ramach konfiguracji możliwe jest dostosowanie liczby gier w meczu, czasu na ruch oraz portów serwera. Konfiguracja znajduje się w pliku `config/default.json`.

### Protokół komunikacyjny

Protokół komunikacyjny oparty jest o standardowe gniazdka sieciowe, każda komenda wysyłana z lub do serwa powinna kończyć się znakiem nowej linii.

##### Żądania klient (wysyłają programy grające w turnieju)

100 [nazwa_gracza]	// Podłącz się jako gracz, nazwa gracza nie może zawierać białych znakow
210 [pozycja]		// Wyślij ruch, gdzie pozycja to wspolrzdne "X Y" (spacja w środku) liczone od lewego gornego rogu tj. punktu "1 1" do prawego dolnego "9 9"

##### Odpowiedzi serwera

200 [opis gry]		// Komunikat oznacza rozpoczęcie nowej gry, należy oczekiwać koloru gracza rozmiarow planszy: "white 9 9" oraz "black 9 9"
220 [pozycja]		// Nowa pozycja przeciwnika, serwer oczekuje na Twój ruch, zgodnie z pozycją wyzej
230					// Wygrałeś wg. zasad
231					// Wygrałeś przez przekroczenie czasu (przeciwnika)
232					// Wygrałeś przez rozłączenie się przeciwnika
240					// Przegrałeś wg. zasad
241					// Przegrałeś przez przekroczenie czasu
299 [miejsce]		// Koniec turnieju
999	[opis]			// Błąd komendy, opis powinien wyjaśnić przyczyne

### Start turnieju

Aby uruchomić turniej (po rejestracji zawodników) należy otworzyć aplikację webową w trybie administracyjnym. Standardowy adres aplikacji to [http://localhost:8000/?admin=](http://localhost:8000/?admin=).

Kilkając _Rozpocznij kolejną rundę_ zawody się rozpoczną, kolejne rundy będą uruchamiane automatycznie (można to zmienić w konfiguracji).

### Losowi gracze

Serwer posiada skrypt losowych graczy (można stworzyć ich dowolną liczbę), aby ich uruchomić należy posłużyć się następującą komendą:
```
cd umpggk-server/server
node test-clients.js {liczba losowych graczy}
```

### Edycja 2017

W 2017 gramy w grę NoGo, więcej informacji znajdziesz na [stronie](http://ii.us.edu.pl/umpggk2017/).
