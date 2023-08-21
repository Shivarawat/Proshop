import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModal.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (err) {
      res.status(401);
      throw new Error('Not Authorized, Token Failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not Authorized, No Token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    req.status(401);
    throw new Error('Not Authorized as Admin');
  }
};

// This is chatgpt answer and it is correct
// const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
//       next();
//     } catch (err) {
//       res.status(401).json({ error: 'Not Authorized, Token Failed' });
//     }
//   } else {
//     res.status(401).json({ error: 'Not Authorized, No Token' });
//   }
// });

export { protect, admin };
