import React from "react";
import { secondsToTime } from "../utilities/Manager";
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: 0 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
    this.countUp = this.countUp.bind(this);
    this.displaySpecificTime = this.displaySpecificTime.bind(this);
    this.startTimer({ m: 0, s: 0 });
    this.transferDataToHome = props.sendCurrentTime;
  }

  stopInterval() {
    clearInterval(this.timer);
  }

  resetTimer() {
    this.stopInterval();
    this.timer = 0;
    this.startTimer({ minutes: 0, seconds: 0 });
    this.setState(() => ({ time: {}, seconds: 0 }));
  }

  startTimer(initialTime) {
    this.timer = initialTime.minutes * 60 + initialTime.seconds;
    this.timer = setInterval(this.countUp, 1000);
  }

  displaySpecificTime(time) {
    this.setState(prevState => {
      return {
        time: time,
        seconds: prevState.seconds
      };
    });
  }

  countUp() {
    this.setState(prevState => {
      return {
        time: secondsToTime(prevState.seconds),
        seconds: prevState.seconds + 1
      };
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isResetNeeded !== this.props.isResetNeeded &&
      this.props.isResetNeeded
    ) {
      this.resetTimer();
    } else if (!this.props.isGameRunning) {
      this.stopInterval();
      if (this.props.timeToDisplay !== prevProps.timeToDisplay) {
        this.displaySpecificTime({
          minutes: this.props.timeToDisplay.minutes,
          seconds: this.props.timeToDisplay.seconds
        });
      }
    }
  }
  render() {
    this.transferDataToHome(this.state.time.minutes, this.state.time.seconds);

    return (
      <div>
        minutes: {this.state.time.minutes} secondes: {this.state.time.seconds}
      </div>
    );
  }
}
export default Timer;
