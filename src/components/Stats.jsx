import React from "react";

const Stats = props => {
  const { turn, currentScore, time } = props;
  let timer = 0;
  // todo: create timer that will start at begining of game and at the end of turn will update
  //
  return (
    <div>
      <p>
        TURN NUMBER:{turn} || SCORE: {currentScore}
      </p>
    </div>
  );
};
export default Stats;
