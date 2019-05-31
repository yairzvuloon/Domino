import React from "react";
let renderCount;
const Stats = props => {
    const {turn, currentScore, currentTime, withdrawals} = props;
    let average=0;

// todo: need to get props + isPiecePlaceOnBoard then:
//     if(isPiecePlaceOnBoard)
    if (turn !== 0) {
         average = Math.round(currentTime.minutes / turn) + ":" + Math.round(currentTime.secondes / turn);
    }



    return (
        <div>
            <p>
                TURN NUMBER:  {turn} || SCORE: {currentScore} || WITHDRAWALS:  {withdrawals} || AVERAGE TIME PER
                TURN  {average}
            </p>
        </div>
    );
};
export default Stats;
