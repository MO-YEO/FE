import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [accessToken, navigate]);

  return (
    <>
      {accessToken && (
        <>
          <Outlet />a
        </>
      )}
    </>
  );
};

export default ProtectedLayout;
