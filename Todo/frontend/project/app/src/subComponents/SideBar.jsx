import React from 'react';

const SideBar = ({ userRole }) => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="flex flex-col">
 
        <div className="mb-6 text-center text-xl font-semibold">
          ToDo App
        </div>
        
        <div className="space-y-4">

          <div className="block px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700 cursor-pointer">
            Dashboard
          </div>

          {userRole === 'admin' && (
            <div className="block px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700 cursor-pointer">
              Admin Dashboard
            </div>
          )}
          <div className="block px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700 cursor-pointer">
            My Tasks
          </div>
          <div className="block px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700 cursor-pointer">
            Settings
          </div>
          <div className="block px-4 py-2 rounded-md text-gray-200 hover:bg-gray-700 cursor-pointer">
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
