import React from "react";

function CalendarPlan(props){

  //CurrencyChanger
  function currency(value){
    return new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.option}).format(value)
  }

  //Creating the Calendar
  const date = new Date();
  const numDate = date.getDate();
  const month = date.getMonth()+1;
  const year = date.getFullYear();


  const textDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  const textMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  function daysInMonth(year, month){
    return new Date(year, month, 0);
  }

  const daysInCurrentMonth = daysInMonth(year, month).getDate();
  let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  let firstDateOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDate();

  //Daily Calculations
  const saving = (props.info.income - props.info.monthlyspend);
  const remainder = saving % daysInCurrentMonth;
  let dailySaving = (saving - remainder)/daysInCurrentMonth;

  const dailyPlan = [];

  for(let i = 0; i < daysInCurrentMonth; i++){

    if(firstDateOfMonth === daysInCurrentMonth){
      dailySaving = dailySaving + remainder;
    }
    const cashOutput = currency(dailySaving);
    dailyPlan.push({date:firstDateOfMonth, day:textDays[firstDayOfMonth % textDays.length], save:cashOutput});
    firstDayOfMonth++
    firstDateOfMonth++
  }

  return(
    <div className={!props.doShow?"no-show":"calendar-page"}>
      <h2 className="calendar-month">{textMonths[month-1]}</h2>
      <div className="calendar-plan">
        {dailySaving < 0 ?
          <h3>No daily plan available</h3>:
          dailyPlan.map((each, i) =>
            <div key={i} name={each.date} className={each.date === numDate?"calender-box today":"calender-box"}>
              <p className="calendar-days">{each.date}. {each.day}</p>
              <p className="calendar-saved">{each.save}</p>
            </div>)
        }
      </div>


    </div>
  )
}


export default CalendarPlan;
