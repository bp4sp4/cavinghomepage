import React from "react";

// Declare the global function if it's available in the window scope
declare global {
  interface Window {
    lecture_open0: (
      url: string,
      name: string,
      width: number,
      height: number
    ) => void;
  }
}

const QuickMenu: React.FC = () => {
  const handlePhoneCounselClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (
      typeof window !== "undefined" &&
      typeof window.lecture_open0 === "function"
    ) {
      window.lecture_open0(
        "https://korhrd.co.kr/service/call.asp",
        "lecture_2",
        500,
        650
      );
    } else {
      console.warn("lecture_open0 function is not available.");
      // Fallback for environments where window or lecture_open0 is not defined
      // window.open('https://korhrd.co.kr/service/call.asp', '_blank', 'width=500,height=650');
    }
  };

  return (
    <div id="side_area">
      <div className="quick_menu">
        <div className="quick-tit">
          <div className="icon">
            <img src="/images/ic-star.svg" alt="star icon" />
          </div>
          <h4>간편메뉴</h4>
        </div>
        <ul>
          <li>
            <a href="/service/counsel.asp">
              <div className="icon">
                <img src="/images/quick01.svg" alt="1:1 상담 아이콘" />
              </div>
              <span>1:1 상담</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={handlePhoneCounselClick}>
              <div className="icon">
                <img src="/images/quick02.svg" alt="전화상담 아이콘" />
              </div>
              <span>전화상담</span>
            </a>
          </li>
          <li>
            <a href="/application/lecturelist.asp">
              <div className="icon">
                <img src="/images/quick03.svg" alt="수강신청 아이콘" />
              </div>
              <span>수강신청</span>
            </a>
          </li>
          <li>
            <a href="/application/lecturelist_01_nicepay01.asp">
              <div className="icon">
                <img src="/images/quick04.svg" alt="자격증신청 아이콘" />
              </div>
              <span>자격증신청</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuickMenu;
