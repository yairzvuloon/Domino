import React from "react";

const Stats = props => {
  const {
    turn,
    currentScore,
    currentTime,
    lastPieceTime,
    withdrawals,
    isPiecePlaceOnBoard
  } = props;

  const secondsToTime = secs => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
    return obj;
  };

  let average = { hours: 0, minutes: 0, seconds: 0 };
  if (turn != 0) {
    let seconds = lastPieceTime.minutes * 60 + lastPieceTime.seconds;
    let averageInSecondsFormat = seconds / turn;
    average = secondsToTime(averageInSecondsFormat);
  }
  return (
    <div>
      <p>
        TURN NUMBER: {turn} || SCORE: {currentScore} || WITHDRAWALS:{" "}
        {withdrawals} || AVERAGE TIME PER TURN: {average.minutes}:
        {average.seconds}
      </p>
    </div>
  );
};
export default Stats;
