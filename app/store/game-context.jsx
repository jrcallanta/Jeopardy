"use client";

import { PLAYERS, GAME_QUESTIONS, TITLE } from "../sample-game-data";
import { createContext } from "react";

export const GameContext = createContext({
    TITLE,
    PLAYERS,
    GAME_QUESTIONS,
});

const GameContextProvider = ({ children }) => {
    return (
        <GameContext.Provider
            value={{
                TITLE,
                PLAYERS,
                GAME_QUESTIONS,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
