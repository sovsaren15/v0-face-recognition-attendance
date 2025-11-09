import React from 'react';
import { Link } from 'react-router-dom';
import AttendanceScanner from './AttendanceScanner';

const HomePage = () => {
 return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f5f7f8' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Scanner Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#3e6268' }}>
                  Face Recognition Scanner
                </h2>
                <AttendanceScanner />
              </div>
            </div>
          </div>

          {/* View Records Button Section */}
          <div className="lg:col-span-1 flex items-center justify-center">
            <Link
              to="/records"
              className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
              View Attendance Records
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;