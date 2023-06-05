"use client";

import { useCallback, useContext, useRef } from "react";
import Card from "./components/Card";
import LogDisplay from "./components/LogDisplay";
// import { TITLE, GAME_QUESTIONS, PLAYERS } from "./game-data-2.js";
import useGameReducer from "./useGameReducer";
import GameContextProvider, { GameContext } from "./store/game-context";

export default function Home() {
    const { TITLE, PLAYERS, GAME_QUESTIONS } = useContext(GameContext);

    const [state, dispatch] = useGameReducer({ players: PLAYERS });
    const logRootRef = useRef(null);

    const handleAdd = useCallback(
        (receiver, player, value) =>
            dispatch({ type: "ADD", payload: { player, receiver, value } }),
        [dispatch]
    );

    const handleDeduct = useCallback(
        (receiver, player, value) =>
            dispatch({ type: "DEDUCT", payload: { player, receiver, value } }),
        [dispatch]
    );

    return (
        <GameContextProvider>
            <main className='h-screen w-full flex flex-col items-stretch '>
                <section className='heading w-full flex flex-center mt-12'>
                    <h1 className='text-2xl'>{TITLE}</h1>
                </section>

                <section
                    id='gameboard-root'
                    className='relative w-full h-full p-12 pt-16 flex flex-row justify-between gap-4'
                >
                    {Object.keys(GAME_QUESTIONS).map((player, i) => (
                        <div
                            className='player_column h-full flex flex-col grow gap-4 w-32'
                            key={i}
                        >
                            <h2 className='player_title font-thin h-[3rem] text sm:text-[.67em] md:text-[.8em] lg:text-[1em]'>
                                {player}
                            </h2>

                            {GAME_QUESTIONS[player].questions.map(
                                ([question, answer], i) => (
                                    <Card
                                        key={i}
                                        player={player}
                                        question={question}
                                        answer={answer}
                                        value={(i + 1) * 100}
                                        onAdd={handleAdd}
                                        onDeduct={handleDeduct}
                                    />
                                )
                            )}
                        </div>
                    ))}
                </section>

                <section
                    id='scoreboard-root'
                    className='w-full flex flex-row justify-center gap-4 pb-10 px-12'
                >
                    {PLAYERS.map((player, i) => (
                        <div
                            key={`player-column-${i}`}
                            className='player_score flex flex-col max-w-[12rem] gap-2'
                        >
                            <input
                                id={`${player}-score`}
                                className='mt-auto text w-full text-center text-xl py-8 px-2 bg-transparent rounded border border-[#fff3]'
                                style={{
                                    borderColor:
                                        state._winner?.name === player
                                            ? "hsla(55, 57.90%, 70.20%, 0.73)"
                                            : "",
                                }}
                                defaultValue={
                                    state[player].score < 0
                                        ? `-$${state[player].score * -1}`
                                        : `$${state[player].score}`
                                }
                                disabled
                            />
                            <h2
                                className='player_subtitle text text-sm text-center text-[#fff8] font-thin'
                                style={{
                                    color:
                                        state._winner?.name === player
                                            ? "hsla(55, 58.60%, 50.80%, 0.84)"
                                            : "",
                                }}
                            >
                                {player}
                            </h2>
                        </div>
                    ))}
                </section>

                <section
                    id='modal-root'
                    className='modal fixed top-0 left-0 h-screen w-full flex flex-center'
                ></section>

                <section
                    id='log-root'
                    className='fixed top-0 right-0 md:w-2/5 lg:w-3/8 xl:w-1/3 h-screen flex flex-col'
                    ref={logRootRef}
                >
                    <LogDisplay log={state._log} logRootRef={logRootRef} />
                </section>
            </main>
        </GameContextProvider>
    );
}
