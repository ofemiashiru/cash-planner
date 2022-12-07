import React, {useEffect, useState} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faPiggyBank, faCashRegister, faXmark, faChartPie, faCalendarDays, faUser} from '@fortawesome/free-solid-svg-icons';

import Breakdown from "./Breakdown";
import CurrencyChanger from "./CurrencyChanger";
import CalendarPlan from "./CalendarPlan";

function Dashboard(props){

  const [backendData, setBackendData] = useState([{}]);

  const [incomeInput, setIncomeInput] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [itemAmountInput, setItemAmountInput] = useState("");

  const [clicked, setClicked] = useState(false);

  useEffect(()=>{
    fetch("/api/dashboard")
    .then(response => response.json())
    .then(data => {setBackendData(data)})
  },[]); /*, [] stops the useEffect making more than one request*/

  //CHANGE THE USERS CURRENCY
  const locale = typeof backendData.fiatLocale === "undefined"?"en-GB":backendData.fiatLocale; //brings back user currency locale
  const option = typeof backendData.fiatOption === "undefined"?"GBP":backendData.fiatOption; //brings back user currency option

  function currency(value){
    return new Intl.NumberFormat(locale, { style: 'currency', currency: option}).format(value)
  }

  ////CHECK IF NUMBER IS ENTERED//////
  function isCorrectFormat(e){
    const re =  /^(\d{0,9})[.]?(\d?)(\d?)$/g
    if (e.target.value === '' || re.test(e.target.value)) {

      if(e.target.name === "monthlyIncome"){
        setIncomeInput(e.target.value)
      } else if(e.target.name === "itemAmount")
        setItemAmountInput(e.target.value)
    }
  }

  function handleItemInput(e){
    setItemInput(e.target.value);
  }

  //Submit form onBlur - when user focuses outside of textbox
  function submitIncome() {
    let input = document.querySelector(".input-income");
    if(input.value){
      document.querySelector(".income-form").submit();
    }
  }

  //Check if in green or in red
  function inGreen(){
    const difference =
      typeof backendData.income && backendData.monthlyspend === "undefined"?
      0:backendData.income - backendData.monthlyspend

    const result = difference > 0?true:false
    return result
  }

  /////SUBMIT FORM TO DELETE EACH ITEM
  function handleItemDelete(){
    document.querySelector(".budget-list").submit();
  }

  ///SHOW CALENDAR /////////
  function showCalendar(){
    if(clicked === false){
      setClicked(true)
    } else {
      setClicked(false)
    }
    return clicked
  }

  return (
    <>
      <div id='center' className="main">

        <div className="left-side-dash">
        </div>

        <div className="mainInner full-page">
          <div>
            <CurrencyChanger info={backendData} />
            <h1><FontAwesomeIcon icon={faChartPie}/> Dashboard</h1>
            <span><FontAwesomeIcon icon={faUser} /> {typeof backendData.username === "undefined"?"":backendData.username}</span>
          </div>

          <Breakdown info={backendData} />
          <h2 className="calendar-link" onClick={showCalendar}>
            <FontAwesomeIcon icon={faCalendarDays}/> Calendar Plan {!clicked?<span className="carets">&#9660;</span>:<span className="carets">&#9650;</span>}
          </h2>
          <CalendarPlan info={backendData} locale={locale} option={option} doShow={clicked} />

          <div className="cash-container">
            <div className="cash-item">
              {/*INCOME*/}
              <FontAwesomeIcon icon={faMoneyBill} title="Income" />

              {(typeof backendData.income === "undefined")?
                (<p>Loading...</p>):
                <div>{currency(backendData.income)}</div>
              }
            </div>

            <div className="cash-item">
              {/*MONTHLYSPEND*/}
              <FontAwesomeIcon icon={faCashRegister} title="Spend"/>

              {(typeof backendData.monthlyspend === "undefined")?
                (<p>Loading...</p>):
                <div>{currency(backendData.monthlyspend)}</div>
              }
            </div>

            <div className="cash-item">
              {/*DIFFERENCE*/}
              <FontAwesomeIcon className={inGreen()?"in-the-green":"in-the-red"} icon={faPiggyBank} title={inGreen()?"Saving":"Debt"}/>

              {(typeof backendData.income && backendData.monthlyspend === "undefined")?
                (<p>Loading...</p>):
                <div className={inGreen()?"in-the-green":"in-the-red"}>{currency(backendData.income - backendData.monthlyspend)}</div>
              }
            </div>
          </div>

          {/*UPDATE INCOME*/}
          <h2><FontAwesomeIcon icon={faMoneyBill}/> Monthly Income</h2>
          <form className="income-form" action="/api/update-income" method="post">
            <div className="form-group">
              <input className="input-income" type="text" onBlur={submitIncome} placeholder="Monthly Income" onChange={isCorrectFormat} value={incomeInput}  name="monthlyIncome" autoComplete="off" required/>
            </div>
          </form>

          {/*ADD ITEM TO LIST*/}
          <h2><FontAwesomeIcon icon={faCashRegister}/> Add Items</h2>
          <form className="list-form" action="/api/dashboard" method="post">
            <div className="form-group">
              <input type="text" placeholder="Item" name="item" autoComplete="off" onChange={handleItemInput} required/>
            </div>
            <div className="form-group">
              <input className="input-income" type="text" placeholder="Amount" onChange={isCorrectFormat} value={itemAmountInput} name="itemAmount" autoComplete="off" required/>
            </div>

            <div className="form-group">
              <button type="submit"
                className={
                            !itemInput?"link-buttons add-button disable-link-buttons":
                            !itemAmountInput?"link-buttons add-button disable-link-buttons":"link-buttons add-button"
                          }
                disabled={
                            !itemInput?true:
                            !itemAmountInput?true:false
                          }>
                          Add Item
              </button>
            </div>
            <div>
              <p>
                {
                  !itemInput?"Input an item":
                  !itemAmountInput?"Input an amount":"You can now add your item"
                }
              </p>
            </div>
          </form>


          {/*BUDGET LIST*/}
          <form className="budget-list" action="/api/delete-item" method="post">
            <div className="budget-item">
              <div className=""></div>
              <div className="item-name item-heading">Item</div>
              <div className="item-amount item-heading">Amount</div>
            </div>
            {(typeof backendData.budget === "undefined")?
              (<p>Loading...</p>):
              <>
                {
                  backendData.budget.map((each)=>{
                    return (
                      <div key={each.id} className="budget-item budget-over">
                        <div className="item-delete">
                          <button onClick={handleItemDelete} name="item_id" value={each.id}><FontAwesomeIcon icon={faXmark} title={`Remove ${each.item}`} /></button>
                        </div>
                        <div className="item-name">{each.item}</div>
                        <div className="item-amount">{currency(each.amount)}</div>
                      </div>
                    )
                  })
                }
              </>
            }
          </form>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
