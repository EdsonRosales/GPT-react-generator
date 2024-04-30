import { NavLink, Outlet } from "react-router-dom";
import { menuRoutes } from "../router/router";

export const DashboardLayout = () => {
  return (
    <main className="flex flex-row mt-7">
      <nav className="hidden sm:flex flex-col ml-5 w-[370px] min-h-[calc(100vh-3.0rem)] bg-white bg-opacity-10 p-5 rounded-3xl">
        <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent">
          ReactGPT<span className="text-indigo-500">.</span>
        </h1>
        <span className="text-xl">Bienvenido</span>

        <div className="border-gray-700 border my-3" />

        {/* Opciones del menú */}
        {
          menuRoutes.map((route) => (
            <NavLink
              key={route.to}
              to={route.to}
              className={({ isActive }) =>
                isActive
                  ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors'
                  : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'
              }
            >
              <i className={`${route.icon} text-2xl mr-4 text-indigo-400`}></i>
              <div className="flex flex-col flex-grow">
                <span className="text-white text-lg font-semibold">{route.title}</span>
                <span className="text-gray-400 text-sm">{route.description}</span>
              </div>
            </NavLink>
          ))
        }
        
      </nav>

      <section className="mx-3 sm:mx-20 flex flex-col w-full h-[calc(100vh-50px)]  bg-white bg-opacity-10 p-5 rounded-3xl">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-auto h-full p-1">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
