import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Home from "../assets/footer/home.svg?react";
import Member from "../assets/footer/member.svg?react"; // 팀원 아이콘
import Project from "../assets/footer/project.svg?react"; // 프로젝트 아이콘
import Board from "../assets/footer/board.svg?react"; // 게시판 아이콘
import My from "../assets/footer/my.svg?react";

export default function MobileLayout() {
  const location = useLocation();
  const hideFooterPaths = ["/onboarding", "/login"];

  const hideFooter = hideFooterPaths.includes(location.pathname);
  const footerMenu = [
    { label: "홈", path: "home", icon: Home },
    { label: "팀원", path: "member", icon: Member },
    { label: "프로젝트", path: "projects", icon: Project },
    { label: "게시판", path: "board", icon: Board },
    { label: "마이", path: "my", icon: My },
  ];
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[100dvh] justify-center shadow-2xl bg-white">
      <div className="relative w-full max-w-[400px] bg-white shadow-md">
        <Outlet />
        {!hideFooter && (
          <div className="fixed bottom-0 w-full max-w-[400px] flex border-t-1 border-black h-16 bg-[#FFFFFF]">
            {footerMenu.map((menu) => {
              const isActive = location.pathname === `/${menu.path}`;
              const Icon = menu.icon;
              return (
                <button
                  key={menu.label}
                  className="flex flex-1 items-center justify-center border-0 p-0 cursor-pointer"
                  onClick={() => navigate(`/${menu.path}`)}
                >
                  <div className="flex flex-col gap-[2px] items-center">
                    <Icon
                      className={`size-5 fill-none stroke-2 ${
                        isActive ? "text-[#155DFC]" : "text-[#90A1B9]"
                      }`}
                    />
                    <p
                      className={`text-[10px] font-bold ${isActive ? "text-[#155DFC]" : "text-[#90A1B9]"}`}
                    >
                      {menu.label}
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
