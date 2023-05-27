import { useRouter } from "next/router";

import { HOME } from "../paths";
import HomeAction from "./mobile-footer-actions/HomeAction";
import MoreAction from "./mobile-footer-actions/MoreAction";
import SearchAction from "./mobile-footer-actions/SearchAction";

const MobileFooter = () => {
  const router = useRouter();
  const path = router.pathname;

  const renderActions = () => {
    switch (path) {
      case HOME:
        return (
          <>
            <HomeAction />
            <MoreAction />
          </>
        );
      default:
        return (
          <>
            <HomeAction />
            <SearchAction />
            <MoreAction />
          </>
        );
    }
  };
  return (
    <nav>
      <div
        className="fixed bottom-0 z-20 w-full bg-base-100 px-3 py-4"
        style={{ boxShadow: "rgba(0,0,0,0.1) 0px -4px 15px -3px" }}
      >
        <div className="flex items-center justify-around">
          {renderActions()}
        </div>
      </div>
    </nav>
  );
};

export default MobileFooter;
