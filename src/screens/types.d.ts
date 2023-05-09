export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  // add other screens here
};

export interface IPlayer {
  name: string;
  score: number;
}

export interface PlayerScore {
  1: number;
  2: number;
  3: number;
}
