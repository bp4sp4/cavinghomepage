import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white border-b-1 border-[#e5e5e5] mb-3">
   
      <div className="container max-w-[1280px] mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/logo2.png" alt="Logo" className="h-[28px] mr-2" />
            <span className="text-[28px] font-bold">한평생 요양보호사</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/introduction"
            className="text-gray-600 hover:text-gray-900"
          >
            교육원 소개
          </Link>
          <Link href="/courses" className="text-gray-600 hover:text-gray-900">
            수강신청
          </Link>
          <Link
            href="/certification"
            className="text-gray-600 hover:text-gray-900"
          >
            자격증발급
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-900">
            학습지원
          </Link>
          <Link href="/classroom" className="text-gray-600 hover:text-gray-900">
            학습강의실
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
