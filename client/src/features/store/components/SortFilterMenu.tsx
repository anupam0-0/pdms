import React from "react";
import FilterSelectMenu from "./FilterSelectMenu";

const SortFilterMenu = () => {
  return (
    <>
      <div className="w-full mb-4 ">
        <div className=" flex justify-between mx-auto ">
          <div></div>
          <div className="flex items-center gap-4">
            <p className="font-medium text-primary/90">Sort By:</p>
            <div>
              <FilterSelectMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortFilterMenu;
