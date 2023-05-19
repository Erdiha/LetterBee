export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  // add other screens here
};

export interface IPlayer {
  name: string;
  info: {
    date: string;
    score: number;
  }[];
}

export interface PlayerScore {
  1: number;
  2: number;
  3: number;
}

export interface IData {
  allGuesses: string[][];
  correctpos: React.MutableRefObject<number>;
  guess: string[];
  setGuess: React.Dispatch<React.SetStateAction<string[]>>;
  row: number;
  setRow: React.Dispatch<React.SetStateAction<number>>;
  col: number;
  setCol: React.Dispatch<React.SetStateAction<number>>;
  foundTheWord: boolean;
  setFoundTheWord: React.Dispatch<React.SetStateAction<boolean>>;
  attempt: number;
  setAttempt: React.Dispatch<React.SetStateAction<number>>;
  roundCount: React.MutableRefObject<number>;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  info: string;
  setInfo: React.Dispatch<React.SetStateAction<string>>;
  playerScore: React.MutableRefObject<{ [key: number]: number }>;
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
  roundIsOver: boolean;
  setRoundIsOver: React.Dispatch<React.SetStateAction<boolean>>;
  giveup: boolean;
  setGiveup: React.Dispatch<React.SetStateAction<boolean>>;
  giveUpPoints: React.MutableRefObject<number>;
  validWords: any;
  secretWord: any;
  setSecretWord: React.Dispatch<React.SetStateAction<any>>;
  gameOver: boolean;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  score: React.MutableRefObject<number>;
  setAllGuesses: React.Dispatch<React.SetStateAction<string[][]>>;
  playerScore: React.MutableRefObject<{ playerScore: any }>;

  setPlayerScore: React.Dispatch<React.SetStateAction<PlayerScore>>;
}
