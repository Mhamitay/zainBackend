const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUserByEmail, createUser } = require('./usersHandlers')

const authLogIn = async (req, res) => {
  const { email, password, role } = req.body
  try {

    const user = await getUserByEmail(email)

    if (!user) {
      return res.status(400).send({
        validationError: true,
        message: 'invalid credintials.', 
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (user.role !== role) {
      return res.status(400).send({
        validationError: true,
        message: `invalid Role!. sure you are ${role}?`,
      })
    }

    if (!isMatch) {
      return res.status(400).send({
        validationError: true,
        message: 'invalid password.',
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    if (user)
      return res.status(200).json({ user, token })
  } catch (error) {
    console.error(error)
    res.status(500).send({
      serverError: true,
      message: 'unexpected error.' + error,
    })
  }
}

const registereUser = async (req, res) => {
  const { name, email, password, role,gender } = req.body

  try {
    // Check if user with email already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return res.status(400).send({
        validationError: true,
        message: 'user with the same email is already registered.',
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Create user in database
    const userId = await createUser({
      name,
      email,
      password: hashedPassword,
      role,
      image: gender === 'male' ? 'he.png' : 'she.jpg',
      isCertifyied: false,
      isVerifyied: false,
      rate: '0',
      showOnHomePage: true,
      bio: '',
    })
    
    // Generate JWT token
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return res.status(201).json({ userId, token })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error.')
  }
}

module.exports = { authLogIn, registereUser }
