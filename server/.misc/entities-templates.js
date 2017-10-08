/*
    unixtimestamp oznacza (new Date()).getTime(), który zrwaca czas w milisekundach, ale to jak najbardziej OK
*/
var player = {
    name: null,             // Nazwa gracza string
    socketId: null,         // Identyfikator połączenia string
    connected: false,       // Czy połączony? true|false
    connectedAt: null,      // Kiedy połączony? unixtimestamp
    points: 0,              // Zebrane punkty? int
    currentGame: null,      // Obecnie rozgrywana gra int|null
    currentOpponent: null,  // Obecny przeciwnik int|null
    currentMatch: null,     // Obecny mecz int|null
    deadline: null,         // Nieprzekraczalny próg na wykonanie kolejnego ruchu unixtimestamp
    games: [],              // Rozegrane/rozgrywane gry int[]
    matches: [],            // Rozegrane/rozgrywane mecze int[]
    opponents: []           // Lista identyfikatorow przeciwnikow int[]
};
var game = {
    white: null,        // Identyfikator pierwszego gracza int
    black: null,        // Identyfikator drugiego gracza int
    winner: null,       // Identyfikator zwyciescy int
    loser: null,        // Identyfikator przegranego int
    isFinished: false,  // Czy gra jest zakończona? true|false
    startedAt: null,    // Czas rozpoczecia gry unixtimestamp
    finishedAt: null,   // Czas skończenia gry unixtimestamp
    duration: null,     // Sumaryczny czas gry
    state: null,        // Obecny stan gry (np. plansza) object
    moves: []           // Lista wykonanych w grze ruchow int[]
};
var match = {
    red: null,          // Identyfikator pierwszego gracza, z innym kluczem, żeby odróżnić od gry int
    blue: null,         // Identyfikator drugiego gracza, z innym kluczem, żeby odróżnić od gry int
    redPoints: 0,       // Punkty gracza czerwonego int
    bluePoints: 0,      // Punkty gracza niebieskiego int
    isFinished: false,  // Czy mecz jest zakończony? true|false
    startedAt: null,    // Czas rozpoczecia meczu unixtimestamp
    finishedAt: null,   // Czas skończenia meczu unixtimestamp
    duration: null,     // Sumaryczny czas meczu
    games: []           // Lista gier w meczu int[]
};
var round = {
    startedAt: null,    // Czas rozpoczecia rundy unixtimestamp
    finishedAt: null,   // Czas skończenia rundy unixtimestamp
    duration: null,     // Sumaryczny rundy meczu
    matches: []         // Lista meczy w rundzie int[]
};
var tournament = {
    type: null,                     // Typ turnieju round-robin|swiss
    additionalRounds: null,         // Dodatkowe rundy dla systemu szwajcarskiego int
    timeLimit: null,                // Czas na ruch w milisekundach int
    numberOfGamesInSingleMatch: 30, // Liczba gier w pojedynczym meczu int
    rounds: []                      // Lista rund turnieju int[]
};
