// // About.tsx
// import React from 'react';

// const About: React.FC = () => {
//   return (
//     <div>
//       <h2>About Page</h2>
//       <p>This is the about page.</p>
//       <div className="bg-blue-500 text-white p-4">
//       This is a component using Tailwind CSS!
//     </div>
//     </div>
    
//   );
// };

// export default About;

import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    fetchData();
  }, []);

  const getToken = () => {
    return localStorage.getItem("bearerAuth");
  };
  
  const token = getToken();

  const fetchData = async () => {
    const apiUrl = 'https://bookrental-production.up.railway.app/member';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          // Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <div>
      <h1>Fetching Data with Bearer Auth</h1>
      {/* Add your components or UI elements here */}
    </div>
  );
};

export default About;
