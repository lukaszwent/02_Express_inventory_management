import Joi from "joi";

export const createOrderSchema = Joi.object({
  customerId: Joi.string().required().messages({
    "string.empty": "Customer ID is required",
  }),

  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().required().positive().messages({
          "number.positive": "Quantity must be positive",
        }),
      })
    )
    .required()
    .min(1)
    .messages({
      "array.min": "Order must contain at least one product",
    }),
});
