import Joi from 'joi';

export class UserValidation {
  public async validateCreateUser(payload) {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      contactNumber: Joi.string().length(10).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.string()
        .pattern(
          RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,20}$',
          ),
        )
        .message(
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be between 8 and 20 characters in length',
        )
        .required(),
      role: Joi.string().required(),
    });

    const { error } = schema.validate(payload);
    return error ? error.details[0].message.replace(/\"/g, '') : null;
  }
}
