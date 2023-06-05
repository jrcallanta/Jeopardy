"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Question from "./Question";

const Card = ({ question, answer, value, player, onAdd, onDeduct }) => {
    const [isQuestionDisplayed, setIsQuestionDisplayed] = useState(false);
    const [receiver, setReceiver] = useState(null);
    const [deductedSet, setDeductedSet] = useState(new Set());

    return (
        <div
            className='card h-24 flex flex-center'
            data-answered={!!receiver}
            onClick={() => setIsQuestionDisplayed(true)}
        >
            <h4
                className='card_value font-extralight text text-center'
                style={{
                    color: receiver ? "white" : "",
                    opacity: receiver ? ".75" : "",
                }}
            >
                {receiver ? receiver : `$ ${value}`}
            </h4>

            {isQuestionDisplayed &&
                createPortal(
                    <Question
                        data={{
                            question,
                            value,
                            answer,
                            player,
                            receiver,
                            deductedSet,
                        }}
                        handlers={{
                            onAdd,
                            onDeduct,
                            onClose: () => setIsQuestionDisplayed(false),
                            onSetReceiver: setReceiver,
                            onSetDeductedSet: setDeductedSet,
                        }}
                    />,
                    document.getElementById("modal-root")
                )}
        </div>
    );
};

export default Card;
