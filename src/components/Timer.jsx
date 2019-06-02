import React from "react";
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

  secondsToTime(secs) {
    //let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      //h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  stopInterval() {
    clearInterval(this.timer);
  }

  resetTimer() {
    this.stopInterval();
    this.timer = 0;
    this.startTimer({ m: 0, s: 0 });
    this.setState(() => ({ time: {}, seconds: 0 }));
  }

  startTimer(initialTime) {
    this.timer = initialTime.m * 60 + initialTime.s;
    this.timer = setInterval(this.countUp, 1000);
  }

  displaySpecificTime(time) {
    this.setState((prevState) => {
      return {
        time: time,
        seconds:prevState.seconds
      };
    });
  }

  countUp() {
    this.setState(prevState => {
      return {
        time: this.secondsToTime(prevState.seconds),
        seconds: prevState.seconds + 1
      };
    });
  }

  componentDidUpdate(prevProps) {
    console.log("im in componentDidUpdate");
    if (
      prevProps.isResetNeeded !== this.props.isResetNeeded &&
      this.props.isResetNeeded
    ) {
      this.resetTimer();

    } else if (!this.props.isGameRunning) {
      this.stopInterval();
      if (this.props.timeToDisplay !== prevProps.timeToDisplay) {
        this.displaySpecificTime({
         // h: 0,
          m: this.props.timeToDisplay.minutes,
          s: this.props.timeToDisplay.seconds
        });
      }
    }
  }
  render() {
    this.transferDataToHome(this.state.time.m, this.state.time.s);

    return (
      <div>
        minutes: {this.state.time.m} secondes: {this.state.time.s}
      </div>
    );
  }
}
export default Timer;
