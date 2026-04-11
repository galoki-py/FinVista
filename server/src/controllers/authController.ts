import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [process.env.GOOGLE_CLIENT_ID!, process.env.ANDROID_CLIENT_ID!],
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    let user = await User.findOne({ googleId: payload.sub });

    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || 'Anonymous',
        picture: payload.picture,
        registrationStatus: { isRegistered: false }
      });
    }

    const token = jwt.sign(
      { userId: user._id, googleId: user.googleId },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, name, ...registrationData } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      registrationStatus: {
        isRegistered: true,
        location: {
          city: registrationData.city,
          area: registrationData.area
        },
        monthlyEarnings: registrationData.monthlyEarnings,
        averageMonthlySpending: registrationData.averageMonthlySpending,
        savingPolicies: registrationData.savingPolicies,
        investmentTargets: registrationData.investmentTargets,
        financialKnowledgeRating: registrationData.financialKnowledgeRating
      }
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const registrationData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.registrationStatus = {
      isRegistered: true,
      location: {
        city: registrationData.city,
        area: registrationData.area
      },
      monthlyEarnings: registrationData.monthlyEarnings,
      averageMonthlySpending: registrationData.averageMonthlySpending,
      savingPolicies: registrationData.savingPolicies,
      investmentTargets: registrationData.investmentTargets,
      financialKnowledgeRating: registrationData.financialKnowledgeRating
    };

    await user.save();
    res.json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}
