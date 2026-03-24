import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Home from "../assets/footer/home.svg?react";
import Member from "../assets/footer/member.svg?react"; // 팀원 아이콘
import Project from "../assets/footer/project.svg?react"; // 프로젝트 아이콘
import Board from "../assets/footer/board.svg?react"; // 게시판 아이콘
import My from "../assets/footer/my.svg?react";
import { PATH } from "../components/path";

export default function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideFooterPaths = [PATH.ONBOARDING, PATH.LOGIN]; // 상수 활용
  const hideFooter = hideFooterPaths.some((path) => path === location.pathname);

  const footerMenu = [
    { label: "홈", path: PATH.HOME, icon: Home },
    { label: "팀원", path: PATH.MEMBER, icon: Member }, // member도 PATH에 있다면 교체 권장
    { label: "프로젝트", path: PATH.PROJECTS, icon: Project }, // "/project"로 일치됨
    { label: "게시판", path: PATH.BOARD, icon: Board },
    { label: "마이", path: PATH.MY, icon: My }, // "mypage" -> PATH.MY ("/my")로 수정
  ];

  return (
    <div className="flex min-h-[100dvh] justify-center shadow-2xl bg-white">
      <div className="relative w-full max-w-[400px] bg-white shadow-md">
        <Outlet />
        {!hideFooter && (
          <div className="fixed bottom-0 w-full max-w-[400px] flex border-t-1 border-black h-16 bg-[#FFFFFF]">
            {footerMenu.map((menu) => {
              // menu.path에 이미 "/"가 포함되어 있으므로 문자열 템플릿 수정
              const isActive = location.pathname === menu.path;
              const Icon = menu.icon;
              return (
                <button
                  key={menu.label}
                  className="flex flex-1 items-center justify-center border-0 p-0 cursor-pointer"
                  onClick={() => navigate(menu.path)} // 여기도 바로 menu.path 사용
                >
                  <div className="flex flex-col gap-[2px] items-center">
                    <Icon
                      className={`size-5 fill-none stroke-2 ${
                        isActive ? "text-[#155DFC]" : "text-[#90A1B9]"
                      }`}
                    />
                    <p
                      className={`text-[10px] font-bold ${
                        isActive ? "text-[#155DFC]" : "text-[#90A1B9]"
                      }`}
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