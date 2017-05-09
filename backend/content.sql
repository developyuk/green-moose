--
-- File generated with SQLiteStudio v3.1.1 on Tue May 9 12:55:33 2017
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: content
CREATE TABLE content (
    id        INTEGER       PRIMARY KEY AUTOINCREMENT,
    title     VARCHAR (200) NOT NULL,
    author    VARCHAR (100),
    leadImage VARCHAR (200),
    content   TEXT          NOT NULL,
    excerpt   STRING,
    sourceId  INTEGER       REFERENCES source (id) 
);


-- Table: source
CREATE TABLE source (
    id          INTEGER       PRIMARY KEY AUTOINCREMENT,
    url         VARCHAR (200) UNIQUE
                              NOT NULL,
    dateFetched DATETIME      DEFAULT (datetime('now', 'localtime') ),
    domain      VARCHAR (100) 
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
