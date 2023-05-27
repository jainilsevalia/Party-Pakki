import React, { useState } from "react";

import { useRouter } from "next/router";
import { BiSearch } from "react-icons/bi";
import { CgCloseO } from "react-icons/cg";

const SearchAction = () => {
  const [openSearchInput, setOpenSearchInput] = useState(false);
  const [searchString, setSearchString] = useState("");

  const router = useRouter();
  return (
    <>
      {openSearchInput && (
        <div className="fixed bottom-[54px] w-full">
          <input
            type="text"
            placeholder="Search venues"
            className="input w-full focus:outline-none"
            autoFocus
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                router.push(`/search?q=${searchString}`);
              }
            }}
          ></input>
        </div>
      )}

      <label className="swap-rotate swap">
        <input
          type="checkbox"
          onClick={() => setOpenSearchInput(!openSearchInput)}
        />
        <BiSearch className="swap-off mb-[3px] fill-current" size={24} />
        <CgCloseO
          className={`swap-on fill-current ${
            openSearchInput ? "text-red-500" : ""
          }`}
          size={24}
        />
      </label>
    </>
  );
};

export default SearchAction;
