export const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to fetch user data: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Error fetching user data');
    }
  };
  
  export const fetchUserBlocs = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/user/blocs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const userBlocs = await response.json();
        return userBlocs;
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to fetch user blocs: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error fetching user blocs:', error);
      throw new Error('Error fetching user blocs');
    }
  };
  