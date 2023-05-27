import React, { useState } from "react";

import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";

const MoreAction = () => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div className="mb-[-4px]">
      <div className="dropdown dropdown-end dropdown-top">
        <label
          tabIndex={0}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        >
          <HiDotsVertical size={24} className={isFocus ? "text-red-500" : ""} />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-compact mb-4 w-52 bg-base-100 p-2 shadow"
          style={{ right: "-50px" }}
        >
          <li>
            <Link href={"/blogs"}>Blogs</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MoreAction;
