import { useRouter } from "next/router";
import { BiHome } from "react-icons/bi";

const HomeAction = () => {
  const router = useRouter();
  return (
    <div onClick={() => router.push("/")} className="mb-1">
      <BiHome
        size={24}
        className={router.pathname === "/" ? "text-sky-500" : ""}
      />
    </div>
  );
};

export default HomeAction;
