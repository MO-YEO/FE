import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Home from "../assets/home.svg";
import Member from "../assets/member.svg"; // 팀원 아이콘
import Project from "../assets/project.svg"; // 프로젝트 아이콘
import Board from "../assets/board.svg"; // 게시판 아이콘
import My from "../assets/my.svg";

export default function MobileLayout() {
  const location = useLocation();
  const hideFooterPaths = ["/onboarding", "/login"];

  const hideFooter = hideFooterPaths.includes(location.pathname);
  const footerMenu = [
    ["홈", "home", Home],
    ["팀원", "member", Member],
    ["프로젝트", "projects", Project],
    ["게시판", "board", Board],
    ["마이", "my", My],
  ];
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] justify-center shadow-2xl bg-white">
      <div className="relative w-full max-w-[400px] bg-white shadow-md">
        <Outlet />
        {!hideFooter && (
          <div className="fixed bottom-0 w-full max-w-[400px] flex bg-white border-t-1 border-black h-16 bg-[#FFFFFF]">
            {footerMenu.map((menu) => {
              const isActive = location.pathname === `/${menu[1]}`;
              return (
                <button
                  className="flex flex-1 items-center justify-center border-0 p-0 cursor-pointer"
                  onClick={() => navigate(`/${menu[1]}`)}
                >
                  <div className="flex flex-col gap-[2px] items-center">
                    <img src={menu[2]} className="size-5" alt="홈 아이콘" />
                    <p
                      className={`text-[10px] font-bold ${isActive ? "text-[#155DFC]" : "text-[#90A1B9]"}`}
                    >
                      {menu[0]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
