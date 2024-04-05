app.get('/api/students', authMiddleware, (req, res) => {
    if (req.user.role !== 'student') {
      return res.status(403).send('Forbidden.');
    } 
    // Return student data
    res.status(200).json({ name: 'Hammad', roll: '123456' });
  });  
app.get('/api/instructors', authMiddleware, (req, res) => {
    if (req.user.role !== 'instructor') {
      return res.status(403).send('Forbidden.');
    }
  
    // Return instructor data
    res.status(200).json({ name: 'Hammad', courses: [] });
  });