const jwt = require('jsonwebtoken');
import { useNavigation } from '@react-navigation/native';

// Generate a new token
const generateToken = (payload) => {
    const token = jwt.sign(payload, 'yugukey', { expiresIn: '24h' });
    return token;
};

// Verify and decode a token
const verifyToken = async (token) => {
  const navigation = useNavigation();

  try {
    const decoded = jwt.verify(token, 'yugukey');
    return decoded;
  } catch (error) {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Home');
    console.log('Logged out due to an invalid token');
    throw new Error('Invalid token');
  }
};


// Authenticate a token and return the decoded payload
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('Token is missing');
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  generateToken,
  authenticateToken,
};
