"use client";

const { useReducer, useCallback, useEffect, useMemo } = require("react");

const useGameReducer = (props) => {
    const { players } = props;

    const gameReducer = useCallback((state, action) => {
        const newState = { ...state };

        switch (action.type) {
            case "ADD": {
                const { receiver, player, value } = action.payload;

                if (newState[receiver].deductions[`${player}-${value}`]) {
                    console.log(
                        newState[receiver].deductions[`${player}-${value}`]
                    );
                    delete newState[receiver].deductions[`${player}-${value}`];
                } else {
                    newState[receiver].additions = {
                        ...newState[receiver].additions,
                    };
                    newState[receiver].additions[`${player}-${value}`] = value;
                }

                const addSum = Object.values(
                    newState[receiver].additions
                ).reduce((acc, cur) => (acc += cur), 0);
                const dedSum = Object.values(
                    newState[receiver].deductions
                ).reduce((acc, cur) => (acc += cur), 0);

                newState[receiver].score = addSum - dedSum;
                const record_id = `${player}-${value}-${receiver}`;
                const index = newState._log.findIndex(
                    ({ id }) => id === record_id
                );

                if (index < 0)
                    newState._log = [
                        ...newState._log,
                        {
                            id: record_id,
                            receiver,
                            player,
                            value,
                            add: true,
                        },
                    ];
                else newState._log.splice(index, 1);
                break;
            }

            case "DEDUCT": {
                const { receiver, player, value } = action.payload;

                if (newState[receiver].additions[`${player}-${value}`]) {
                    delete newState[receiver].additions[`${player}-${value}`];
                } else {
                    newState[receiver].deductions = {
                        ...newState[receiver].deductions,
                    };
                    newState[receiver].deductions[`${player}-${value}`] = value;
                }

                const addSum = Object.values(
                    newState[receiver].additions
                ).reduce((acc, cur) => (acc += cur), 0);
                const dedSum = Object.values(
                    newState[receiver].deductions
                ).reduce((acc, cur) => (acc += cur), 0);

                newState[receiver].score = addSum - dedSum;
                const record_id = `${player}-${value}-${receiver}`;
                const index = newState._log.findIndex(
                    ({ id }) => id === record_id
                );

                if (index < 0)
                    newState._log = [
                        ...newState._log,
                        {
                            id: record_id,
                            receiver,
                            player,
                            value,
                            add: false,
                        },
                    ];
                else newState._log.splice(index, 1);
                break;
            }
        }

        let places = Object.keys(newState)
            .filter((key) => !key.startsWith("_"))
            .map((key) => ({ name: key, score: newState[key].score }))
            .sort((a, b) => (a.score <= b.score ? 1 : -1));

        if (places[0].score > places[1].score) newState._winner = places[0];
        else newState._winner = null;

        return newState;
    }, []);

    const baseState = useMemo(
        () => ({
            score: 0,
            additions: {},
            deductions: {},
        }),
        []
    );

    const initState = players.reduce(
        (accum, curr) => {
            accum[curr] = { ...baseState };
            return accum;
        },
        { _log: [], _winner: null }
    );

    return useReducer(gameReducer, initState);
};

export default useGameReducer;
