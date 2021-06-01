import React, { ReactNode } from "react";
import Countdown, { CountdownApi } from "react-countdown";
import { useInterval } from "react-use";
import moment, { Moment } from "moment";

export const CountdownComponent = (props: {
  UUID: string;
  createdAt: string;
  rawTime: number;
  rawUnits: string;
  endsAt: string;
  paused: boolean;
  childLock: boolean;
  orientation?: boolean;
  children?: ReactNode;
}) => {
  const [endingTime, setEndingTime] = React.useState<Moment>(
    moment(props.endsAt)
  );

  useInterval(() => {
    if (props.paused) {
      fetch(
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/update" // REPLACE WITH YOUR URL
          : "https://timerr.vercel.app/api/update",
        {
          method: "POST",
          body: JSON.stringify({
            uuid: props.UUID,
            endsAt: moment(endingTime).add(1.01, "s"),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() => setEndingTime(moment(endingTime).add(1.01, "s")));
    }
  }, 1000);

  const [countdownApi, setCountdownApi] = React.useState<CountdownApi | null>(
    null
  );
  const state: { date: string } = {
    date: props.endsAt,
  };
  const [isRestarting, setRestarting] = React.useState<boolean>(false);
  const [isCompleted] = React.useState<boolean | null>(
    countdownApi ? countdownApi.isCompleted() : null
  );

  if (props.paused && countdownApi) {
    countdownApi.pause();
  } else if (!props.paused && countdownApi) {
    countdownApi.start();
  }

  const handlePauseClick = (): void => {
    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/pause" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/pause",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.UUID,
          pausedState: !props.paused,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const handleResetClick = (): void => {
    setRestarting(true);

    fetch(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/reset" // REPLACE WITH YOUR URL
        : "https://timerr.vercel.app/api/reset",
      {
        method: "POST",
        body: JSON.stringify({
          uuid: props.UUID,
          createdAt: props.createdAt,
          endsAt: props.endsAt,
          rawTime: props.rawTime,
          rawUnits: props.rawUnits,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(() => window.location.reload());
  };

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      setCountdownApi(countdown.getApi());
    }
  };

  return (
    <section
      className={
        (props.orientation ? "2xl:space-y-4 xl:space-y-3 lg:space-y-2" : null) +
        " flex flex-col"
      }
    >
      <section className="flex justify-center items-center px-14">
        <p className="2xl:text-3xl xl:text-3xl lg:text-3xl text-lg">
          <Countdown key={state.date} ref={setRef} date={state.date} />
        </p>
      </section>
      {props.orientation ? (
        <>
          {" "}
          {!props.childLock ? (
            <section className="border-t border-gray-100 flex flex-row justify-around pt-2 px-14">
              {props.paused ? (
                <button
                  className="focus:outline-none inline-flex items-center text-red-500 duration-200 transition-colors hover:text-red-600"
                  type="button"
                  onClick={handlePauseClick}
                  disabled={isCompleted}
                >
                  <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="focus:outline-none inline-flex items-center justify-center text-red-500 duration-200 transition-colors hover:text-red-600"
                  type="button"
                  onClick={handlePauseClick}
                  disabled={isCompleted}
                >
                  <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.25 6.75V17.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.75 6.75V17.25"
                    />
                  </svg>
                </button>
              )}
              {isRestarting ? (
                <button className="focus:outline-none inline-flex items-center justify-center cursor-not-allowed text-gray-400 animate-spin">
                  <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.25 4.75L8.75 7L11.25 9.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12.75 19.25L15.25 17L12.75 14.75"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="focus:outline-none inline-flex items-center justify-center text-gray-500 duration-200 transition-colors hover:text-gray-400"
                  type="button"
                  onClick={handleResetClick}
                >
                  <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.25 4.75L8.75 7L11.25 9.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12.75 19.25L15.25 17L12.75 14.75"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                    />
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                    />
                  </svg>
                </button>
              )}
            </section>
          ) : null}{" "}
        </>
      ) : (
        <section className="flex flex-row justify-between pt-2 px-14">
          <div className="flex flex-row justify-center space-x-2">
            {props.paused ? (
              <button
                className="focus:outline-none inline-flex items-center text-red-500 duration-200 transition-colors hover:text-red-600"
                type="button"
                onClick={handlePauseClick}
                disabled={isCompleted}
              >
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.25 12L5.75 5.75V18.25L18.25 12Z"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="focus:outline-none inline-flex items-center justify-center text-red-500 duration-200 transition-colors hover:text-red-600"
                type="button"
                onClick={handlePauseClick}
                disabled={isCompleted}
              >
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.25 6.75V17.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.75 6.75V17.25"
                  />
                </svg>
              </button>
            )}
            {isRestarting ? (
              <button className="focus:outline-none inline-flex items-center justify-center cursor-not-allowed text-gray-400 animate-spin">
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.25 4.75L8.75 7L11.25 9.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12.75 19.25L15.25 17L12.75 14.75"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                  />
                </svg>
              </button>
            ) : (
              <button
                className="focus:outline-none inline-flex items-center justify-center text-gray-500 duration-200 transition-colors hover:text-gray-400"
                type="button"
                onClick={handleResetClick}
              >
                <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.25 4.75L8.75 7L11.25 9.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12.75 19.25L15.25 17L12.75 14.75"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 7H13.25C16.5637 7 19.25 9.68629 19.25 13V13.25"
                  />
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.25 17H10.75C7.43629 17 4.75 14.3137 4.75 11V10.75"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex flex-row justify-center space-x-2">
            {props.children}
          </div>
        </section>
      )}
    </section>
  );
};
