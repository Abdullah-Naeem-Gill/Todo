import React from 'react';

const NavBar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
       
        <div className="text-white text-2xl font-bold">
          <h1>TodoApp</h1>
        </div>

        <div className="hidden md:flex space-x-6">
          <span className="text-white">Home</span>
          <span className="text-white">Tasks</span>
          <span className="text-white">Create Task</span>
          <span className="text-white">Logout</span>
        </div>

        <div className="md:hidden">
          <button className="text-white">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
