import React from "react";

const AccountBody = () => {
  let statsToRender = [
    { title: "Total Battles", value: "???" },
    { title: "Battles Won", value: "???" },
    { title: "Battles Lost", value: "???" },
    { title: "Highest Level Pokemon", value: "???" },

    { title: "Bank Account", value: "???" },
  ];

  return (
    <div className="bg-gray-200">
      <div className="statsContainer p-3 flax">
        {statsToRender.map((stat) => {
          return (
            <div className="flex justify-between w-full">
              <div>{stat.title}</div>
              <div>{stat.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountBody;
