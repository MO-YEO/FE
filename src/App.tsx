import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/onBoarding';

// 만약 Login 페이지를 만드셨다면 아래 주석을 풀고 임포트하세요.
// import Login from './pages/Login'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 온보딩은 전체 화면으로 렌더링 */}
        <Route path="/" element={<Onboarding />} />

        {/* 나중에 로그인이 완성되면 아래처럼 추가하세요.
           현재는 Login 컴포넌트가 없어서 에러 방지를 위해 주석 처리합니다.
        */}
        {/* <Route path="/login" element={<div className="mx-auto max-w-md min-h-screen bg-white shadow-2xl"><Login /></div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;