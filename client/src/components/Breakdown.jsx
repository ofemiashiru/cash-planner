import React from "react";
import { Chart } from "react-google-charts";


function Breakdown(props){

  //Taking props from Dashboard component
  const pieData = typeof props.info.budget === "undefined"?[]:props.info.budget.map((i)=> [i.item, +i.amount]);//+turns string to number
  const saving = props.info.income - props.info.monthlyspend;

  //Handle negative values as React Charts doesn't accept them
  //Also need to change headings based on Debt vs Saving
  const savingHeader = saving < 0? "Debt":"Saving";
  const handleNegative = saving < 0? saving * -1: saving;

  //This is for the Pie Chart information
  const data = [
    ["Item", "Amount"],
    ...pieData,
    [savingHeader, handleNegative]
  ];

  const lastHeading = data[data.length-1][0];

  const options = {
    chartArea: { left: 10, top: 30, right: 0, bottom: 50 },
    // legend: "none",
    // pieSliceText: "label",
    legend:"right",
    animation: {
      startup: true,
      easing: "in",
      duration: 15,
    },
    pieHole: 0.5
  };
  // [savingHeader ==="Saving"?"green":"red"]

  return(
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"95%"}
        height={"400px"}
      />
    </div>
  )
}

export default Breakdown;
