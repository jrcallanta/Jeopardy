import { useState, useCallback, useContext } from "react";
import { GameContext } from "../store/game-context";

const Question = ({ data, handlers }) => {
    const { PLAYERS } = useContext(GameContext);

    const { question, answer, player, value, receiver, deductedSet } = data;
    const { onSetReceiver, onSetDeductedSet, onAdd, onDeduct, onClose } =
        handlers;

    const [isAnswerDisplayed, setIsAnswerDisplayed] = useState(false);
    const [isDeducting, setIsDeducting] = useState(true);

    const handlePlayerClick = useCallback(
        (playerClicked) => {
            if (!isDeducting) {
                if (deductedSet.has(playerClicked))
                    onSetDeductedSet((prev) => {
                        prev.delete(playerClicked);
                        onAdd(playerClicked, player, value);
                        return prev;
                    });

                onSetReceiver((prev) => {
                    if (!prev) {
                        onAdd(playerClicked, player, value);
                        return playerClicked;
                    } else if (prev === playerClicked) {
                        onDeduct(prev, player, value);
                        return null;
                    } else {
                        onDeduct(prev, player, value);
                        onAdd(playerClicked, player, value);
                        return playerClicked;
                    }
                });
            } else {
                if (playerClicked == receiver) {
                    onSetReceiver(null);
                    onDeduct(playerClicked, player, value);
                }

                onSetDeductedSet((prev) => {
                    if (prev.has(playerClicked)) {
                        prev.delete(playerClicked);
                        onAdd(playerClicked, player, value);
                    } else {
                        prev.add(playerClicked);
                        onDeduct(playerClicked, player, value);
                    }

                    return prev;
                });
            }
        },
        [isDeducting, deductedSet, onSetReceiver, onSetDeductedSet]
    );

    const handleCloseQuestion = (e) => {
        if (!receiver) setIsAnswerDisplayed(false);
        e.stopPropagation();
        onClose();
    };

    const handleToggleAnswerDisplay = () =>
        setIsAnswerDisplayed((prev) => !prev);

    const handleToggleIsDeducting = () => setIsDeducting((prev) => !prev);

    return (
        <div className='question flex flex-center flex-col justify-center rounded-full p-12 md:p-24 lg:p-32 gap-16'>
            <div className='container rounded  flex flex-col justify-center items-center p-8 md:p-24 md:pb-8 gap-16'>
                <button
                    className='fixed top-24 w-12 h-12 rounded-full close_icon flex flex-center border'
                    onClick={handleCloseQuestion}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-6 h-6'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>

                <p className='flex justify-center items-center gap-2 text text-md text-[#d3d156f0] p-2 rounded border-2 border-[#d3d156f0] text-center'>
                    <span className=''>{player}</span>
                    <span className=''>{`$${value}`}</span>
                </p>

                <h1 className='text text-3xl text-center'>{question}</h1>

                <h1
                    className={"text text-5xl text-center question_answer"}
                    style={{
                        opacity: isAnswerDisplayed ? "1" : "0",
                        filter: isAnswerDisplayed ? "blur(0rem" : "blur(1rem)",
                    }}
                >
                    {answer}
                </h1>
            </div>

            <div className='options flex gap-8'>
                <button
                    className='options_option'
                    onClick={handleToggleAnswerDisplay}
                >
                    {!isAnswerDisplayed ? "show answer" : "hide answer"}
                </button>
            </div>

            <div className='fixed bottom-8 w-full flex flex-center gap-8'>
                <button
                    className='w-12 h-12 flex flex-center border border-[#fff5] rounded-full'
                    onClick={handleToggleIsDeducting}
                >
                    {!isDeducting ? (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='1.5'
                            stroke='currentColor'
                            class='w-6 h-6'
                        >
                            <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                d='M12 4.5v15m7.5-7.5h-15'
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='1.5'
                            stroke='currentColor'
                            class='w-6 h-6'
                        >
                            <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                d='M19.5 12h-15'
                            />
                        </svg>
                    )}
                </button>

                {PLAYERS.filter((p) => p !== player).map((player, i) => (
                    <button
                        key={`player-${i}`}
                        className='bg-transparent player'
                        style={{
                            opacity: player == receiver ? "1" : "",
                            color:
                                player == receiver
                                    ? "green"
                                    : deductedSet.has(player)
                                    ? "red"
                                    : "",
                        }}
                        onClick={() => handlePlayerClick(player)}
                    >
                        {player}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Question;
