import React from "react";

const Stats = props => {
    const {turn, currentScore, currentTime, withdrawals} = props;
    //
    // let avarageTime =currentTime.minutes /turn +":"+currentTime.secondes
    return (
        <div>
            <p>
                TURN NUMBER:{turn} || SCORE: {currentScore} || WITHDRAWALS:{withdrawals} || AVERAGE:{}
            </p>
        </div>
    );
};
export default Stats;
