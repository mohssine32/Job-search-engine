import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="/*bg-white*/ bg-green-500 border-black border-[1px] ">
            <div className="w-[1280px]  h-16 mx-auto flex justify-between">
                <div className=" text-4xl md:text-5xl font-black uppercase tracking-tight text-black drop-shadow-sm hover:tracking-wider transition-all duration-300">
                    JOBYoum
                </div>
                <div className="  flex justify-center items-center gap-3 ">
                     <button className=" h-[50px] w-[170px] border-b-4 border-transparent    hover:border-[#822BD1] transition duration-300 font-bold"><Link to="/">Trouver un entreprise</Link></button>
                        <button className=" h-[50px] w-[120px] border-b-4 border-transparent hover:border-[#822BD1] transition duration-300 font-bold"><Link to="/jobpage">Trouver un job</Link></button>
                        <button className=" h-[50px] w-[120px] border-b-4 border-transparent hover:border-[#822BD1] transition duration-300 font-bold"><Link to="/">Home</Link></button>
               
                    <button className="bg-gray-100 h-[50px] w-[80px] rounded-lg border-black border-[1px] h-[50px] w-[80px] font-bold"><Link to="/login">Login</Link></button>
                    <button className="bg-[#822BD1] text-white h-[50px] w-[80px] rounded-lg border-black border-[1px] cursor-pointer mr-[5px] font-bold"><Link to="/register">Register</Link></button>
                </div>


            </div>

        </nav>
    );
}

export default Navbar;



