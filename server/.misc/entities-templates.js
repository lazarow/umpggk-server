var player = {
    {
        name: null, // Nazwa gracza string
        socketId: null, // Identyfikator połączenia string
        connected: false, // Czy połączony? true|false
        connectedAt: null, // Kiedy połączony? unixtimestamp
        points: 0, // Zebrane punkty? int
        currentGame: null, // Obecnie rozgrywana gra int|null
        games: [], // Rozegrane/rozgrywane gry int[]
        opponents: [] // Lista identyfikatorow przeciwnikow int[]
    }
};
var game = {
    {
        white: null, // Identyfikator pierwszego gracza int
        black: null, // Identyfikator drugiego gracza int
        winner: null, // Identyfikator zwyciescy int
        loser: null, // Identyfikator przegranego int
        isFinished: false, // Czy gra jest zakończona? true|false
        state: null, // Obecny stan gry object
        moves: [], // Lista wykonanych w grze ruchow object[]
    }
};
