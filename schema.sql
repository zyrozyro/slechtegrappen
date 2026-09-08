CREATE TABLE IF NOT EXISTS jokes (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL
);

INSERT INTO jokes (text) VALUES
  ("Twee mannen beminden een vrouw, de een was doof en de ander was een dokter.<br>De dokter gaf de vrouw een roos, de dove gaf haar een appel.<br>De vrouw zei tegen de dove: dat de dokter mij een roos geeft snap ik; het is een symbolisch gebaar, maar wat betekent een appel?<br>Waarop de man reageerde: Wat?");