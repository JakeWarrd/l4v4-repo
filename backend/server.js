const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./mongodb');
const User = require('./models/user');
const { generateToken, authenticateToken } = require('./tokenUtils');
const bcrypt = require('bcrypt');
const cors = require('cors');
const schedule = require('node-cron');

const app = express();

// ADD .ENV TO ALL NEEDED

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Function to validate an email address
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const resetTasks = async () => {
  try {
    // Retrieve all users from the database
    const users = await User.find();

    // Iterate over each user
    for (const user of users) {
      // Iterate through all the blocs and task sets to reset the tasks
      user.blocs.forEach((bloc) => {
        bloc.taskSets.forEach((taskSet) => {
          taskSet.tasks.forEach((task) => {
            task.checked = false;
          });
        });
      });

      // Save the updated user
      await user.save();
    }

    console.log('Tasks reset successfully for all users');
  } catch (error) {
    console.error('Error resetting tasks:', error);
  }
};

// In your scheduled task
schedule.schedule('0 0 * * *', async () => {
  try {
    await resetTasks();
    console.log('Tasks reset at the start of a new day');
  } catch (error) {
    console.error('Error resetting tasks:', error);
  }
});


// Routes
app.post('/signup', async (req, res) => {
  let { username, email, password } = req.body;

   // Convert the first letter of the email to lowercase
   email = email.charAt(0).toLowerCase() + email.slice(1);

  console.log('SERVER: ' + username);
  console.log('SERVER: ' + email);
  console.log('SERVER: ' + password);

  try {
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username: 3 characters minimum' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!password || password.length < 5) {
      return res.status(400).json({ message: 'Password: 5 characters minimum' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken({ id: newUser.id, username: newUser.username });
    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  let { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail) {
      return res.status(400).json({ message: 'Username or email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (usernameOrEmail.includes('@')) {
      // Convert the first letter of the email to lowercase
      const atIndex = usernameOrEmail.indexOf('@');
      usernameOrEmail = usernameOrEmail.charAt(0).toLowerCase() + usernameOrEmail.slice(1);
    }
    console.log('SERVER: ' + usernameOrEmail)

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = generateToken({ id: user.id, username: user.username });
    return res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Route to retrieve user data
app.get('/user', authenticateToken, async (req, res) => {
    try {
      // Retrieve the user's data based on the token payload (e.g., user ID)
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user's data
      res.json({ username: user.username, email: user.email, blocs: user.blocs });
    } catch (error) {
      console.error('Error retrieving user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.put('/user/change-username', authenticateToken, async (req, res) => {
    try {
      const { newUsername } = req.body;
      const userId = req.user.id;
  
      // Check if the new username is already taken
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
  
      // Update the user's username
      await User.findByIdAndUpdate(userId, { username: newUsername });
  
      res.json({ message: 'Username changed successfully' });
    } catch (error) {
      console.error('Error changing username:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

app.post('/user/saveBloc', authenticateToken, async (req, res) => {
  try {
    const blocData = req.body;
    const userId = req.user.id;

    console.log('Received blocData:', blocData);
    console.log('Received startTime:', blocData.taskSets[0].startTime);
    console.log('Received endTime:', blocData.taskSets[0].endTime);

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the bloc data to the user's blocs
    const newBloc = {
      blocName: blocData.blocName,
      taskSets: blocData.taskSets.map(taskSet => ({
        setName: taskSet.setName,
        tasks: taskSet.tasks.map(task => ({
          taskName: task.taskName,
        })),
        startTime: taskSet.startTime,
        endTime: taskSet.endTime,
      })),
    };

    user.blocs.push(newBloc);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Bloc data saved successfully' });
  } catch (error) {
    console.error('Error saving bloc:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/user/updateBloc', authenticateToken, async (req, res) => {
  try {
    const blocData = req.body;
    const userId = req.user.id;

    console.log('Received blocData:', blocData);
    console.log('Received blocID:', blocData.blocId);
    console.log('Searching for:', blocData.blocName);
    console.log('Received startTime:', blocData.taskSets[0].startTime);
    console.log('Received endTime:', blocData.taskSets[0].endTime);

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the bloc to update
    const blocIndex = user.blocs.findIndex((bloc) => bloc._id == blocData.blocId);

    console.log('INDEX:', blocIndex);

    if (blocIndex === -1) {
      return res.status(404).json({ message: 'Bloc not found' });
    }

    // Update the bloc data
    user.blocs[blocIndex].blocName = blocData.blocName;

    user.blocs[blocIndex].taskSets = blocData.taskSets.map((taskSet) => ({
      setName: taskSet.setName,
      tasks: taskSet.tasks.map((task) => ({
        taskName: task.taskName,
      })),
      startTime: taskSet.startTime,
      endTime: taskSet.endTime,
    }));

    // Save the updated user
    await user.save();

    console.log('Updated user:', user);

  
    res.status(200).json({ message: 'Bloc data updated successfully' });
  } catch (error) {
    console.error('Error updating bloc:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to retrieve user's blocs
app.get('/user/blocs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Retrieve the user's blocs based on the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userBlocs = user.blocs;

    // Return the user's blocs
    res.json(userBlocs);
  } catch (error) {
    console.error('Error retrieving user blocs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user/blocs/:blocId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const blocId = req.params.blocId;

    // Retrieve the user based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the bloc within the user's blocs array based on the bloc ID
    const bloc = user.blocs.find((bloc) => String(bloc._id) === String(blocId));

    if (!bloc) {
      return res.status(404).json({ message: 'Bloc not found' });
    }

    // Return the bloc details
    res.json(bloc);
  } catch (error) {
    console.error('Error retrieving bloc details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/user/blocs/:blocId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const blocId = req.params.blocId;

    // Retrieve the user based on the user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the bloc within the user's blocs array based on the bloc ID
    const blocIndex = user.blocs.findIndex((bloc) => String(bloc._id) === String(blocId));

    if (blocIndex === -1) {
      return res.status(404).json({ message: 'Bloc not found' });
    }

    // Remove the bloc from the user's blocs array
    user.blocs.splice(blocIndex, 1);

    // Save the updated user object
    await user.save();

    res.json({ message: 'Bloc deleted successfully' });
  } catch (error) {
    console.error('Error deleting bloc:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/user/tasks/update', authenticateToken, async (req, res) => {
  const { blocId, taskSetIndex, taskIndex, checked } = req.body;

  try {
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the bloc by blocId
    const bloc = user.blocs.find((bloc) => bloc._id.toString() === blocId);

    if (!bloc) {
      return res.status(404).json({ message: 'Bloc not found' });
    }

    // Access the specific task using the provided indices
    const task = bloc.taskSets[taskSetIndex].tasks[taskIndex];

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

  // Update the task's checked property
  console.log('Task before update:', task);
  task.checked = Boolean(checked); // Convert to boolean

  // Save the updated user
  await user.save();

  // Log the updated user
  console.log('User after update:', user);

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
});

app.get('/', (req, res) => {
    res.send('Servers awaiting requests...')
})

app.listen(8080, () => {
  console.log('Server running on port 8080');
  connectDB();
});
