"use client";

import { useState, useEffect, useRef } from "react";

const LogDisplay = ({ log, logRootRef }) => {
    const iconRef = useRef(null);
    const [isDisplayed, setisDisplayed] = useState(false);

    useEffect(() => {
        const target = iconRef.current;

        if (target) {
            const handleMouseEnter = () => {
                setisDisplayed(true);
                logRootRef.current?.addEventListener(
                    "mouseleave",
                    () => {
                        setisDisplayed(false);
                    },
                    { once: true }
                );
            };

            target.addEventListener("mouseenter", handleMouseEnter);

            return () =>
                target.removeEventListener("mouseenter", handleMouseEnter);
        }
    }, [iconRef]);

    return (
        <div className='log pt-12 h-full flex flex-col items-end gap-6'>
            <div
                className='icon bg-[#fff2] rounded-full p-1 mr-12 transition hover:bg-[#fff5]'
                ref={iconRef}
                onClick={() => setisDisplayed((prev) => !prev)}
            >
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
                        d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                    />
                </svg>
            </div>

            <h2
                className='w-full mb-1 text text-center text-xl text-bold'
                data-displayed={isDisplayed}
            >
                Point Log
            </h2>

            <div
                className='log_records w-full h-full overflow-hidden overflow-y-scroll pb-10 flex flex-col items-stretch'
                data-displayed={isDisplayed}
            >
                {log.map(({ player, value, receiver, add }, i) => (
                    <div
                        key={`record_${i}`}
                        className={`record px-12 py-1 w-full hover:bg-[var(--clr-bg)] text-[var(--clr)]`}
                        style={{
                            "--clr": add ? "#229a44" : "#ce4242",
                            "--clr-bg": add
                                ? "hsla(137, 63.80%, 36.90%, 0.33)"
                                : "hsla(0, 58.80%, 53.30%, 0.28)",
                            marginTop:
                                i > 0 &&
                                `${log[i].player}-${log[i].value}` !==
                                    `${log[i - 1].player}-${log[i - 1].value}`
                                    ? "2rem"
                                    : "",
                        }}
                    >
                        <p
                            className={`w-full flex gap-3 text text-xs font-extralight`}
                        >
                            <span>{`[${player}-${value}]`}</span>
                            <span>{receiver}</span>
                            <span className='ml-auto'>{` ${
                                add ? "+" : "-"
                            }$${value}`}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogDisplay;
