/**
 * Etichette in italiano per i temi dei puzzle (tag del Lichess Puzzle Database, CC0).
 * I tag "meta" (lunghezza, fase di partita, livello dei giocatori) sono separati dai
 * temi tattici veri e propri: servono solo come info aggiuntiva, non come "il tema".
 */
export const THEME_LABELS: Record<string, string> = {
  fork: "Forchetta",
  pin: "Inchiodatura",
  skewer: "Infilata",
  discoveredAttack: "Attacco di scoperta",
  doubleCheck: "Doppio scacco",
  sacrifice: "Sacrificio",
  deflection: "Deviazione",
  attraction: "Attrazione",
  clearance: "Sgombero",
  interference: "Interferenza",
  intermezzo: "Intermezzo",
  zwischenzug: "Intermezzo",
  quietMove: "Mossa silenziosa",
  defensiveMove: "Mossa difensiva",
  xRayAttack: "Attacco a raggi X",
  trappedPiece: "Pezzo in trappola",
  hangingPiece: "Pezzo in presa",
  mateIn1: "Matto in 1",
  mateIn2: "Matto in 2",
  mateIn3: "Matto in 3",
  mateIn4: "Matto in 4",
  mateIn5: "Matto in 5",
  backRankMate: "Matto di corridoio",
  smotheredMate: "Matto soffocato",
  anastasiaMate: "Matto di Anastasia",
  arabianMate: "Matto arabo",
  bodenMate: "Matto di Boden",
  doubleBishopMate: "Matto dei due alfieri",
  dovetailMate: "Matto a coda di rondine",
  hookMate: "Matto ad amo",
  killBoxMate: "Matto a tenaglia",
  vukovicMate: "Matto di Vukovic",
  exposedKing: "Re scoperto",
  enPassant: "Presa en passant",
  promotion: "Promozione",
  underPromotion: "Sottopromozione",
  advancedPawn: "Pedone avanzato",
  attackingF2F7: "Attacco su f2/f7",
  capturingDefender: "Eliminazione del difensore",
  castling: "Arrocco",
  crushing: "Vantaggio decisivo",
  equality: "Pareggio della posizione",
  mate: "Matto forzato",
  discoveredCheck: "Scacco di scoperta",
  kingsideAttack: "Attacco sul lato di Re",
  queensideAttack: "Attacco sul lato di Donna",
  zugzwang: "Zugzwang",
  balestraMate: "Matto della balestra",
  blindSwineMate: "Matto dei maiali ciechi",
  cornerMate: "Matto d'angolo",
  epauletteMate: "Matto a spallina",
  morphysMate: "Matto di Morphy",
  operaMate: "Matto dell'opera",
  pillsburysMate: "Matto di Pillsbury",
  swallowstailMate: "Matto a coda di rondine",
  triangleMate: "Matto del triangolo",
  collinearMove: "Mossa in linea",
};

/** Tag "meta": non descrivono un'idea tattica, quindi non vanno usati come "il tema" del puzzle. */
export const META_THEMES = new Set([
  "oneMove",
  "short",
  "long",
  "veryLong",
  "master",
  "masterVsMaster",
  "superGM",
  "opening",
  "middlegame",
  "endgame",
  "pawnEndgame",
  "rookEndgame",
  "bishopEndgame",
  "knightEndgame",
  "queenEndgame",
  "queenRookEndgame",
  "advantage",
  "crushing",
  "equality",
]);

export function themeLabel(tag: string): string {
  return THEME_LABELS[tag] ?? tag;
}

/** Il primo tag tattico "vero" (non meta) della lista, o il primo in assoluto se non ce ne sono. */
export function primaryTheme(themes: string[]): string | null {
  const tactical = themes.find((t) => !META_THEMES.has(t));
  return tactical ?? themes[0] ?? null;
}
