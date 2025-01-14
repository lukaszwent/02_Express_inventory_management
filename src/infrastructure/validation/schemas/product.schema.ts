import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(1).max(50).messages({
    "string.empty": "Name is required",
    "string.max": "Name cannot exceed 50 characters",
  }),

  description: Joi.string().required().min(1).max(50).messages({
    "string.empty": "Description is required",
    "string.max": "Description cannot exceed 50 characters",
  }),

  price: Joi.number().required().positive().messages({
    "number.positive": "Price must be positive",
  }),

  stock: Joi.number().required().min(0).messages({
    "number.min": "Stock cannot be negative",
  }),
});

export const restockProductSchema = Joi.object({
  quantity: Joi.number().required().positive().messages({
    "number.positive": "Restock quantity must be positive",
  }),
});

export const sellProductSchema = Joi.object({
  quantity: Joi.number().required().positive().messages({
    "number.positive": "Sell quantity must be positive",
  }),
});
