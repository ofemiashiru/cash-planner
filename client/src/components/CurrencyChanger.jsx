import React from "react";

function CurrencyChanger(props){



  const allCurrency = typeof props.info.allFiatCurrency === "undefined"?[]:props.info.allFiatCurrency; //bring back all currencies
  const fiatChosen = typeof props.info.currencyID ==="undefined"?1:props.info.currencyID; //brings back ID of currency chosen

  function handleChangeCurrency(){
    document.querySelector(".currency-changer").submit();
  }

  return(
    <>
      {/*CURRENCY CHANGER*/}
      <form className="currency-changer" method="post" action="/api/change-currency">
        <select name="currency_id" onChange={handleChangeCurrency} value={fiatChosen}>
          {allCurrency.map(each => <option key={each.id} value={each.id}>{each.option}</option>)}
        </select>
      </form>
    </>
  )
}


export default CurrencyChanger;
